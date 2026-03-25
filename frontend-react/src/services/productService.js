import api from './api';

export const getAllProducts = async () => {
    try {
        const response = await api.get('/products');
        // Map backend schema to frontend expected shape
        return response.data.map(p => ({
            id: p._id,
            name: p.product_name,
            brand: p.brand,
            category: p.category,
            productType: p.product_type,
            image: p.image_path || '/assets/logo/agri-logo.png',
            description: p.description,
            manufacturer: p.manufacturer
        }));
    } catch (error) {
        console.error("Error fetching connecting to backend products API:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    const products = await getAllProducts();
    return products.find(p => p.id === id);
};
