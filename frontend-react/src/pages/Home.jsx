import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '10vh' }}>
            <img src="/assets/logo/agri-logo.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
            <h1 className="site-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                {t('title')}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }}>
                Empowering farmers to report issues with seeds, fertilizers, and farming tools.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {user ? (
                    <Link to="/products" className="btn btn-secondary">
                        Browse Product Catalog
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
