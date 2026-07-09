import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import DashboardLayout from '../components/layout/DashboardLayout';

// Dashboard Pages
import Profile from '../pages/dashboard/Profile';
import AIAssistant from '../pages/dashboard/AIAssistant';
import Resumes from '../pages/dashboard/Resumes';
import Interviews from '../pages/dashboard/Interviews';

import Verification from '../pages/auth/Verification';

// Authenticated Route Wrapper (just requires login)
const AuthenticatedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Protected Route Wrapper (requires login AND verification)
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.verification_status !== 'verified') {
        return <Navigate to="/verification" replace />;
    }
    
    return children;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            
            <Route path="/verification" element={<AuthenticatedRoute><Verification /></AuthenticatedRoute>} />
            
            {/* Protected Routes (Wrapped in DashboardLayout) */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/profile" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Profile />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/ai-assistant" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <AIAssistant />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/resumes" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Resumes />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/interviews" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Interviews />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}
