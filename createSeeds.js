const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

mongoose.connect('mongodb://localhost:27017/agri-feedback-portal').then(async () => {
    const seedExists = await Product.findOne({ category: 'Seed' });
    if (!seedExists) {
        await Product.create([
            {
                product_name: 'Bannari Premium Tomato Seed',
                brand: 'Bannari Amman',
                category: 'Seed',
                product_type: 'Common',
                image_path: '/assets/products/tomato-seed.jpg',
                description: 'High yield hybrid tomato seed suitable for all seasons. Shows excellent resistance to pests.',
                manufacturer: 'Bannari Amman Agro'
            },
            {
                product_name: 'Bannari IR-50 Paddy Seed',
                brand: 'Bannari Amman',
                category: 'Seed',
                product_type: 'Common',
                image_path: '/assets/products/paddy-seed.jpg',
                description: 'Drought-resistant short duration paddy seed. High milling percentage with premium grain quality.',
                manufacturer: 'Bannari Amman Agro'
            },
            {
                product_name: 'Bannari Organic Cotton Seed',
                brand: 'Bannari Amman',
                category: 'Seed',
                product_type: 'Common',
                image_path: '/assets/products/cotton-seed.jpg',
                description: 'Certified organic cotton seed giving exceptional boll size and staple length. Free from GMOs.',
                manufacturer: 'Bannari Amman Agro'
            }
        ]);
        console.log('Seed products added.');
    } else {
        console.log('Seeds already exist.');
    }
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
