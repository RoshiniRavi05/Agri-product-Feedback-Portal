const mongoose = require('mongoose');

async function resetDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/agri-feedback-portal');
        await mongoose.connection.collection('products').drop().catch(e => { });
        console.log('Products collection dropped successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error dropping products collection:', err);
        process.exit(1);
    }
}

resetDB();
