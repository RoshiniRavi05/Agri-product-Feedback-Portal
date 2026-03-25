const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Product = require('./backend/models/Product');
const Review = require('./backend/models/Review');

const feedbackTypes = ['text', 'voice'];
const categories = ['Quality', 'Effectiveness', 'Packaging', 'Fake Product', 'Other'];

const positiveTexts = [
    "Amazing product, worked exactly as expected.",
    "Great yield this year, highly recommend.",
    "Fantastic quality, will definitely buy again.",
    "Very satisfied with the results.",
    "Excellent packaging and great performance."
];

const neutralTexts = [
    "It was okay, nothing special.",
    "Did the job, but yield was average.",
    "Standard quality, might look for alternatives next time.",
    "Met expectations, but packaging could be better.",
    "Fairly effective, but took a while to see results."
];

const negativeTexts = [
    "Terrible quality, ruined my crops.",
    "Did not work at all. Very disappointed.",
    "Packaging was completely busted upon arrival.",
    "Yield was significantly lower than promised.",
    "I suspect this was a fake product."
];

async function seedFeedbacks() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/agri-feedback-portal');
        console.log('Connected to MongoDB');

        const farmers = await User.find({ role: 'farmer' });
        if (farmers.length === 0) {
            console.log('No farmers found. Please register some farmers first.');
            process.exit(0);
        }

        const products = await Product.find({});
        if (products.length === 0) {
            console.log('No products found.');
            process.exit(0);
        }

        const reviewsToCreate = [];

        for (let i = 0; i < 100; i++) {
            const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomFeedbackType = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            // Determine sentiment randomly (1 = negative, 2 = neutral, 3 = positive)
            const sentiment = Math.floor(Math.random() * 3) + 1;
            let rating, feedback_text;

            if (sentiment === 1) { // Negative
                rating = Math.floor(Math.random() * 2) + 1; // 1 or 2
                feedback_text = negativeTexts[Math.floor(Math.random() * negativeTexts.length)];
            } else if (sentiment === 2) { // Neutral
                rating = 3;
                feedback_text = neutralTexts[Math.floor(Math.random() * neutralTexts.length)];
            } else { // Positive
                rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
                feedback_text = positiveTexts[Math.floor(Math.random() * positiveTexts.length)];
            }

            reviewsToCreate.push({
                user_id: randomFarmer._id,
                product_id: randomProduct._id,
                rating: rating,
                review_title: randomCategory,
                feedback_text: feedback_text,
                feedback_type: randomFeedbackType,
                complaint_category: randomCategory,
                timestamp: new Date()
            });
        }

        await Review.insertMany(reviewsToCreate);
        console.log(`Successfully seeded 100 new reviews!`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding feedbacks:', err);
        process.exit(1);
    }
}

seedFeedbacks();
