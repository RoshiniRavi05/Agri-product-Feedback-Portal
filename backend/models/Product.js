const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Liquid', 'Powder', 'Common']
    },
    image_path: {
        type: String,
        default: null
    },
    description: {
        type: String,
    },
    manufacturer: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
