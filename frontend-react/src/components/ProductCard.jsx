import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const { t } = useLanguage();
    const { user } = useAuth();

    const baseBtnStyle = {
        flex: 1,
        padding: '10px 5px',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.2s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap'
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.2s',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #E5E7EB'
        }}>
            <div style={{
                width: '100%',
                height: '250px',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative'
            }}>
                <span style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    backgroundColor: '#D4E9D5',
                    color: '#009245',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    {product.productType || 'Powder'}
                </span>
                <img
                    src={product.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : '/assets/logo/bannari-logo.svg'}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo/bannari-logo.svg'; }}
                />
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1F2937', fontWeight: 'bold', marginBottom: '15px', flexGrow: 1 }}>{product.name}</h3>

                <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                    <Link
                        to={`/products/${product.id}`}
                        style={{
                            ...baseBtnStyle,
                            backgroundColor: '#009245',
                        }}
                        onMouseOver={e => { e.target.style.backgroundColor = '#007936'; e.target.style.transform = 'translateY(-2px)' }}
                        onMouseOut={e => { e.target.style.backgroundColor = '#009245'; e.target.style.transform = 'translateY(0)' }}
                    >
                        {user && user.role === 'admin' ? 'View' : 'View Details'}
                    </Link>
                    {(user && user.role === 'admin') && (
                        <>
                            <button
                                style={{
                                    ...baseBtnStyle,
                                    backgroundColor: '#F59E0B',
                                    color: '#111827',
                                }}
                                onMouseOver={e => { e.target.style.backgroundColor = '#D97706'; e.target.style.transform = 'translateY(-2px)' }}
                                onMouseOut={e => { e.target.style.backgroundColor = '#F59E0B'; e.target.style.transform = 'translateY(0)' }}
                                onClick={onEdit}
                            >
                                Edit
                            </button>
                            <button
                                style={{
                                    ...baseBtnStyle,
                                    backgroundColor: '#EF4444',
                                }}
                                onMouseOver={e => { e.target.style.backgroundColor = '#DC2626'; e.target.style.transform = 'translateY(-2px)' }}
                                onMouseOut={e => { e.target.style.backgroundColor = '#EF4444'; e.target.style.transform = 'translateY(0)' }}
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
