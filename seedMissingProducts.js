const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

mongoose.connect('mongodb://localhost:27017/agri-feedback-portal').then(async () => {
    
    // Check for Bio Fungicides
    const fungicideExists = await Product.findOne({ category: 'Bio Fungicide' });
    if (!fungicideExists) {
        await Product.create([
            {
                product_name: 'Bannari Trichoderma Viride',
                brand: 'Bannari Amman',
                category: 'Bio Fungicide',
                product_type: 'Powder',
                image_path: '/assets/products/bio-fungicide-1.jpg',
                description: 'Effective against soil borne plant pathogens causing root rot, damping off, wilt and collar rot.',
                manufacturer: 'Bannari Amman Agro'
            },
            {
                product_name: 'Bannari Pseudomonas Fluorescens',
                brand: 'Bannari Amman',
                category: 'Bio Fungicide',
                product_type: 'Liquid',
                image_path: '/assets/products/bio-fungicide-2.jpg',
                description: 'Protects crops from many soil borne plant pathogens. Controls fungal and bacterial diseases.',
                manufacturer: 'Bannari Amman Agro'
            }
        ]);
        console.log('Bio Fungicides added.');
    }

    // Check for Bio Insecticides
    const insecticideExists = await Product.findOne({ category: 'Bio Insecticide' });
    if (!insecticideExists) {
        await Product.create([
            {
                product_name: 'Bannari Beauveria Bassiana',
                brand: 'Bannari Amman',
                category: 'Bio Insecticide',
                product_type: 'Powder',
                image_path: '/assets/products/bio-insecticide-1.jpg',
                description: 'Entomopathogenic fungus that causes white muscardine disease in insects.',
                manufacturer: 'Bannari Amman Agro'
            },
            {
                product_name: 'Bannari Metarhizium Anisopliae',
                brand: 'Bannari Amman',
                category: 'Bio Insecticide',
                product_type: 'Liquid',
                image_path: '/assets/products/bio-insecticide-2.jpg',
                description: 'Biological insecticide acting against pests like root weevils, plant hoppers, and beetles.',
                manufacturer: 'Bannari Amman Agro'
            }
        ]);
        console.log('Bio Insecticides added.');
    }

    // Check for Biostimulants
    const biostimulantExists = await Product.findOne({ category: 'Biostimulant' });
    if (!biostimulantExists) {
        await Product.create([
            {
                product_name: 'Bannari Humic Acid',
                brand: 'Bannari Amman',
                category: 'Biostimulant',
                product_type: 'Liquid',
                image_path: '/assets/products/biostimulant-1.jpg',
                description: 'Enhances soil physical properties, increases nutrient uptake and root development.',
                manufacturer: 'Bannari Amman Agro'
            },
            {
                product_name: 'Bannari Seaweed Extract',
                brand: 'Bannari Amman',
                category: 'Biostimulant',
                product_type: 'Powder',
                image_path: '/assets/products/biostimulant-2.jpg',
                description: 'Rich in natural plant growth hormones, trace elements, and amino acids.',
                manufacturer: 'Bannari Amman Agro'
            }
        ]);
        console.log('Biostimulants added.');
    }

    console.log('Database seeded with missing categories.');
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
