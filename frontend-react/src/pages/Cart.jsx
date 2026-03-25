import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) navigate('/login');
        if (user && user.role === 'admin') navigate('/admin');
    }, [user, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await api.get('/users/profile');
                setCart(res.data.cart);
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleRemoveFromCart = async (productId) => {
        try {
            const res = await api.delete(`/users/cart/${productId}`);
            if (res.data.cart) {
                setCart(res.data.cart);
            } else {
                setCart(prev => prev.filter(p => p._id !== productId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="container">Loading Cart...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>🛒</span>
                <h2 style={{ color: '#1f2937', margin: 0, fontSize: '2rem', fontWeight: '800' }}>My Cart</h2>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px', opacity: 0.3 }}>🛍️</div>
                        <h3 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '12px', fontWeight: '700' }}>Your cart is completely empty</h3>
                        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '1.1rem' }}>Explore our catalog and find the best products for your farm.</p>
                        <Link to="/products" style={{ backgroundColor: '#009245', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 146, 69, 0.2)' }}>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div style={{ padding: '0 32px' }}>
                            {cart.map((item, idx) => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', padding: '32px 0', borderBottom: idx !== cart.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                                        <img
                                            src={item.image_path ? (item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`) : '/assets/logo/bannari-logo.svg'}
                                            alt={item.product_name}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div style={{ flex: '1', padding: '0 32px' }}>
                                        <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '1.4rem', fontWeight: '700' }}>{item.product_name}</h3>
                                        <span style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#047857', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromCart(item._id)}
                                        style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        Remove ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6' }}>
                            <div>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', fontWeight: '500' }}>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})</p>
                                <p style={{ margin: '6px 0 0 0', color: '#111827', fontSize: '1.8rem', fontWeight: '800' }}>Ready for Checkout</p>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                style={{ backgroundColor: '#009245', color: 'white', border: 'none', fontWeight: 'bold', padding: '16px 32px', fontSize: '1.15rem', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 6px 15px -3px rgba(0, 146, 69, 0.3)', transition: 'transform 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Proceed to Checkout ➔
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
