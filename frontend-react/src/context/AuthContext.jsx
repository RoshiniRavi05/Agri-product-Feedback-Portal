import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // FORCE CLEAR ON INITIAL LOAD FOR TESTING
        if (!sessionStorage.getItem('forceClearLocalTest2')) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.setItem('forceClearLocalTest2', 'true');
            setUser(null);
            setToken(null);
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (phone, password) => {
        const res = await api.post('/auth/login', { phone, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setToken(res.data.token);
        setUser(res.data);
    };

    const register = async (name, phone, village, role, password) => {
        const res = await api.post('/auth/register', { name, phone, village, role, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ ...res.data.user, role }));
        setToken(res.data.token);
        setUser({ ...res.data.user, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
