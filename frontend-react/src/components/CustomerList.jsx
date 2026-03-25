import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get('filter');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/admin/farmers');
                setCustomers(res.data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) return <div>Loading customer details...</div>;

    // Filter customers
    let filteredCustomers = customers.filter(c => {
        let genderMatch = true;
        // Check gender if filter applies (assuming backend adds gender field eventually)
        if (filterParam === 'male') {
            genderMatch = (c.gender && c.gender.toLowerCase() === 'male');
        } else if (filterParam === 'female') {
            genderMatch = (c.gender && c.gender.toLowerCase() === 'female');
        }

        if (!genderMatch) return false;

        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        const nameMatch = String(c.name || '').toLowerCase().includes(s);
        const villageMatch = String(c.village || '').toLowerCase().includes(s);
        return nameMatch || villageMatch;
    });

    if (filterParam === 'villages') {
        filteredCustomers.sort((a, b) => (a.village || '').localeCompare(b.village || ''));
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <div>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Search by name or village..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Phone Number</th>
                            <th style={{ padding: '10px' }}>Gender</th>
                            <th style={{ padding: '10px' }}>Village</th>
                            <th style={{ padding: '10px' }}>Joined Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((c, i) => (
                            <tr key={c._id || i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.name}</td>
                                <td style={{ padding: '10px' }}>{c.phone}</td>
                                <td style={{ padding: '10px', textTransform: 'capitalize' }}>{c.gender || 'Other'}</td>
                                <td style={{ padding: '10px' }}>{c.village}</td>
                                <td style={{ padding: '10px' }}>
                                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>No customers found.</td>
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

export default CustomerList;
