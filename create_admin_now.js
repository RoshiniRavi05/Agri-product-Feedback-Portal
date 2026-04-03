const mongoose = require('mongoose');
const User = require('./backend/models/User');

const setupAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect('mongodb+srv://roshini12ar_db_user:2VN9bS6uckaAcsdQ@cluster0.pmhwnys.mongodb.net/?appName=Cluster0');
        console.log('Connected to Atlas successfully!');

        const phone = '9999999999';
        const password = 'admin';

        const existingUser = await User.findOne({ phone });
        
        if (existingUser) {
            existingUser.role = 'admin';
            existingUser.password = password;
            await existingUser.save();
            console.log('Admin account updated successfully');
        } else {
            await User.create({
                name: 'Administrator',
                phone: phone,
                password: password,
                village: 'Admin HQ',
                gender: 'other',
                role: 'admin'
            });
            console.log('Admin account created successfully');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
};

setupAdmin();
