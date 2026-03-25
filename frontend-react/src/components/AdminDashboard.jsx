import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';
import ReviewList from './ReviewList';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);

    // Form state
    const [pName, setPName] = useState('');
    const [pBrand, setPBrand] = useState('Bannari Amman Sugars Ltd.');
    const [pCategory, setPCategory] = useState('');
    const [pType, setPType] = useState('');
    const [pDescription, setPDescription] = useState('');
    const [pImage, setPImage] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const analyticsRes = await api.get('/admin/analytics');
                setStats(analyticsRes.data);

                const alertsRes = await api.get('/admin/alerts');
                setAlerts(alertsRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            }
        };
        fetchAdminData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', pName);
        formData.append('brand', pBrand);
        formData.append('category', pCategory);
        formData.append('product_type', pType);
        formData.append('manufacturer', pBrand);
        formData.append('description', pDescription);

        if (pImage) formData.append('image', pImage);

        try {
            await api.post('/products', formData);
            alert('Product added successfully!');
            window.location.reload();
        } catch (error) {
            alert('Error adding product');
        }
    };

    const handleResolveAlert = async (id) => {
        if (!window.confirm("Resolve this quality alert?")) return;
        try {
            await api.put(`/admin/alerts/${id}/resolve`);
            alert('Alert marked as resolved.');
            window.location.reload();
        } catch (error) {
            alert("Error resolving alert.");
        }
    };

    if (!stats) return <div className="container">Loading Dashboard...</div>;

    const categoryData = {
        labels: stats.reviewsByCategory.map(c => c._id),
        datasets: [{
            data: stats.reviewsByCategory.map(c => c.count),
            backgroundColor: ['#2E7D32', '#FF9800', '#F44336', '#2196F3']
        }]
    };

    const productBarData = {
        labels: stats.mostReviewed.map(p => p._id?.product_name || 'Unknown'),
        datasets: [{
            label: '# of Reviews',
            data: stats.mostReviewed.map(p => p.count),
            backgroundColor: ['#2E7D32', '#FF9800', '#1976D2', '#9C27B0', '#F44336']
        }]
    };

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            {/* Welcome Header */}
            {user && (
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: '0' }}>
                        Welcome, {user.name.toUpperCase()}
                    </h2>
                    <p style={{ margin: '0', color: '#666' }}>Role: Admin | Email/Phone: {user.phone}</p>
                </div>
            )}

            {/* Stats Row */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Registered Users</h3>
                    <p>{stats.totalFarmers || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Feedbacks</h3>
                    <p>{stats.totalReviews}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>
            </div>

            {/* Quality Alerts */}
            <div className="card" style={{ borderLeft: alerts.some(a => a.status === 'active') ? '5px solid red' : '5px solid var(--accent-color)' }}>
                <h2 style={{ color: 'var(--accent-color)' }}>⚠️ Quality Alerts</h2>
                <div style={{ overflowX: 'auto' }}>
                    {alerts.length === 0 ? <p>No quality alerts triggered.</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#ffebee', color: '#b71c1c' }}>
                                    <th style={{ padding: '10px' }}>Product</th>
                                    <th style={{ padding: '10px' }}>Reviews count</th>
                                    <th style={{ padding: '10px' }}>Alert Message</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(a => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{a.product?.product_name || 'Unknown'}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{a.review_count}</td>
                                        <td style={{ padding: '10px' }}>{a.message}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                background: a.status === 'active' ? '#ffcdd2' : '#c8e6c9',
                                                color: a.status === 'active' ? '#c62828' : '#2e7d32'
                                            }}>
                                                {a.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {a.status === 'active' ? (
                                                <button onClick={() => handleResolveAlert(a._id)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Resolve</button>
                                            ) : '✓'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                    <h2>Reviews by Category</h2>
                    <Pie data={categoryData} />
                </div>
                <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                    <h2>Most Reviewed Products</h2>
                    <Bar
                        data={productBarData}
                        options={{
                            scales: {
                                x: {
                                    ticks: {
                                        callback: function (value) {
                                            const label = this.getLabelForValue(value);
                                            return label && label.length > 15 ? label.substring(0, 15) + '...' : label;
                                        }
                                    }
                                },
                                y: { beginAtZero: true }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Add New Product Form */}
            <div className="card">
                <h2>Add New Product</h2>
                <form onSubmit={handleAddProduct}>
                    <div className="form-group">
                        <input type="text" placeholder="Product Name" value={pName} onChange={(e) => setPName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Brand" value={pBrand} readOnly />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} required style={{ flex: 1 }}>
                            <option value="">Select Category...</option>
                            <option value="Seed">Seed</option>
                            <option value="Fertilizer">Fertilizer</option>
                            <option value="Pesticide">Pesticide</option>
                            <option value="Tool">Tool</option>
                        </select>
                        <select value={pType} onChange={(e) => setPType(e.target.value)} required style={{ flex: 1 }}>
                            <option value="">Select Product Type...</option>
                            <option value="Liquid">Liquid</option>
                            <option value="Powder">Powder</option>
                            <option value="Common">Common</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Product Image (Optional)</label>
                        <input type="file" accept="image/*" onChange={(e) => setPImage(e.target.files[0])} />
                    </div>
                    <div className="form-group">
                        <textarea placeholder="Product Description (Optional)" rows="3" value={pDescription} onChange={(e) => setPDescription(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-secondary">Add Product</button>
                </form>
            </div>

        </div>
    );
};

export default AdminDashboard;
