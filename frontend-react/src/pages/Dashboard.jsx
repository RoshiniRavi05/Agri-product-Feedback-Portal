import React, { useEffect, useState } from 'react';
import ReviewList from '../components/ReviewList';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({ cart: [], purchases: [] });
    const [loading, setLoading] = useState(true);
    const [reviewProduct, setReviewProduct] = useState(null);
    const [myReviews, setMyReviews] = useState([]);

    useEffect(() => {
        if (!user) navigate('/login');
        if (user && user.role === 'admin') navigate('/admin');
    }, [user, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();

        const fetchMyReviews = async () => {
            if (!user) return;
            try {
                const res = await api.get('/reviews/my');
                setMyReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews", err);
            }
        };
        fetchMyReviews();
    }, [user]);

    const handleRemoveFromCart = async (productId) => {
        try {
            const res = await api.delete(`/users/cart/${productId}`);
            setProfile(prev => ({ ...prev, cart: prev.cart.filter(p => p._id !== productId) }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await api.post('/users/checkout');
            alert("Checkout successful! Thank you for your purchase.");
            // Refresh profile data
            const updatedProfile = await api.get('/users/profile');
            setProfile(updatedProfile.data);
        } catch (error) {
            alert("Error during checkout");
        }
    };

    if (!user || user.role === 'admin') return null;

    if (loading) return <div className="container">Loading Dashboard...</div>;

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <h2 style={{ color: 'var(--primary-color)' }}>Welcome, {user?.name}</h2>
            <p style={{ color: '#555' }}>Village: {user?.village} | Phone: {user?.phone}</p>
            
            {/* Past Reviews */}
            <div id="reviews" className="card" style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                    <h2>{t('myReviews')}</h2>
                    <Link to="/products" className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px', margin: 0 }}>
                        Browse More Products
                    </Link>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <ReviewList adminView={false} />
                </div>
            </div>

            {/* Admin Responses / Acknowledgements */}
            {myReviews.some(r => r.is_acknowledged) && (
                <div className="card" style={{ marginTop: '30px', borderLeft: '5px solid #2e7d32' }}>
                    <h2 style={{ color: '#2e7d32', marginBottom: '16px' }}>📬 Admin Responses to Your Feedback</h2>
                    <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.9rem' }}>
                        The following feedbacks have been reviewed and acknowledged by the admin.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {myReviews.filter(r => r.is_acknowledged).map(r => (
                            <div key={r._id} style={{
                                padding: '14px 16px', borderRadius: '8px',
                                background: '#f1f8e9', border: '1px solid #a5d6a7'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                    <strong style={{ color: '#1b5e20' }}>
                                        {r.product_id?.product_name || 'Product'}
                                    </strong>
                                    <span style={{ fontSize: '0.78rem', color: '#555' }}>
                                        Submitted: {new Date(r.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#333', marginBottom: '8px' }}>
                                    <em>"{r.feedback_text}"</em>
                                </div>
                                <div style={{
                                    padding: '8px 12px', background: '#c8e6c9',
                                    borderRadius: '6px', fontSize: '0.88rem', color: '#1b5e20'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>✅ Admin Response</span>
                                    {r.acknowledged_at && (
                                        <span style={{ fontSize: '0.75rem', color: '#388e3c', marginLeft: '8px' }}>
                                            ({new Date(r.acknowledged_at).toLocaleDateString()})
                                        </span>
                                    )}
                                    {r.admin_comment ? (
                                        <div style={{ marginTop: '4px' }}>{r.admin_comment}</div>
                                    ) : (
                                        <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#388e3c' }}>Your feedback has been acknowledged. No additional comment.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
