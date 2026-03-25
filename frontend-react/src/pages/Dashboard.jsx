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
        </div>
    );
};

export default Dashboard;
