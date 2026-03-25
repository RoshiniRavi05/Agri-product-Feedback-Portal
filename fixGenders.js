const mongoose = require('mongoose');
const User = require('./backend/models/User');

mongoose.connect('mongodb://localhost:27017/agri-feedback-portal').then(async () => {
    const users = await User.find();
    for (let u of users) {
        if (!u.gender) {
            u.gender = Math.random() > 0.5 ? 'male' : 'female';
            await User.updateOne({ _id: u._id }, { $set: { gender: u.gender } });
        }
    }
    console.log('Updated users with gender.');
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
