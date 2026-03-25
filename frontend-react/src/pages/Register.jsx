import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [village, setVillage] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, phone, village, 'farmer', password);
            navigate('/dashboard');
        } catch (error) {
            alert('Registration failed.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
            <div className="card">
                <h2>Register as Farmer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Village Name</label>
                        <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-secondary">Register</button>
                </form>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
