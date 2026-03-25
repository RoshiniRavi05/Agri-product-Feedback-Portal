import React from 'react';
import AdminDashboardComponent from '../components/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Basic admin middleware protection
    React.useEffect(() => {
        if (!user) navigate('/login');
        if (user && user.role !== 'admin') navigate('/dashboard');
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return <AdminDashboardComponent />;
};

export default AdminPage;
