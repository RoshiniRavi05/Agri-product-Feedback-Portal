import api from './api';

export const submitFeedback = async (formData) => {
    const response = await api.post('/reviews', formData);
    return response.data;
};

export const getAdminReviews = async () => {
    const response = await api.get('/admin/reviews');
    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
};

export const getAdminAlerts = async () => {
    const response = await api.get('/admin/alerts');
    return response.data;
};

export const resolveAlert = async (id) => {
    const response = await api.put(`/admin/alerts/${id}/resolve`);
    return response.data;
};
