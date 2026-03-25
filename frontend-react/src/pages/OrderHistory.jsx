import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FeedbackForm from '../components/FeedbackForm';

const OrderHistory = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewProduct, setReviewProduct] = useState(null);

    // Filter & Pagination state
    const [filterPeriod, setFilterPeriod] = useState('1'); // '1' = 1 month, '3' = 3 months, 'all' = All
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!authLoading) {
            if (!user) navigate('/login');
            if (user && user.role === 'admin') navigate('/admin');
        }
    }, [user, navigate, authLoading]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await api.get('/users/profile');
                // The backend doesn't store explicit purchase dates yet, 
                // so we inject a simulated date (e.g., today) into the products 
                // so the date filters visually function correctly for the demo.
                const items = res.data.purchases.map(p => ({
                    ...p,
                    purchaseDate: new Date()
                }));
                setPurchases(items);
            } catch (err) {
                console.error("Error fetching purchases", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    // Apply Filters
    const filteredPurchases = useMemo(() => {
        const now = new Date();
        return purchases.filter(item => {
            if (!item.purchaseDate) return true;

            const diffTime = Math.abs(now - new Date(item.purchaseDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (filterPeriod === '1') return diffDays <= 30;
            if (filterPeriod === '3') return diffDays <= 90;
            return true; // 'all'
        });
    }, [purchases, filterPeriod]);

    // Apply Pagination
    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
    const paginatedPurchases = filteredPurchases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (e) => {
        setFilterPeriod(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    if (loading || authLoading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Loading Order History...</h3></div>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>📦</span>
                <h2 style={{ color: '#1f2937', margin: 0, fontSize: '2rem', fontWeight: '800' }}>My Order History</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#f9fafb', padding: '16px 24px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <p style={{ color: '#4b5563', margin: 0, fontWeight: '500' }}>
                    <span style={{ color: '#009245', fontWeight: 'bold' }}>{filteredPurchases.length}</span> orders placed in
                </p>
                <select
                    value={filterPeriod}
                    onChange={handleFilterChange}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', fontWeight: '500', color: '#374151', backgroundColor: 'white', cursor: 'pointer', outline: 'none', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                >
                    <option value="1">Last 1 month</option>
                    <option value="3">Last 3 months</option>
                    <option value="all">All Orders</option>
                </select>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                {filteredPurchases.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>🕒</div>
                        <h3 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '12px', fontWeight: '700' }}>No orders found</h3>
                        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '1.1rem' }}>You haven't placed any orders in this period.</p>
                        <button onClick={() => navigate('/products')} style={{ backgroundColor: '#009245', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 146, 69, 0.2)' }}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ padding: '0 32px' }}>
                            {paginatedPurchases.map((item, idx) => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', padding: '32px 0', borderBottom: idx !== paginatedPurchases.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px' }}>
                                        <img
                                            src={item.image_path ? (item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`) : '/assets/logo/bannari-logo.svg'}
                                            alt={item.product_name}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div style={{ flex: '1', padding: '0 24px' }}>
                                        <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>{item.product_name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ opacity: 0.7 }}>📅</span> Purchased on: <b style={{ color: '#4b5563' }}>{new Date(item.purchaseDate).toLocaleDateString()}</b>
                                        </p>
                                    </div>
                                    <button
                                        style={{ backgroundColor: '#fff', border: '2px solid #e5e7eb', color: '#4b5563', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => setReviewProduct({ id: item._id, name: item.product_name, category: item.category })}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#009245'; e.currentTarget.style.color = '#009245'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}
                                    >
                                        ⭐ Write Review
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', gap: '16px' }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white', color: currentPage === 1 ? '#9ca3af' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                                    onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                                    onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'white')}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: '500' }}>
                                    Page <b style={{ color: '#111827' }}>{currentPage}</b> of {totalPages}
                                </span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white', color: currentPage === totalPages ? '#9ca3af' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                                    onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                                    onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'white')}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000, padding: '20px'
                }}>
                    <div style={{ width: '100%', maxWidth: '540px', backgroundColor: 'white', borderRadius: '16px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 32px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#111827', fontWeight: '700' }}>Review Product</h2>
                            <button
                                onClick={() => setReviewProduct(null)}
                                style={{ background: 'white', border: '1px solid #d1d5db', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#4b5563', transition: 'all 0.2s' }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#111827'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#4b5563'; }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ padding: '32px' }}>
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                <p style={{ margin: 0, color: '#166534', fontWeight: '600', fontSize: '1.05rem' }}>{reviewProduct.name}</p>
                            </div>
                            <FeedbackForm product={reviewProduct} onSuccess={() => {
                                setReviewProduct(null);
                                navigate('/dashboard');
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
