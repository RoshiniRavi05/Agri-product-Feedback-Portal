import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../context/AuthContext';

const ProductFeedbackPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getProductById(id);
            if (!data) {
                navigate('/products');
            } else {
                setProduct(data);
            }
        };
        loadProduct();
    }, [id, navigate]);

    if (!user) {
        navigate('/login');
        return null;
    }

    if (!product) return <div className="container">Loading product details...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                <img
                    src={product.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : '/assets/logo/bannari-logo.svg'}
                    alt={product.name}
                    style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                />
                <h2 style={{ marginTop: '15px' }}>{product.name}</h2>
                <div style={{ margin: '15px 0' }}>
                    <strong>Brand / Manufacturer:</strong> {product.brand} <br /><br />
                    <strong>What it is:</strong> This product is classified as a <strong>{product.category}</strong> (specifically, <strong>{product.productType}</strong> type). <br /><br />
                </div>
            </div>

            {(!user || user.role !== 'admin') && (
                <div className="card" style={{ flex: '1', minWidth: '350px' }}>
                    <h2>Submit Feedback</h2>
                    <FeedbackForm product={product} />
                </div>
            )}
        </div>
    );
};

export default ProductFeedbackPage;
