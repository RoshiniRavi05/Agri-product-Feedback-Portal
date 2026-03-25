import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(phone, password);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const loggedUser = JSON.parse(userStr);
                if (loggedUser.role === 'admin') {
                    navigate('/admin');
                    return;
                }
            }
            
            const from = location.state?.from || '/dashboard';
            navigate(from);
        } catch (error) {
            alert('Login failed. Please check credentials.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
            <div className="card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-secondary">Login</button>
                </form>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
