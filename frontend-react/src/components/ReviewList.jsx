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

    // Acknowledge state: { [reviewId]: { comment, submitting, expanded } }
    const [ackState, setAckState] = useState({});

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

    const handleAcknowledge = async (reviewId) => {
        const comment = ackState[reviewId]?.comment || '';
        setAckState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], submitting: true } }));
        try {
            await api.put(`/admin/reviews/${reviewId}/acknowledge`, { admin_comment: comment });
            // Update the review in local state
            setReviews(prev => prev.map(r =>
                r._id === reviewId
                    ? { ...r, is_acknowledged: true, admin_comment: comment, acknowledged_at: new Date().toISOString() }
                    : r
            ));
            setAckState(prev => ({ ...prev, [reviewId]: { comment: '', submitting: false, expanded: false } }));
        } catch (err) {
            alert('Failed to acknowledge review. Please try again.');
            setAckState(prev => ({ ...prev, [reviewId]: { ...prev[reviewId], submitting: false } }));
        }
    };

    const toggleAckPanel = (reviewId) => {
        setAckState(prev => ({
            ...prev,
            [reviewId]: {
                ...prev[reviewId],
                expanded: !prev[reviewId]?.expanded,
                comment: prev[reviewId]?.comment || ''
            }
        }));
    };

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

    // Column count for colspan
    const colCount = adminView ? 6 : 5;

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
                            <th style={{ padding: '10px' }}>Acknowledgement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(c => {
                            const isExpanded = ackState[c._id]?.expanded;
                            const currentComment = ackState[c._id]?.comment ?? '';
                            const isSubmitting = ackState[c._id]?.submitting;

                            return (
                                <React.Fragment key={c._id}>
                                    <tr style={{ borderBottom: c.is_acknowledged ? '1px solid #c8e6c9' : '1px solid #eee', background: c.is_acknowledged ? '#f9fff9' : 'white' }}>
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

                                        {/* Acknowledgement column */}
                                        <td style={{ padding: '10px', minWidth: '160px' }}>
                                            {c.is_acknowledged ? (
                                                <div>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem',
                                                        background: '#c8e6c9', color: '#1b5e20', fontWeight: 'bold'
                                                    }}>
                                                        ✅ Acknowledged
                                                    </span>
                                                    {c.acknowledged_at && (
                                                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '3px' }}>
                                                            {new Date(c.acknowledged_at).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {c.admin_comment && (
                                                        <div style={{
                                                            marginTop: '6px', padding: '7px 10px',
                                                            background: '#e8f5e9', borderLeft: '3px solid #2e7d32',
                                                            borderRadius: '4px', fontSize: '0.82rem', color: '#1b5e20'
                                                        }}>
                                                            <strong>Admin:</strong> {c.admin_comment}
                                                        </div>
                                                    )}
                                                    {/* Admin can update comment even after acknowledging */}
                                                    {adminView && (
                                                        <button
                                                            onClick={() => toggleAckPanel(c._id)}
                                                            style={{
                                                                marginTop: '6px', fontSize: '0.75rem', padding: '3px 8px',
                                                                background: 'transparent', border: '1px solid #2e7d32',
                                                                borderRadius: '4px', cursor: 'pointer', color: '#2e7d32'
                                                            }}
                                                        >
                                                            ✏️ Update Comment
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem',
                                                        background: '#fff3e0', color: '#e65100', fontWeight: 'bold'
                                                    }}>
                                                        ⏳ Pending
                                                    </span>
                                                    {adminView && (
                                                        <button
                                                            onClick={() => toggleAckPanel(c._id)}
                                                            style={{
                                                                display: 'block', marginTop: '6px', fontSize: '0.8rem',
                                                                padding: '4px 10px', background: 'var(--primary-color)',
                                                                color: 'white', border: 'none', borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Acknowledge
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    {/* Collapsible acknowledge panel (admin only) */}
                                    {adminView && isExpanded && (
                                        <tr style={{ background: '#f1f8e9' }}>
                                            <td colSpan={colCount} style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                                    <textarea
                                                        rows={2}
                                                        placeholder="Add a comment for the farmer (optional)..."
                                                        value={currentComment}
                                                        onChange={(e) => setAckState(prev => ({
                                                            ...prev,
                                                            [c._id]: { ...prev[c._id], comment: e.target.value }
                                                        }))}
                                                        style={{
                                                            flex: '1', minWidth: '250px', padding: '8px',
                                                            borderRadius: '5px', border: '1px solid #a5d6a7',
                                                            resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem'
                                                        }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                                                        <button
                                                            onClick={() => handleAcknowledge(c._id)}
                                                            disabled={isSubmitting}
                                                            style={{
                                                                padding: '7px 18px', background: '#2e7d32', color: 'white',
                                                                border: 'none', borderRadius: '5px', cursor: 'pointer',
                                                                fontWeight: 'bold', opacity: isSubmitting ? 0.6 : 1
                                                            }}
                                                        >
                                                            {isSubmitting ? 'Saving...' : c.is_acknowledged ? '✅ Update' : '✅ Acknowledge'}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleAckPanel(c._id)}
                                                            style={{
                                                                padding: '5px 14px', background: 'transparent',
                                                                border: '1px solid #aaa', borderRadius: '5px',
                                                                cursor: 'pointer', fontSize: '0.85rem'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan={colCount} style={{ textAlign: 'center', padding: '15px' }}>
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
