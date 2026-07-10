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
import PublicLayout from '../components/layout/PublicLayout';

// New Public Pages
import About from '../pages/About';
import Contact from '../pages/Contact';
import Pricing from '../pages/Pricing';
import CourseList from '../pages/courses/CourseList';
import CourseDetail from '../pages/courses/CourseDetail';

// Onboarding Pages
import Goals from '../pages/onboarding/Goals';
import Cohort from '../pages/onboarding/Cohort';

// Dashboard Pages
import Profile from '../pages/dashboard/Profile';
import AIAssistant from '../pages/dashboard/AIAssistant';
import Resumes from '../pages/dashboard/Resumes';
import Interviews from '../pages/dashboard/Interviews';
import JobBoard from '../pages/dashboard/JobBoard';
import FinancialGoals from '../pages/dashboard/FinancialGoals';
import CommunityForum from '../pages/dashboard/CommunityForum';
import SettingsPage from '../pages/dashboard/Settings';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// New Dashboard Pages
import DashboardCourses from '../pages/dashboard/courses/DashboardCourses';
import LearningEnvironment from '../pages/dashboard/courses/LearningEnvironment';
import QuizView from '../pages/dashboard/courses/QuizView';
import Certificates from '../pages/dashboard/courses/Certificates';
import ProfileSettings from '../pages/dashboard/settings/ProfileSettings';
import AccountSettings from '../pages/dashboard/settings/AccountSettings';
import NotificationSettings from '../pages/dashboard/settings/NotificationSettings';

import EducationHub from '../pages/EducationHub';
import FinTech from '../pages/FinTech';
import Mentorship from '../pages/Mentorship';
import CareerGrowth from '../pages/CareerGrowth';
import SuccessStories from '../pages/SuccessStories';

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

    // If already verified or admin, no need to stay on verification page
    if (user.is_staff) {
        return <Navigate to="/admin/dashboard" replace />;
    }
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
        return <Navigate to="/admin/dashboard" replace />;
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
        if (user.is_staff) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        // If logged in but not verified, send to verification page
        if (user.verification_status !== 'verified') {
            return <Navigate to="/verification" replace />;
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
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/courses" element={<PublicLayout><CourseList /></PublicLayout>} />
            <Route path="/courses/:slug" element={<PublicLayout><CourseDetail /></PublicLayout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:uidb64/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            
            {/* Legacy/Other Public Pages */}
            <Route path="/education" element={<EducationHub />} />
            <Route path="/fintech" element={<FinTech />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/careers" element={<CareerGrowth />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            
            <Route path="/verification" element={<AuthenticatedRoute><Verification /></AuthenticatedRoute>} />
            
            {/* Onboarding Routes */}
            <Route path="/onboarding/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/onboarding/cohort" element={<ProtectedRoute><Cohort /></ProtectedRoute>} />
            
            {/* Protected Routes (Wrapped in DashboardLayout) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/dashboard/courses" element={<ProtectedRoute><DashboardLayout><DashboardCourses /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/courses/:id/learn" element={<ProtectedRoute><LearningEnvironment /></ProtectedRoute>} />
            <Route path="/dashboard/courses/:id/quiz/:quizId" element={<ProtectedRoute><QuizView /></ProtectedRoute>} />
            <Route path="/dashboard/certificates" element={<ProtectedRoute><DashboardLayout><Certificates /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/dashboard/settings/profile" element={<ProtectedRoute><DashboardLayout><ProfileSettings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/settings/account" element={<ProtectedRoute><DashboardLayout><AccountSettings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/settings/notifications" element={<ProtectedRoute><DashboardLayout><NotificationSettings /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><DashboardLayout><AIAssistant /></DashboardLayout></ProtectedRoute>} />
            <Route path="/resumes" element={<ProtectedRoute><DashboardLayout><Resumes /></DashboardLayout></ProtectedRoute>} />
            <Route path="/interviews" element={<ProtectedRoute><DashboardLayout><Interviews /></DashboardLayout></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><DashboardLayout><JobBoard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><DashboardLayout><FinancialGoals /></DashboardLayout></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><DashboardLayout><CommunityForum /></DashboardLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/admin/dashboard" element={<AdminRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminRoute>} />
        </Routes>
    );
}
