import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const response = await api.get('users/me/');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Verify session on page load
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('users/login/', { email, password });
            
            // Backend sets access and refresh HttpOnly cookies automatically.
            // We just need to set the user state.
            setUser(response.data.user);
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Invalid email or password.'
            };
        }
    };

    const register = async (userData) => {
        try {
            await api.post('users/register/', userData);
            // After successful registration, log them in
            return await login(userData.email, userData.password);
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data || { general: ['Registration failed.'] }
            };
        }
    };

    const logout = async () => {
        try {
            // Tell backend to blacklist the token and clear the cookies
            await api.post('users/logout/');
        } catch (error) {
            console.error("Error logging out on server:", error);
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    if (loading) {
        // Show a brief loading state during verification rather than flashing the logged-out UI
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-background)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-primary)]"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkAuth, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
