import React from 'react';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../context/LanguageContext';

const Products = () => {
    const { t } = useLanguage();

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
                {t('productCatalog')}
            </h2>
            <ProductGrid />
        </div>
    );
};

export default Products;
