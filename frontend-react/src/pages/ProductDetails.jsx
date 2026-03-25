import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            const data = await getProductById(id);
            if (!data) {
                navigate('/products');
                return;
            }
            setProduct(data);
            try {
                const res = await api.get(`/reviews/product/${id}`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews", err);
            }
        };
        loadData();
    }, [id, navigate]);

    if (!product) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading product details...</h3></div>;

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Breadcrumb pseudo */}
            <div style={{ padding: '20px 0', color: '#6B7280', fontSize: '0.9rem' }}>
                Home &gt; Products &gt; <span style={{ color: '#009245', fontWeight: 'bold' }}>{product.name}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'flex-start', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

                {/* Left Side: Product Image */}
                <div style={{ flex: '1', minWidth: '350px', backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '40px', display: 'flex', justifyContent: 'center', border: '1px solid #E5E7EB' }}>
                    <img
                        src={product.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : '/assets/logo/bannari-logo.svg'}
                        alt={product.name}
                        style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'contain' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo/bannari-logo.svg'; }}
                    />
                </div>

                {/* Right Side: Product Details & Action */}
                <div style={{ flex: '1.2', minWidth: '350px', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#1F2937', fontWeight: 'bold', marginBottom: '10px' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#6B7280', marginBottom: '20px' }}>By <strong>{product.brand}</strong></p>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                        <span style={{ backgroundColor: '#D4E9D5', color: '#009245', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {product.category}
                        </span>
                        <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {product.productType}
                        </span>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginTop: 0, color: '#1F2937', marginBottom: '15px', fontSize: '1.3rem' }}>Product Description</h3>
                        <p style={{ lineHeight: '1.8', color: '#4B5563', fontSize: '1.05rem', margin: 0 }}>
                            {product.description || "Specifically engineered to resolve major agricultural detriments. This formulation strictly obeys quality guidelines established for top-tier agronomical yield amplification."}
                        </p>
                    </div>

                    {(!user || user.role !== 'admin') ? (
                        <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#009245', fontWeight: 'bold' }}>
                                <span style={{ fontSize: '1.2rem' }}>✓</span> In Stock & Ready to Ship
                            </div>

                            <button
                                style={{
                                    width: '100%',
                                    fontSize: '1.2rem',
                                    padding: '18px 20px',
                                    backgroundColor: '#EFF702',
                                    color: '#1F2937',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                                onClick={async () => {
                                    if (!user) {
                                        navigate('/login', { state: { from: `/products/${product.id}` } });
                                        return;
                                    }
                                    try {
                                        const { default: api } = await import('../services/api');
                                        await api.post('/users/cart', { productId: product.id });
                                        // Seamless redirect instead of alert
                                        navigate('/cart');
                                    } catch (error) {
                                        if (error.response && error.response.data && error.response.data.message) {
                                            alert(error.response.data.message);
                                        } else {
                                            alert("Could not add to cart");
                                        }
                                    }
                                }}
                            >
                                <span style={{ fontSize: '1.3rem' }}>🛒</span> Add to Cart
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: 'auto', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '8px', color: '#92400E', textAlign: 'center' }}>
                            <strong>Admin View:</strong> You cannot purchase products as an administrator.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
