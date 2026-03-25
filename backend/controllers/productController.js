const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { product_name, brand, category, product_type, manufacturer, description } = req.body;

        let image_path = null;
        if (req.file) {
            image_path = `/uploads/${req.file.filename}`;
        }

        const product = new Product({
            product_name,
            brand: brand || 'Bannari Amman Sugars Ltd.',
            category,
            product_type: product_type || 'Common',
            manufacturer: manufacturer || 'Bannari Amman Sugars Ltd.',
            description,
            image_path
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { product_name, brand, category, product_type, manufacturer, description } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.product_name = product_name || product.product_name;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.product_type = product_type || product.product_type;
            product.manufacturer = manufacturer || product.manufacturer;
            product.description = description || product.description;

            if (req.file) {
                product.image_path = `/uploads/${req.file.filename}`;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
