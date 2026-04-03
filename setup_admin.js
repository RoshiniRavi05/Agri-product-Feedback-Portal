const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./backend/models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const setupAdmin = async () => {
    rl.question('Please paste your MongoDB Atlas Connection String (the same one you put in Render): ', async (mongoUri) => {
        try {
            console.log('Connecting to database...');
            await mongoose.connect(mongoUri.trim());
            console.log('Connected natively to Production Database!');

            rl.question('Enter the 10-digit Phone Number you want to use for Admin Login: ', async (phone) => {
                rl.question('Enter a secure password for your Admin account: ', async (password) => {
                    
                    try {
                        const existingUser = await User.findOne({ phone: phone.trim() });
                        
                        if (existingUser) {
                            console.log('User already exists! Upgrading their role to Admin...');
                            existingUser.role = 'admin';
                            existingUser.password = password.trim(); 
                            await existingUser.save();
                            console.log('Success! Account has been upgraded to Admin.');
                        } else {
                            console.log('Creating new Admin account...');
                            await User.create({
                                name: 'Administrator',
                                phone: phone.trim(),
                                password: password.trim(),
                                village: 'Admin HQ',
                                gender: 'other',
                                role: 'admin'
                            });
                            console.log('Success! Admin account created.');
                        }
                    } catch (error) {
                        console.error('Failed to create/upgrade Admin:', error);
                    } finally {
                        mongoose.connection.close();
                        rl.close();
                        process.exit(0);
                    }
                });
            });

        } catch (err) {
            console.error('Failed to connect to MongoDB. Make sure your connection string is correct!', err);
            process.exit(1);
        }
    });
};

setupAdmin();
