const Review = require('../models/Review');
const Product = require('../models/Product');
const Alert = require('../models/Alert');

const REVIEW_THRESHOLD = 20;

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { product_id, feedback_text, feedback_type, review_title } = req.body;
        const image_attachment = req.file ? `/uploads/${req.file.filename}` : null;

        if (!product_id) {
            return res.status(400).json({ message: 'Product selection is required' });
        }

        const review = new Review({
            user_id: req.user._id,
            product_id,
            review_title: review_title || '',
            feedback_text: feedback_text || '',
            feedback_type,
            image_attachment,
            complaint_category: req.body.complaint_category || 'Other',
            rating: req.body.rating ? parseInt(req.body.rating) : 0,
        });

        const createdReview = await review.save();

        // --- Quality Alert Logic ---
        const reviewCount = await Review.countDocuments({ product_id });

        if (reviewCount >= REVIEW_THRESHOLD) {
            // Check if an active alert already exists for this product
            const activeAlert = await Alert.findOne({ product_id, status: 'active' });

            if (!activeAlert) {
                // Fetch product details for the message
                const product = await Product.findById(product_id);

                const alertMessage = `Alert: ${product.product_name} (${product.brand}) has received ${reviewCount} reviews. Possible defective batch detected.`;

                const newAlert = new Alert({
                    product_id,
                    review_count: reviewCount, // mapping metric logic
                    alert_message: alertMessage,
                    status: 'active'
                });
                await newAlert.save();
                console.log(`[ALERT GENERATED] ${alertMessage}`);
            } else {
                // If there's an active alert, we can optionally update its count
                activeAlert.review_count = reviewCount;
                activeAlert.alert_message = `Alert: Active alert. Product has received ${reviewCount} reviews.`;
                await activeAlert.save();
            }
        }
        // ---------------------------

        res.status(201).json(createdReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get farmer's own reviews
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user_id: req.user._id })
            .populate('product_id', 'product_name brand')
            .sort({ timestamp: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId })
            .populate('user_id', 'name')
            .sort({ timestamp: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getMyReviews, getProductReviews };
