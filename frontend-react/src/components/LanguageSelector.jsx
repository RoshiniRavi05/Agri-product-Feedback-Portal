import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <select
            className="lang-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
        >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
        </select>
    );
};

export default LanguageSelector;
