const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user profile with cart and purchases
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (user) {
            if (user.cart.length < 3) {
                const countNeeded = 3 - user.cart.length;
                const randomProducts = await Product.aggregate([
                    { $match: { _id: { $nin: user.cart } } },
                    { $sample: { size: countNeeded } }
                ]);
                if (randomProducts.length > 0) {
                    user.cart.push(...randomProducts.map(p => p._id));
                    await user.save();
                }
            }
            user = await User.findById(req.user._id).populate('cart').populate('purchases');
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                village: user.village,
                cart: user.cart,
                purchases: user.purchases
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product to cart
// @route   POST /api/users/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Check if already in cart
            if (user.cart.includes(productId)) {
                return res.status(400).json({ message: 'Product already in cart' });
            }
            user.cart.push(productId);
            await user.save();
            res.json({ message: 'Product added to cart', cart: user.cart });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (user) {
            user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
            
            if (user.cart.length < 3) {
                const countNeeded = 3 - user.cart.length;
                const randomProducts = await Product.aggregate([
                    { $match: { _id: { $nin: user.cart } } },
                    { $sample: { size: countNeeded } }
                ]);
                if (randomProducts.length > 0) {
                    user.cart.push(...randomProducts.map(p => p._id));
                }
            }
            
            await user.save();
            user = await User.findById(req.user._id).populate('cart');
            res.json({ message: 'Product removed from cart', cart: user.cart });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Checkout cart (move to purchases)
// @route   POST /api/users/checkout
// @access  Private
const checkoutCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (user.cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            // Move all cart items to purchases, avoiding duplicates
            user.cart.forEach(productId => {
                if (!user.purchases.includes(productId)) {
                    user.purchases.push(productId);
                }
            });
            // Empty the cart
            user.cart = [];
            await user.save();

            // Return updated user profile
            const updatedUser = await User.findById(req.user._id).populate('cart').populate('purchases');
            res.json({ message: 'Checkout successful', purchases: updatedUser.purchases });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, addToCart, removeFromCart, checkoutCart };
