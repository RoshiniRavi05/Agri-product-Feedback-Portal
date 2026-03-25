import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        if (!user) navigate('/login');
        if (user && user.role === 'admin') navigate('/admin');
    }, [user, navigate]);

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) return;
            try {
                const res = await api.get('/users/profile');
                setCart(res.data.cart);
                if (res.data.cart.length === 0) {
                    navigate('/cart');
                }
            } catch (err) {
                console.error("Error fetching cart", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user, navigate]);

    const handleConfirmCheckout = async () => {
        setIsCheckingOut(true);
        try {
            await api.post('/users/checkout');
            alert("Order Placed Successfully! Thank you for choosing Bannari Amman Agro.");
            navigate('/orders'); // Go to Order History
        } catch (error) {
            alert("Error during checkout");
            setIsCheckingOut(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Checkout...</h3></div>;

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '40px' }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

                {/* Order Summary */}
                <div style={{ flex: '1.5', minWidth: '300px' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Order Summary</h2>
                    <div className="card" style={{ padding: '20px' }}>
                        {cart.map(item => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: '500', color: '#34495e' }}>{item.product_name}</span>
                                <span style={{ color: '#7f8c8d' }}>1x</span>
                            </div>
                        ))}
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed #bdc3c7', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total Items:</span>
                            <span>{cart.length}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Details */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Shipping Details</h2>
                    <div className="card" style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}><strong>Name:</strong> {user?.name}</p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}><strong>Phone:</strong> {user?.phone}</p>
                        <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}><strong>Delivery Village:</strong> {user?.village}</p>

                        <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', color: '#2e7d32', marginBottom: '20px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 'bold' }}>✓ Cash on Delivery Available</span>
                        </div>

                        <button
                            className="btn"
                            style={{
                                width: '100%',
                                backgroundColor: isCheckingOut ? '#7f8c8d' : '#27ae60',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '15px',
                                fontSize: '1.2rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isCheckingOut ? 'not-allowed' : 'pointer'
                            }}
                            onClick={handleConfirmCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? 'Processing Order...' : 'Place Order Now'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
