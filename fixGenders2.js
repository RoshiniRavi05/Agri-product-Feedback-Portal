const mongoose = require('mongoose');
const User = require('./backend/models/User');

mongoose.connect('mongodb://localhost:27017/agri-feedback-portal').then(async () => {
    const users = await User.find({ role: 'farmer' });
    let count = 0;
    for (let u of users) {
        // Let's make names like "senthil", "kumar" male, and "roshini", "marakatham" female.
        let isFemale = /roshini|marakatham|megalai|thamarai|rani|devi/i.test(u.name);
        u.gender = isFemale ? 'female' : 'male';
        await User.updateOne({ _id: u._id }, { $set: { gender: u.gender } });
        count++;
    }
    console.log(`Updated ${count} users with gender.`);
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
