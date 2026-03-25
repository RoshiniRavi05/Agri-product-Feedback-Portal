const mongoose = require('mongoose');
const User = require('./backend/models/User');

const farmersToInsert = [
    { name: 'Ramesh Kandasamy', phone: '9876543210', village: 'Sathyamangalam', password: 'password123', role: 'farmer' },
    { name: 'Suresh Kumar', phone: '9876543211', village: 'Anthiyur', password: 'password123', role: 'farmer' },
    { name: 'Karthik Raja', phone: '9876543212', village: 'Gobichettipalayam', password: 'password123', role: 'farmer' },
    { name: 'Muthu Vel', phone: '9876543213', village: 'Perundurai', password: 'password123', role: 'farmer' },
    { name: 'Kumaran', phone: '9876543214', village: 'Bhavani', password: 'password123', role: 'farmer' },
    { name: 'Muruganandam', phone: '9876543215', village: 'Talavadi', password: 'password123', role: 'farmer' },
    { name: 'Venkatesan', phone: '9876543216', village: 'Modakkurichi', password: 'password123', role: 'farmer' },
    { name: 'Senthil Nathan', phone: '9876543217', village: 'Erode', password: 'password123', role: 'farmer' },
    { name: 'Prakash Raj', phone: '9876543218', village: 'Appakudal', password: 'password123', role: 'farmer' },
    { name: 'Rajesh Khanna', phone: '9876543219', village: 'Kavindapadi', password: 'password123', role: 'farmer' },
    { name: 'Arun Pandian', phone: '9876543220', village: 'Nambiyur', password: 'password123', role: 'farmer' },
    { name: 'Vijay Sethu', phone: '9876543221', village: 'Kanjikoil', password: 'password123', role: 'farmer' },
    { name: 'Kamal Haasan', phone: '9876543222', village: 'Vellakoil', password: 'password123', role: 'farmer' },
    { name: 'Rajinikanth', phone: '9876543223', village: 'Kangeyam', password: 'password123', role: 'farmer' },
    { name: 'Sivakumar', phone: '9876543224', village: 'Dharapuram', password: 'password123', role: 'farmer' }
];

async function seedFarmers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/agri-feedback-portal');
        console.log('Connected to MongoDB');

        for (const farmer of farmersToInsert) {
            // Check if user exists
            const existing = await User.findOne({ phone: farmer.phone });
            if (!existing) {
                await User.create(farmer);
                console.log(`Created farmer: ${farmer.name}`);
            } else {
                console.log(`Farmer with phone ${farmer.phone} already exists.`);
            }
        }

        console.log('Seeding farmers finished!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding farmers:', err);
        process.exit(1);
    }
}

seedFarmers();
