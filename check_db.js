const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

async function checkDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/agri-portal');

        const products = await Product.find({});
        console.log(`Found ${products.length} products in DB.`);
        products.forEach(p => console.log(p.product_name));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDB();
