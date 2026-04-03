const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./database/schema');
const authRoutes = require('./backend/routes/authRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const reviewRoutes = require('./backend/routes/reviewRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const Product = require('./backend/models/Product');

dotenv.config();

// Connect to Database
connectDB().then(() => {
    seedProducts();
});

async function seedProducts() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const bannariProducts = [
                { product_name: "BANNARI BIO COCO MIX", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOPHOSPHATE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI AMMAN BIOCOMPOST", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI AMMAN BIOSUPER", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI PHEROMONE TRAP – BRINJAL SHOOT & FRUIT BORER", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – FRUIT FLY", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – FALL ARMY WORM", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – SUGARCANE INTERNODE BORER", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – SUGARCANE EARLY SHOOT BORER", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – RED PALM WEEVIL", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI PHEROMONE TRAP – RHINOCEROS BEETLE", product_type: "Common", category: "Tool" },
                { product_name: "BANNARI SILICA SOLUBILIZER", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI NITRO FIX", product_type: "Liquid", category: "Bio Fertilizer", exact_img: "nitro-fix.png" },
                { product_name: "BANNARI NITRO FIX (PULSES)", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "NITRO-FIX (SUGARCANE, BEETROOT & COFFEE)", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI NITRO FIX (HORTICULTURAL CROPS)", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI NITRO FIX (HILL SIDE CROPS)", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI P – SOLUBILIZER", product_type: "Liquid", category: "Bio Fertilizer", exact_img: "phospho-bacteria.png" },
                { product_name: "BANNARI K – MOBILIZER", product_type: "Liquid", category: "Bio Fertilizer", exact_img: "potash-bacteria.png" },
                { product_name: "BANNARI NPK CONSORTIA", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI ZN – SOLUBILIZER", product_type: "Common", category: "Bio Fertilizer", exact_img: "zinc-solubilizing.png" },
                { product_name: "BANNARI VAM", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI PSEUDO CARE", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI ROOT CARE (TH)", product_type: "Powder", category: "Pesticide" },
                { product_name: "BANNARI ROOT CARE (TV)", product_type: "Powder", category: "Pesticide" },
                { product_name: "BANNARI LEAF CARE", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI LEAF GUARD", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI INSECT CONTROLLER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI PEST HUNTER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI LARVA HUNTER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI LARVA TERMINATOR", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI GRUB HUNTER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI GRUB FIGHTER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI NEMATODE HUNTER", product_type: "Liquid", category: "Pesticide" },
                { product_name: "BANNARI NEMATODE HUNTER (PC)", product_type: "Powder", category: "Pesticide" },
                { product_name: "BANNARI BIO DECOMPOSER", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIO SEPTIC TANK CLEANER", product_type: "Powder", category: "Tool" },
                { product_name: "BANNARI MICRONUTRIENT MIXTURE – Coconut & Fruit crops", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI VEGETABLE MICRONUTRIENT MIXTURE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI PADDY MICRONUTRIENT MIXTURE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI SUGARCANE MICRONUTRIENT MIXTURE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI COCONUT MICRONUTRIENT MIXTURE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI BANANA MICRONUTRIENT MIXTURE", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – SUGARCANE DRIP SPECIAL", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – BANANA DRIP SPECIAL", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – COCONUT DRIP SPECIAL", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – SUGARCANE FOLIAR", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – BANANA FOLIAR", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – VEGETABLE FOLIAR", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOLOGICAL BOOST – TURMERIC FOLIAR", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI GARDEN MIX", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI PANCHAKAVYA", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI HUMIC K PLUS", product_type: "Powder", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOZYME", product_type: "Liquid", category: "Bio Fertilizer" },
                { product_name: "BANNARI BIOGEL", product_type: "Common", category: "Bio Fertilizer" }
            ].map(p => ({
                product_name: p.product_name,
                brand: "Bannari Amman Sugars Ltd.",
                category: p.category,
                product_type: p.product_type,
                image_path: p.exact_img ? `assets/products/${p.exact_img}` : (p.product_type === 'Liquid' ? 'assets/products/generic-liquid.png' : (p.product_type === 'Powder' ? 'assets/products/generic-powder.png' : 'assets/products/generic-trap.png')),
                description: `Bannari Amman Organic ${p.category} Product`,
                manufacturer: "Bannari Amman Sugars Ltd."
            }));

            await Product.insertMany(bannariProducts);
            console.log('38 Bannari products seeded successfully.');
        }
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, 'frontend-react', 'dist');
app.use(express.static(frontendPath));

// Fallback to index.html for Single Page Applications (React Router)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
