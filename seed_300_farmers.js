const mongoose = require('mongoose');
const User = require('./backend/models/User');

const firstNames = ["Arun", "Babu", "Chandran", "Devaraj", "Elango", "Ganesh", "Hari", "Ilan", "Jeeva", "Kannan", "Lakshman", "Mani", "Nataraj", "Om", "Prabhu", "Ram", "Siva", "Thiru", "Udhay", "Vel", "Anbu", "Bala", "Chelliah", "Durai", "Eshwar", "Gopal", "Harish", "Iniyan", "Janaki", "Karthik", "Ravi", "Sundar", "Murali", "Dinesh", "Senthil", "Venkatesh", "Vijay", "Ajith", "Surya", "Vikram"];
const lastNames = ["Raja", "Kumar", "Nathan", "Swamy", "Pandian", "Raj", "Muthu", "Gounder", "Thevar", "Chettiar", "Prasad", "Pillai", "Iyer", "Nair", "Reddy", "Rao", "Naidu", "Babu", "Vel", "Kannan", "Murugan", "Sami", "Sekar", "Selvam", "Rajan", "Ramamurthy", "Krishnan", "Venkat", "Subramaniam", "Balaji"];
const villages = ["Erode", "Sathyamangalam", "Anthiyur", "Gobichettipalayam", "Perundurai", "Bhavani", "Talavadi", "Modakkurichi", "Appakudal", "Kavindapadi", "Nambiyur", "Kanjikoil", "Vellakoil", "Kangeyam", "Dharapuram", "Tiruppur", "Coimbatore", "Pollachi", "Mettupalayam", "Palladam", "Avinashi", "Udumalpet", "Karur", "Namakkal", "Salem", "Dharmapuri", "Krishnagiri", "Hosur", "Ooty", "Coonoor", "Kotagiri"];

function generateRandomPhone() {
    let phone = '9';
    for (let i = 0; i < 9; i++) {
        phone += Math.floor(Math.random() * 10);
    }
    return phone;
}

async function seedFarmers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/agri-feedback-portal');
        console.log('Connected to MongoDB');

        const farmersToInsert = [];
        for (let i = 0; i < 300; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const village = villages[Math.floor(Math.random() * villages.length)];

            farmersToInsert.push({
                name: `${firstName} ${lastName}`,
                phone: generateRandomPhone(),
                village: village,
                password: 'password123',
                role: 'farmer'
            });
        }

        let insertedCount = 0;
        for (const farmer of farmersToInsert) {
            const existing = await User.findOne({ phone: farmer.phone });
            if (!existing) {
                await User.create(farmer);
                insertedCount++;
            }
        }

        console.log(`Seeding finished. Inserted ${insertedCount} new farmers.`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding farmers:', err);
        process.exit(1);
    }
}
seedFarmers();
