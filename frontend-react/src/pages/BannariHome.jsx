import React, { useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const BannariHome = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeCategory = queryParams.get('category') || '';
    const activeType = queryParams.get('type') || '';

    useEffect(() => {
        if (location.hash === '#contact') {
            const el = document.getElementById('contact');
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    const handleFilterClick = (filterType, filterValue) => {
        if (filterType === 'category') {
            navigate(`/?category=${filterValue}`);
        } else if (filterType === 'type') {
            navigate(`/?type=${filterValue}`);
        } else {
            navigate(`/`);
        }
    };

    const getBtnStyle = (filterType, filterValue) => {
        let isActive = false;
        if (!filterType) {
            isActive = !activeCategory && !activeType;
        } else if (filterType === 'category') {
            isActive = activeCategory === filterValue;
        } else if (filterType === 'type') {
            isActive = activeType === filterValue;
        }

        return {
            padding: '10px 20px',
            backgroundColor: isActive ? '#009245' : 'white',
            color: isActive ? 'white' : '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
        };
    };



    return (
        <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1592982537447-6f2c3bf9d7a2?auto=format&fit=crop&w=1500&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px'
                }}>
                    <h1 style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                        Make Farming More Profitable
                    </h1>
                    <p style={{ color: '#fff', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '30px' }}>
                        Proven State of the Art Technology with Naturally Enriched Bio Fertilizers. Good for the Soil and Soul.
                    </p>
                    <a href="#products-section" style={{
                        backgroundColor: '#EFF702',
                        color: '#1F2937',
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseOver={e => e.target.style.opacity = '0.9'}
                    onMouseOut={e => e.target.style.opacity = '1'}
                    >
                        Explore Products
                    </a>
                </div>
            </div>

            {/* Products Section */}
            <div id="products-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#1F2937', marginBottom: '10px' }}>Our Products</h2>
                    <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
                        A range of scientifically formulated bio-solutions to meet all your agricultural needs.
                    </p>
                </div>

                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap'
                }}>
                    <div style={getBtnStyle(null, null)} onClick={() => handleFilterClick(null, null)}>All Products</div>
                    <div style={getBtnStyle('type', 'Powder')} onClick={() => handleFilterClick('type', 'Powder')}>Powder</div>
                    <div style={getBtnStyle('category', 'Seed')} onClick={() => handleFilterClick('category', 'Seed')}>Seeds</div>
                    <div style={getBtnStyle('type', 'Liquid')} onClick={() => handleFilterClick('type', 'Liquid')}>Liquid</div>
                    <div style={getBtnStyle('category', 'Fertilizer')} onClick={() => handleFilterClick('category', 'Fertilizer')}>Fertilizer</div>
                </div>

                <ProductGrid />
            </div>
            
            {/* Contact / Get a Quote Section */}
            <div id="contact" style={{ backgroundColor: '#F9FAFB', padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', flexWrap: 'wrap', backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
                    {/* Left Info Side */}
                    <div style={{ flex: '1 1 400px', backgroundColor: '#F0FDF4', color: '#166534', padding: '60px 40px', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontWeight: '800', lineHeight: 1.2 }}>Get a Custom<br/>Quote</h2>
                        <p style={{ fontSize: '1.15rem', marginBottom: '40px', opacity: 0.9, lineHeight: 1.6 }}>
                            Interested in bulk orders or customized fertilizer plans for your farm? Connect with our agricultural experts today. We're here to help you maximize your yield.
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(22, 101, 52, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>📞</div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Call us direct</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>04295 250260</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(22, 101, 52, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>📧</div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Email support</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>experts@bannari.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Form Side */}
                    <div style={{ flex: '1 1 500px', padding: '60px 40px', backgroundColor: 'white' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '30px', fontWeight: '700' }}>Send us a message</h3>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => { e.preventDefault(); alert('Quote Request Sent! Our team will contact you soon.'); e.target.reset(); }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>Your Name</label>
                                    <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', color: '#111827', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#16A34A'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>Phone Number</label>
                                    <input type="tel" placeholder="+91 xxxxx xxxxx" required style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', color: '#111827', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#16A34A'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>Email Address</label>
                                <input type="email" placeholder="john@example.com" required style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', color: '#111827', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#16A34A'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>Requirements / Crop Details</label>
                                <textarea placeholder="Tell us about your farm size, crop type, and specific needs..." rows="5" required style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', color: '#111827', resize: 'vertical', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#16A34A'} onBlur={e => e.target.style.borderColor = '#d1d5db'}></textarea>
                            </div>
                            <button type="submit" style={{ backgroundColor: '#16A34A', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)' }} onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 12px -2px rgba(22, 163, 74, 0.3)'; }} onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 6px -1px rgba(22, 163, 74, 0.2)'; }}>
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <footer style={{ backgroundColor: '#1F2937', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
                <p>&copy; 2026 Bannari ANFU Clone. All Rights Reserved. (Integrated with Agri Portal)</p>
            </footer>
        </div>
    );
};

export default BannariHome;
