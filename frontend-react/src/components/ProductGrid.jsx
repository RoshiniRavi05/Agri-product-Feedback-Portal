import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getAllProducts } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { user } = useAuth();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const catParam = queryParams.get('category');
    const typeParam = queryParams.get('type');

    // Edit Modal State
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        product_name: '', brand: '', category: '', product_type: '', description: '', image: null
    });

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            alert("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            alert("Error deleting product");
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditForm({
            product_name: product.name || '',
            brand: product.brand || '',
            category: product.category || '',
            product_type: product.productType || '',
            description: product.description || '',
            image: null
        });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', editForm.product_name);
        formData.append('brand', editForm.brand);
        formData.append('category', editForm.category);
        formData.append('product_type', editForm.product_type);
        formData.append('description', editForm.description);
        if (editForm.image) {
            formData.append('image', editForm.image);
        }

        try {
            await api.put(`/products/${editingProduct.id}`, formData);
            alert("Product updated successfully");
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            alert("Error updating product");
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center', width: '100%' }}>Loading products...</p>;
    }

    const displayProducts = products.filter(p => {
        const matchCategory = !catParam || (p.category && p.category.toLowerCase().includes(catParam.toLowerCase()));
        const matchType = !typeParam || (p.productType && p.productType.toLowerCase() === typeParam.toLowerCase());
        return matchCategory && matchType;
    });

    if (displayProducts.length === 0) {
        return <p style={{ textAlign: 'center', width: '100%' }}>No products found in this category.</p>;
    }

    return (
        <>
            <div className="product-grid">
                {displayProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={() => handleEditClick(product)}
                        onDelete={() => handleDelete(product.id)}
                    />
                ))}
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ marginTop: 0 }}>Edit Product</h2>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                                <input type="text" placeholder="Product Name" value={editForm.product_name} onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                                <input type="text" placeholder="Brand" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} required style={{ flex: 1, padding: '8px' }}>
                                    <option value="">Select Category...</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Pesticide">Pesticide</option>
                                    <option value="Tool">Tool</option>
                                </select>
                                <select value={editForm.product_type} onChange={(e) => setEditForm({ ...editForm, product_type: e.target.value })} required style={{ flex: 1, padding: '8px' }}>
                                    <option value="">Select Type...</option>
                                    <option value="Liquid">Liquid</option>
                                    <option value="Powder">Powder</option>
                                    <option value="Common">Common</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>New Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })} style={{ width: '100%' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <textarea placeholder="Product Description" rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn" style={{ backgroundColor: '#ccc', color: '#333' }} onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button type="submit" className="btn btn-secondary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductGrid;
