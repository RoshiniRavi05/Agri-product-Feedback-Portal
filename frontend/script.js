// API Base URL
const API_URL = 'http://localhost:5000/api';

const translations = {
    en: {
        title: "Agri Feedback Portal",
        subtitle: "Empowering farmers to report issues with seeds, fertilizers, and farming tools.",
        login: "Login",
        register: "Register",
        phoneLabel: "Phone Number",
        phonePlaceholder: "Enter 10-digit number",
        passwordLabel: "Password",
        nameLabel: "Name",
        namePlaceholder: "Full Name",
        villageLabel: "Village",
        villagePlaceholder: "Your Village",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        logout: "Logout",
        myComplaints: "My Feedback",
        newComplaint: "Submit Feedback",
        noComplaints: "No reviews found.",
        submitComplaintTitle: "Submit Feedback",
        backLabel: "Back",
        selectTypeLabel: "Select Feedback Type",
        typeText: "Text",
        typeVoice: "Voice",
        typeImage: "Image",
        selectCategoryLabel: "Select Product Category",
        selectCategoryOption: "-- Select Category --",
        catSeed: "Seed",
        catFertilizer: "Fertilizer",
        catPesticide: "Pesticide",
        catTool: "Tool",
        selectProductLabel: "Select Product",
        selectProductOption: "-- Select Product --",
        complaintDetailsLabel: "User Feedback",
        complaintDetailsPlaceholder: "Write your feedback here...",
        startVoiceOptions: "Start Voice Recording",
        stopVoiceOptions: "Stop Recording",
        uploadImageLabel: "Upload Product Photo",
        uploadImageDesc: "Take a clear photo of the seed packet or fertilizer bag showing the brand.",
        submitBtn: "Submit Feedback",
        submittingBtn: "Submitting...",
        voiceNotSupported: "Voice input not supported in this browser.",
        successSubmit: "Feedback submitted successfully!",
        adminTitle: "Admin Dashboard",
        totalComplaints: "Total Reviews",
        totalProducts: "Total Products",
        qualityAlerts: "Quality Alerts (Defective Products)",
        addProduct: "Add New Product",
        allComplaints: "All Recent Reviews",
        adminLogout: "Logout",
        statusText: "Status:",
        typeLabel: "Type:",
        noProducts: "No products in database. Please contact admin.",
        loadProductsError: "Could not load products. Please try again.",
        voiceRecordingFailed: "Voice recording failed",
        selectProductAlert: "Please select a product",
        enterComplaintDetailsAlert: "Please enter feedback details or record your voice.",
        uploadImageAlert: "Please upload a product image.",
        submissionFailed: "Submission failed",
        networkError: "Network error. Please try again.",
    },
    ta: {
        title: "விவசாயப் புகார் தளம்",
        subtitle: "விவசாயப் பொருட்கள் பற்றிய புகார்களைப் பதிவு செய்யும் தளம்.",
        login: "உள்நுழைய",
        register: "பதிவு செய்ய",
        phoneLabel: "தொலைபேசி எண்",
        phonePlaceholder: "10-இலக்க எண்ணை உள்ளிடவும்",
        passwordLabel: "கடவுச்சொல்",
        nameLabel: "பெயர்",
        namePlaceholder: "முழுப் பெயர்",
        villageLabel: "கிராமம்",
        villagePlaceholder: "உங்கள் கிராமம்",
        noAccount: "கணக்கு இல்லையா?",
        haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        logout: "வெளியேறு",
        myComplaints: "எனது புகார்கள்",
        newComplaint: "+ புதிய புகார்",
        noComplaints: "புகார்கள் ஏதுமில்லை.",
        submitComplaintTitle: "புகார் பதிவு",
        backLabel: "பின்செல்",
        selectTypeLabel: "புகார் வகையைத் தேர்ந்தெடுக்கவும்",
        typeText: "குறுஞ்செய்தி",
        typeVoice: "குரல் பதிவு",
        typeImage: "படம் மூலம்",
        selectCategoryLabel: "பொருள் வகையைத் தேர்ந்தெடுக்கவும்",
        selectCategoryOption: "-- வகையைத் தேர்ந்தெடுக்கவும் --",
        catSeed: "விதை",
        catFertilizer: "உரம்",
        catPesticide: "பூச்சிக்கொல்லி",
        catTool: "கருவி",
        selectProductLabel: "பொருக்கைத் தேர்ந்தெடுக்கவும்",
        selectProductOption: "-- பொருளைத் தேர்ந்தெடுக்கவும் --",
        complaintDetailsLabel: "புகார் விவரங்கள்",
        complaintDetailsPlaceholder: "உங்கள் பிரச்சனையை இங்கே எழுதுங்கள்...",
        startVoiceOptions: "குரல் பதிவைத் தொடங்கவும்",
        stopVoiceOptions: "பதிவை நிறுத்தவும்",
        uploadImageLabel: "பொருள் புகைப்படம்",
        uploadImageDesc: "விதை அல்லது உரப்பையின் தெளிவான புகைப்படத்தை எடுக்கவும்.",
        submitBtn: "சமர்ப்பிக்கவும்",
        submittingBtn: "சமர்ப்பிக்கப்படுகிறது...",
        voiceNotSupported: "இந்த உலாவி குரல் பதிவை ஆதரிக்கவில்லை.",
        successSubmit: "புகார் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது!",
        adminTitle: "நிர்வாகி தளம்",
        totalComplaints: "மொத்த புகார்கள்",
        totalProducts: "மொத்த பொருட்கள்",
        qualityAlerts: "தர எச்சரிக்கைகள்",
        addProduct: "புதிய பொருளைச் சேர்க்க",
        allComplaints: "சமீபத்திய புகார்கள்",
        adminLogout: "வெளியேறு",
        statusText: "நிலை:",
        typeLabel: "வகை:",
        noProducts: "தரவுத்தளத்தில் பொருட்கள் ஏதுமில்லை. நிர்வாகியைத் தொடர்பு கொள்ளவும்.",
        loadProductsError: "பொருட்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        voiceRecordingFailed: "குரல் பதிவு தோல்வியடைந்தது",
        selectProductAlert: "தயவுசெய்து ஒரு பொருளைத் தேர்ந்தெடுக்கவும்",
        enterComplaintDetailsAlert: "புகார் விவரங்களை உள்ளிடவும் அல்லது உங்கள் குரலை பதிவு செய்யவும்.",
        uploadImageAlert: "தயவுசெய்து ஒரு பொருள் படத்தை பதிவேற்றவும்.",
        submissionFailed: "சமர்ப்பிப்பு தோல்வியடைந்தது",
        networkError: "பிணைய பிழை. மீண்டும் முயற்சிக்கவும்.",
    }
};

function getLanguage() {
    return localStorage.getItem('language') || 'en';
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    applyTranslations();
}

function applyTranslations() {
    const lang = getLanguage();
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
    });
}

// Ensure translations run on page load
document.addEventListener('DOMContentLoaded', applyTranslations);


// Utility functions
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alert-message');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const userObj = localStorage.getItem('user');
    return userObj ? JSON.parse(userObj) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

function checkAdmin() {
    const user = getUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'dashboard.html';
    }
}

// Attach logout event to common nav item if it exists
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Set Nav user info
    const navUser = document.getElementById('nav-username');
    if (navUser) {
        const user = getUser();
        if (user) {
            navUser.textContent = `Welcome, ${user.name}`;
        }
    }
});
