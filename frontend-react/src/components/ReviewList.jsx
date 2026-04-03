import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const ReviewList = ({ adminView = false, searchEnabled = false }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ratingParam = queryParams.get('rating');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const endpoint = adminView ? '/admin/reviews' : '/reviews/my';
                const res = await api.get(endpoint);
                setReviews(res.data);
            } catch (error) {
                console.error("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [adminView]);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

    if (loading) return <div>Loading reviews...</div>;

    const filteredReviews = reviews.filter(c => {
        let ratingMatch = true;
        if (ratingParam === 'positive') ratingMatch = c.rating >= 4;
        else if (ratingParam === 'neutral') ratingMatch = c.rating === 3;
        else if (ratingParam === 'negative') ratingMatch = c.rating <= 2;

        if (!ratingMatch) return false;

        const matchesCategory = categoryFilter === '' || c.complaint_category === categoryFilter || c.review_title === categoryFilter;
        if (!searchTerm) return matchesCategory;
        const s = searchTerm.toLowerCase();
        const productMatch = String(c.product_id?.product_name || '').toLowerCase().includes(s);
        const brandMatch = String(c.product_id?.brand || '').toLowerCase().includes(s);
        const userMatch = adminView && String(c.user_id?.name || '').toLowerCase().includes(s);
        const descMatch = String(c.feedback_text || '').toLowerCase().includes(s);
        const catMatch = String(c.complaint_category || '').toLowerCase().includes(s);
        return matchesCategory && (productMatch || brandMatch || userMatch || descMatch || catMatch);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    return (
        <div>
            {searchEnabled && (
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search by product, farmer, or review text..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: '1', minWidth: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        <option value="">All Categories</option>
                        <option value="Quality">Quality</option>
                        <option value="Effectiveness">Effectiveness</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Fake Product">Fake Product</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                            <th style={{ padding: '10px' }}>Date</th>
                            {adminView && <th style={{ padding: '10px' }}>Farmer</th>}
                            <th style={{ padding: '10px' }}>Product</th>
                            <th style={{ padding: '10px' }}>Type / Rating</th>
                            <th style={{ padding: '10px' }}>Review details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{new Date(c.timestamp).toLocaleDateString()}</td>

                                {adminView && (
                                    <td style={{ padding: '10px' }}>
                                        {c.user_id?.name || 'Unknown User'}<br />
                                        <small>{c.user_id?.phone || ''}</small>
                                    </td>
                                )}

                                <td style={{ padding: '10px' }}>
                                    {c.product_id?.product_name || 'Unknown'}<br />
                                    <small>{c.product_id?.brand || ''}</small>
                                </td>

                                <td style={{ padding: '10px', textTransform: 'capitalize' }}>
                                    {c.feedback_type} <br />
                                    <small style={{ color: '#666' }}>Cat: {c.complaint_category}</small> <br />
                                    <small style={{ color: c.rating >= 4 ? '#2E7D32' : c.rating >= 3 ? '#FF9800' : '#d32f2f', fontWeight: 'bold' }}>Rating: {c.rating} ★</small>
                                </td>

                                <td style={{ padding: '10px' }}>
                                    <strong>{c.review_title || ''}</strong><br />
                                    {c.feedback_text}
                                    {c.image_attachment && (
                                        <>
                                            <br />
                                            <a href={import.meta.env.PROD ? c.image_attachment : `http://localhost:5000${c.image_attachment}`} target="_blank" rel="noreferrer">
                                                🖼️ View Image
                                            </a>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan={adminView ? 5 : 4} style={{ textAlign: 'center', padding: '15px' }}>
                                    No reviews found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '5px 15px', width: 'auto' }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px 15px', width: 'auto' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
