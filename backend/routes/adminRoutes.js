const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Alert = require('../models/Alert');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user_id', 'name phone village')
            .populate('product_id', 'product_name brand category')
            .sort({ timestamp: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Defective Product Alerts (Threshold > 20)
// @route   GET /api/admin/alerts
// @access  Private/Admin
const getQualityAlerts = async (req, res) => {
    try {
        // Fetch all alerts from the database, both active and resolved
        const alerts = await Alert.find({})
            .populate('product_id', 'product_name brand category manufacturer')
            .sort({ status: 1, created_at: -1 }); // Active first, then by date

        // Format output to match frontend expectations or update frontend
        const formattedAlerts = alerts.map(alert => ({
            _id: alert._id, // Needed for resolve action
            product: alert.product_id,
            review_count: alert.review_count,
            message: alert.alert_message,
            status: alert.status,
            created_at: alert.created_at
        }));

        res.json(formattedAlerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Analytics Data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        const totalProducts = await Product.countDocuments();
        const User = require('../models/User');
        const totalFarmers = await User.countDocuments({ role: 'farmer' });

        // Reviews by Category
        const reviewsByCategory = await Review.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Most Reviewed Products
        const mostReviewed = await Review.aggregate([
            {
                $group: {
                    _id: '$product_id',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const populatedMostReviewed = await Product.populate(mostReviewed, { path: '_id', select: 'product_name brand' });

        // Average Ratings by Product
        const averageRatings = await Review.aggregate([
            {
                $group: {
                    _id: '$product_id',
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        const populatedAverageRatings = await Product.populate(averageRatings, { path: '_id', select: 'product_name brand' });

        res.json({
            totalReviews,
            totalProducts,
            totalFarmers,
            reviewsByCategory,
            mostReviewed: populatedMostReviewed,
            averageRatings: populatedAverageRatings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resolve an alert
// @route   PUT /api/admin/alerts/:id/resolve
// @access  Private/Admin
const resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        alert.status = 'resolved';
        await alert.save();

        res.json({ message: 'Alert resolved successfully', alert });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Acknowledge a review and add admin comment
// @route   PUT /api/admin/reviews/:id/acknowledge
// @access  Private/Admin
const acknowledgeReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.is_acknowledged = true;
        review.admin_comment = req.body.admin_comment || '';
        review.acknowledged_at = new Date();
        await review.save();

        res.json({ message: 'Review acknowledged successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
const getAllFarmers = async (req, res) => {
    try {
        // We import User model here since it is not imported at the top
        const User = require('../models/User');
        const farmers = await User.find({ role: 'farmer' }).select('-password').sort({ createdAt: -1 });
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

router.route('/reviews').get(protect, admin, getAllReviews);
router.route('/reviews/:id/acknowledge').put(protect, admin, acknowledgeReview);
router.route('/alerts').get(protect, admin, getQualityAlerts);
router.route('/alerts/:id/resolve').put(protect, admin, resolveAlert);
router.route('/analytics').get(protect, admin, getAnalytics);
router.route('/farmers').get(protect, admin, getAllFarmers);

module.exports = router;
