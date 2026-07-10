import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardLayout from '../components/layout/DashboardLayout';

// Dashboard Pages
import Profile from '../pages/dashboard/Profile';
import AIAssistant from '../pages/dashboard/AIAssistant';
import Resumes from '../pages/dashboard/Resumes';
import Interviews from '../pages/dashboard/Interviews';
import JobBoard from '../pages/dashboard/JobBoard';
import FinancialGoals from '../pages/dashboard/FinancialGoals';
import CommunityForum from '../pages/dashboard/CommunityForum';
import SettingsPage from '../pages/dashboard/Settings';
import AdminVerification from '../pages/dashboard/AdminVerification';

import Verification from '../pages/auth/Verification';

// Authenticated Route Wrapper (just requires login, for /verification page)
const AuthenticatedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If already verified, no need to stay on verification page
    if (user.verification_status === 'verified') {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

// Protected Route Wrapper (requires login AND verification)
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = import('react-router-dom').then(m => m.useLocation).catch(() => null); // or just import useLocation at top
    // Wait, let's just use window.location.pathname
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.verification_status !== 'verified') {
        return <Navigate to="/verification" replace />;
    }

    if (user.is_staff && !window.location.pathname.includes('/settings')) {
        return <Navigate to="/admin/verifications" replace />;
    }
    
    return children;
};

// Public Route Wrapper (redirects based on auth + verification status)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (user) {
        // If logged in but not verified, send to verification page
        if (user.verification_status !== 'verified') {
            return <Navigate to="/verification" replace />;
        }
        if (user.is_staff) {
            return <Navigate to="/admin/verifications" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user || !user.is_staff) {
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
            <Route path="/reset-password/:uidb64/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            
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
            <Route 
                path="/jobs" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <JobBoard />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/finance" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <FinancialGoals />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/community" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <CommunityForum />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/settings" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <SettingsPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/verifications" 
                element={
                    <AdminRoute>
                        <DashboardLayout>
                            <AdminVerification />
                        </DashboardLayout>
                    </AdminRoute>
                } 
            />
        </Routes>
    );
}
