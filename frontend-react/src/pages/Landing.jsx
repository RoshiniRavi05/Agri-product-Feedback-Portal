import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Login state
    const [loginPhone, setLoginPhone] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Register state
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regVillage, setRegVillage] = useState('');
    const [regGender, setRegGender] = useState('male');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            await login(loginPhone, loginPassword);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const loggedUser = JSON.parse(userStr);
                if (loggedUser.role === 'admin') {
                    navigate('/admin');
                    return;
                }
            }
            navigate('/dashboard');
        } catch (error) {
            setLoginError('Login failed. Please check credentials.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError('');
        try {
            await api.post('/users/register', {
                name: regName,
                phone: regPhone,
                village: regVillage,
                gender: regGender,
                role: 'farmer',
                password: regPassword
            });
            // Switch to login tab and pre-fill phone
            setLoginPhone(regPhone);
            setIsLogin(true);
            alert("Registration successful! Please login.");
        } catch (error) {
            setRegError('Registration failed. Phone number might already be in use.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'var(--bg-color)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Left Side: Hero / Features */}
            <div style={{
                flex: '1.2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px',
                backgroundColor: '#1b5e20',
                color: 'white',
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            }}>
                <img src="/assets/logo/agri-logo.png" alt="Agri Logo" style={{ width: '120px', marginBottom: '30px', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }} />
                <h1 style={{ color: '#fff', fontSize: '3.5rem', textAlign: 'left', margin: '0 0 20px 0', lineHeight: '1.2' }}>
                    Grow Your Future with Confidence.
                </h1>
                <p style={{ fontSize: '1.3rem', color: '#e8f5e9', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
                    Join the ultimate portal for farmers to purchase authentic agricultural products and share genuine feedback directly with the community.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%', fontSize: '1.5rem' }}>🎙️</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Multilingual Voice Feedback</h3>
                            <p style={{ margin: 0, color: '#c8e6c9', fontSize: '0.95rem' }}>Review products in your native language effortlessly.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%', fontSize: '1.5rem' }}>🔒</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Verified Purchases Only</h3>
                            <p style={{ margin: 0, color: '#c8e6c9', fontSize: '0.95rem' }}>Read trusted reviews built exclusively by verified buyers.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%', fontSize: '1.5rem' }}>📦</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Direct Supply Deliveries</h3>
                            <p style={{ margin: 0, color: '#c8e6c9', fontSize: '0.95rem' }}>Order safely to your village with cash on delivery.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px'
            }}>
                <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '15px' }}>

                    {/* Tab Switcher */}
                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            style={{
                                flex: 1, padding: '15px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                                color: isLogin ? 'var(--primary-color)' : '#999',
                                borderBottom: isLogin ? '3px solid var(--primary-color)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            style={{
                                flex: 1, padding: '15px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                                color: !isLogin ? 'var(--primary-color)' : '#999',
                                borderBottom: !isLogin ? '3px solid var(--primary-color)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {/* Forms */}
                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit}>
                            <h2 style={{ marginBottom: '5px', color: '#333' }}>Welcome Back</h2>
                            <p style={{ color: '#777', marginBottom: '25px' }}>Sign in to continue to your dashboard.</p>

                            {loginError && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '15px' }}>{loginError}</p>}

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Phone Number</label>
                                <input type="text" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} required placeholder="Enter your 10-digit number" style={{ padding: '15px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Password</label>
                                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required placeholder="••••••••" style={{ padding: '15px' }} />
                            </div>
                            <button type="submit" className="btn" style={{ padding: '15px', fontSize: '1.2rem' }}>Sign In</button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit}>
                            <h2 style={{ marginBottom: '5px', color: '#333' }}>Create an Account</h2>
                            <p style={{ color: '#777', marginBottom: '25px' }}>Join the farming community today.</p>

                            {regError && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '15px' }}>{regError}</p>}

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Full Name</label>
                                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="e.g. Senthil Kumar" style={{ padding: '12px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Phone Number</label>
                                <input type="text" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required placeholder="Enter 10-digit number" style={{ padding: '12px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Village / Location</label>
                                <input type="text" value={regVillage} onChange={(e) => setRegVillage(e.target.value)} required placeholder="e.g. Pollachi" style={{ padding: '12px' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Gender</label>
                                <select value={regGender} onChange={(e) => setRegGender(e.target.value)} required style={{ padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #ccc' }}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label style={{ fontSize: '0.95rem', color: '#555' }}>Password</label>
                                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="Create a strong password" style={{ padding: '12px' }} />
                            </div>
                            <button type="submit" className="btn btn-secondary" style={{ padding: '15px', fontSize: '1.2rem' }}>Register Account</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Landing;
