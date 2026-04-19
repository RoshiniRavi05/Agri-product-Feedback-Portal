const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    review_title: {
        type: String,
        default: ''
    },
    feedback_text: {
        type: String,
        required: true,
    },
    feedback_type: { // formerly complaint_type
        type: String,
        required: true,
        enum: ['text', 'voice', 'image']
    },
    complaint_category: { // Kept for legacy/analytics or 'Category'
        type: String,
        enum: ['Quality', 'Effectiveness', 'Packaging', 'Fake Product', 'Other'],
        default: 'Other'
    },
    voice_recording: { // new field if stored separately, but currently handled via stt text
        type: String,
        default: null
    },
    image_attachment: { // formerly image_path
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    is_acknowledged: {
        type: Boolean,
        default: false
    },
    admin_comment: {
        type: String,
        default: ''
    },
    acknowledged_at: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
