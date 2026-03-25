import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerList from '../components/CustomerList';

const AdminUsers = () => {
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
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Registered Farmers (Users)</h1>
            <div className="card">
                <CustomerList />
            </div>
        </div>
    );
};

export default AdminUsers;
