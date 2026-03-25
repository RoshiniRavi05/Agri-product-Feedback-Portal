import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
    const [feedbacksDropdownOpen, setFeedbacksDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path || (path === '/products' && location.pathname.startsWith('/products/'));
        return {
            color: 'white',
            textDecoration: isActive ? 'underline' : 'none',
            whiteSpace: 'nowrap',
            fontSize: '15px',
            fontWeight: '600'
        };
    };

    const dropdownItemStyle = {
        padding: '12px 20px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        display: 'block'
    };

    return (
        <div style={{ fontFamily: '"Inter", sans-serif' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 50px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src="/assets/logo/agri-logo.png" alt="Logo" style={{ height: '50px', marginRight: '15px' }} />
                    <span style={{ color: '#009245', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', flexDirection: 'column' }}>
                        <span>Bannari Amman Sugars Ltd.</span>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Agri Natural Fertilizer Unit</span>
                    </span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ backgroundColor: '#E5E7EB', padding: '8px', borderRadius: '50%' }}>📞</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 'bold' }}>Talk to Our Experts</span>
                            <span style={{ color: '#009245', fontWeight: 'bold' }}>04295 250260</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <nav style={{ 
                backgroundColor: '#009245', 
                padding: '0 50px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                height: '60px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', height: '100%' }}>
                    <Link to="/" style={getLinkStyle('/')}>Home</Link>
                    
                    <div 
                        style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <div style={{ ...getLinkStyle('/products'), cursor: 'pointer', padding: '20px 0' }}>Products ▾</div>
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                borderRadius: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: '150px',
                                zIndex: 100,
                                overflow: 'hidden'
                            }}>
                                <Link to="/?type=Powder" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Powder</Link>
                                <Link to="/?category=Seed" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Seeds</Link>
                                <Link to="/?type=Liquid" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Liquid</Link>
                                <Link to="/?category=Fertilizer" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Fertilizer</Link>
                                <Link to="/" style={{ ...dropdownItemStyle, borderTop: '1px solid #eee' }} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>All Products</Link>
                            </div>
                        )}
                    </div>
                    
                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin" style={getLinkStyle('/admin')}>Admin Dashboard</Link>
                            <div 
                                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={() => setFeedbacksDropdownOpen(true)}
                                onMouseLeave={() => setFeedbacksDropdownOpen(false)}
                            >
                                <div style={{ ...getLinkStyle('/admin/feedbacks'), cursor: 'pointer', padding: '20px 0' }}>Feedbacks ▾</div>
                                {feedbacksDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: '150px',
                                        zIndex: 100,
                                        overflow: 'hidden'
                                    }}>
                                        <Link to="/admin/feedbacks?rating=positive" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Positive</Link>
                                        <Link to="/admin/feedbacks?rating=neutral" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Neutral</Link>
                                        <Link to="/admin/feedbacks?rating=negative" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Negative</Link>
                                        <Link to="/admin/feedbacks" style={{ ...dropdownItemStyle, borderTop: '1px solid #eee' }} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>All Feedbacks</Link>
                                    </div>
                                )}
                            </div>
                            
                            <div 
                                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={() => setUsersDropdownOpen(true)}
                                onMouseLeave={() => setUsersDropdownOpen(false)}
                            >
                                <div style={{ ...getLinkStyle('/admin/users'), cursor: 'pointer', padding: '20px 0' }}>Users ▾</div>
                                {usersDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: '150px',
                                        zIndex: 100,
                                        overflow: 'hidden'
                                    }}>
                                        <Link to="/admin/users?filter=male" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Male</Link>
                                        <Link to="/admin/users?filter=female" style={dropdownItemStyle} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Female</Link>
                                        <Link to="/admin/users" style={{ ...dropdownItemStyle, borderTop: '1px solid #eee' }} onMouseOver={e => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>All Users</Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user && user.role !== 'admin' && location.pathname !== '/' && (
                        <Link to="/dashboard" style={{
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            ⭐ Feedback & Reviews
                        </Link>
                    )}

                    {user && user.role !== 'admin' && location.pathname !== '/' && (
                        <>
                            <Link to="/orders" style={getLinkStyle('/orders')}>📦 My Orders</Link>
                            <Link to="/cart" style={getLinkStyle('/cart')}>🛒 Cart</Link>
                        </>
                    )}

                    {!user || location.pathname === '/' ? (
                        <>
                            <Link to="/login" onClick={() => { if (user) logout(); }} style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                        </>
                    ) : (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Logout</a>
                    )}
                    
                    <Link to="/#contact" onClick={(e) => {
                        if (location.pathname === '/') {
                            const el = document.getElementById('contact');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }} style={{ 
                        backgroundColor: '#EFF702', 
                        color: '#1F2937', 
                        padding: '10px 20px', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        marginLeft: '15px'
                    }}>
                        Get A Quote
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
