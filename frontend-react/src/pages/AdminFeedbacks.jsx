import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReviewList from '../components/ReviewList';

const AdminFeedbacks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return <div className="container">Checking access...</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Total Feedbacks</h1>
            <div className="card">
                <ReviewList adminView={true} searchEnabled={true} />
            </div>
        </div>
    );
};

export default AdminFeedbacks;
