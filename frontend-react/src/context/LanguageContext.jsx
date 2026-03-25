import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const stored = localStorage.getItem('language');
        if (stored) {
            setLanguage(stored);
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key) => {
        const dict = translations[language];
        return dict[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Existing translations from script.js
const translations = {
    en: {
        title: "Agri Feedback Portal",
        productCatalog: "Product Catalog",
        dashboard: "Dashboard",
        logout: "Logout",
        selectProductLabel: "Select Product",
        selectTypeLabel: "Select Feedback Type",
        submitComplaintTitle: "Submit Feedback",
        typeText: "Text",
        typeVoice: "Voice",
        typeImage: "Image",
        complaintDetailsLabel: "User Feedback",
        startVoiceOptions: "Start Voice Recording",
        stopVoiceOptions: "Stop Recording",
        uploadImageLabel: "Upload Product Photo",
        submitBtn: "Submit Feedback",
        submittingBtn: "Submitting...",
        qualityAlerts: "Quality Alerts",
        adminTitle: "Admin Dashboard",
        totalComplaints: "Total Reviews",
        totalProducts: "Total Products",
        addProduct: "Add New Product",
        allComplaints: "All Recent Reviews",
        viewDetails: "View Details",
        hideDetails: "Hide Details",
        myReviews: "My Reviews"
    },
    ta: {
        title: "விவசாயப் புகார் தளம்",
        productCatalog: "பொருட்கள் பட்டியல்",
        dashboard: "முகப்பு",
        logout: "வெளியேறு",
        selectProductLabel: "பொருக்கைத் தேர்ந்தெடுக்கவும்",
        selectTypeLabel: "புகார் வகையைத் தேர்ந்தெடுக்கவும்",
        submitComplaintTitle: "புகார் பதிவு",
        typeText: "குறுஞ்செய்தி",
        typeVoice: "குரல் பதிவு",
        typeImage: "படம் மூலம்",
        complaintDetailsLabel: "புகார் விவரங்கள்",
        startVoiceOptions: "குரல் பதிவைத் தொடங்கவும்",
        stopVoiceOptions: "பதிவை நிறுத்தவும்",
        uploadImageLabel: "பொருள் புகைப்படம்",
        submitBtn: "சமர்ப்பிக்கவும்",
        submittingBtn: "சமர்ப்பிக்கப்படுகிறது...",
        qualityAlerts: "தர எச்சரிக்கைகள்",
        adminTitle: "நிர்வாகி தளம்",
        totalComplaints: "மொத்த புகார்கள்",
        totalProducts: "மொத்த பொருட்கள்",
        addProduct: "புதிய பொருளைச் சேர்க்க",
        allComplaints: "சமீபத்திய புகார்கள்",
        viewDetails: "விவரம் காண்",
        hideDetails: "விவரம் மறை",
        myReviews: "என் மதிப்புரைகள்"
    }
};
