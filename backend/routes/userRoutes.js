const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, addToCart, removeFromCart, checkoutCart } = require('../controllers/userController');

// All user routes are protected
router.route('/profile').get(protect, getUserProfile);
router.route('/cart').post(protect, addToCart);
router.route('/cart/:productId').delete(protect, removeFromCart);
router.route('/checkout').post(protect, checkoutCart);

module.exports = router;
