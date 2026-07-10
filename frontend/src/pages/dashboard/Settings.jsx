import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Shield, Bell, Lock, Monitor, Settings as SettingsIcon, CheckCircle, Smartphone, LogOut, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { cn } from '../../lib/utils';

export default function Settings() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('security');
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Status state for toasts
    const [status, setStatus] = useState({ type: '', message: '' });

    // Forms state
    const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/users/settings/');
                setSettings(res.data);
            } catch (err) {
                console.error("Failed to load settings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const showToast = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            showToast('error', "New passwords don't match.");
            return;
        }
        if (passwordData.new_password.length < 8) {
            showToast('error', "New password must be at least 8 characters.");
            return;
        }
        try {
            await api.post('/users/change-password/', {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });
            showToast('success', "Password successfully updated.");
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            showToast('error', err.response?.data?.detail || "Failed to update password.");
        }
    };

    const handleNotificationToggle = async (category, channel) => {
        const updatedNotifications = {
            ...settings.notifications,
            [category]: {
                ...settings.notifications[category],
                [channel]: !settings.notifications[category][channel]
            }
        };
        const newSettings = { ...settings, notifications: updatedNotifications };
        setSettings(newSettings);
        
        try {
            await api.put('/users/settings/', newSettings);
        } catch (err) {
            showToast('error', "Failed to save notification preference.");
        }
    };

    const handlePrivacyToggle = async (field) => {
        const newSettings = { ...settings, [field]: !settings[field] };
        setSettings(newSettings);
        try {
            await api.put('/users/settings/', newSettings);
        } catch (err) {
            showToast('error', "Failed to save preference.");
        }
    };

    const handleThemeChange = async (theme) => {
        const newSettings = { ...settings, theme };
        setSettings(newSettings);
        setUser({ ...user, settings: newSettings });
        try {
            await api.put('/users/settings/', newSettings);
        } catch (err) {
            showToast('error', "Failed to save theme preference.");
        }
    };

    const handleDataExport = async () => {
        try {
            const res = await api.get('/users/export-data/');
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ElevateHer_DataExport_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            showToast('success', "Data export started.");
        } catch (err) {
            showToast('error', "Failed to generate data export.");
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (deleteConfirmation !== 'DELETE') {
            showToast('error', "Please type DELETE to confirm.");
            return;
        }
        if (!deletePassword) {
            showToast('error', "Password is required to delete account.");
            return;
        }
        try {
            await api.post('/users/delete-account/', { password: deletePassword });
            await logout();
            navigate('/login');
        } catch (err) {
            showToast('error', err.response?.data?.detail || "Failed to delete account. Incorrect password?");
        }
    };

    const TABS = [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Data', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Monitor },
    ];

    if (isLoading) return <div className="p-12 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] pb-12">
            
            {/* Global Toast */}
            {status.message && (
                <div className={cn(
                    "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg font-bold text-sm animate-fade-in flex items-center gap-2",
                    status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                )}>
                    {status.type === 'success' ? <CheckCircle className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                    {status.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
                        <SettingsIcon className="w-8 h-8 text-[var(--color-brand-primary)]" />
                        Settings
                    </h1>
                    <p className="text-[var(--color-brand-text-muted)] mt-2">
                        Manage your security, notifications, and privacy preferences.
                    </p>
                </div>

                {/* Verification Shortcut Card */}
                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] p-4 sm:p-6 mb-8 shadow-[var(--shadow-sm)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Identity Verification</h3>
                        <p className="text-sm text-gray-500">Verify your identity to unlock community features.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                            <span className={cn(
                                "text-sm font-bold capitalize px-2 py-0.5 rounded",
                                user?.verification_status === 'verified' ? 'bg-green-100 text-green-700' : 
                                user?.verification_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            )}>
                                {user?.verification_status || 'Pending'}
                            </span>
                        </div>
                        <Link to="/dashboard/verification">
                            <Button variant="secondary" size="sm" className="gap-2">Manage <ExternalLink className="w-4 h-4"/></Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar Tabs */}
                    <div className="md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 pb-4 md:pb-0 hide-scrollbar border-b md:border-b-0 border-gray-200">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors",
                                        isActive 
                                            ? "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]" 
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-[var(--color-brand-primary)]" : "text-gray-400")} />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        
                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-fade-in">
                                
                                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6">
                                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Change Password</h3>
                                    <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwordData.current_password}
                                                onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwordData.new_password}
                                                onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwordData.confirm_password}
                                                onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <Button type="submit">Update Password</Button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6">
                                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                                        Two-Factor Authentication
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">Email OTP Verification</p>
                                            <p className="text-sm text-gray-500">Require an email code when logging in.</p>
                                        </div>
                                        <button 
                                            onClick={() => handlePrivacyToggle('two_factor_enabled')}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-colors relative",
                                                settings.two_factor_enabled ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                                                settings.two_factor_enabled ? 'left-7' : 'left-1'
                                            )}/>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6 opacity-75">
                                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                                        Active Sessions
                                        <span className="text-[10px] uppercase font-bold bg-indigo-50 text-[var(--color-brand-primary)] px-2 py-1 rounded">Coming Soon</span>
                                    </h3>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <Monitor className="w-8 h-8 text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Windows PC • Chrome</p>
                                                <p className="text-xs text-green-600 font-bold">Current Session</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="w-8 h-8 text-gray-400" />
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">iPhone 14 • Safari</p>
                                                <p className="text-xs text-gray-500">Last active 2 days ago</p>
                                            </div>
                                        </div>
                                        <button disabled className="text-xs font-bold text-gray-400 cursor-not-allowed">Log Out</button>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6 animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Notification Preferences</h3>
                                
                                <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-100 pb-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="col-span-8">Category</div>
                                    <div className="col-span-2 text-center">In-App</div>
                                    <div className="col-span-2 text-center">Email</div>
                                </div>

                                <div className="space-y-0">
                                    {[
                                        { id: 'community', label: 'Community Forum', desc: 'Replies, mentions, and new posts in followed categories.' },
                                        { id: 'jobs', label: 'Job Board Matches', desc: 'New opportunities that match your verified profile.' },
                                        { id: 'interviews', label: 'Mock Interviews', desc: 'Session reminders and AI feedback reports.' },
                                        { id: 'finance', label: 'Financial Goals', desc: 'Milestones, progress alerts, and tool recommendations.' },
                                        { id: 'verification', label: 'Verification Updates', desc: 'Status changes on your identity verification.' },
                                    ].map(cat => (
                                        <div key={cat.id} className="py-4 border-b border-gray-50 last:border-0 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                            <div className="sm:col-span-8">
                                                <p className="font-semibold text-gray-900">{cat.label}</p>
                                                <p className="text-xs text-gray-500">{cat.desc}</p>
                                            </div>
                                            <div className="sm:col-span-4 flex justify-between sm:justify-around items-center">
                                                <div className="flex items-center gap-2 sm:block sm:text-center">
                                                    <span className="text-xs text-gray-500 sm:hidden">In-App</span>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={settings.notifications?.[cat.id]?.in_app || false}
                                                        onChange={() => handleNotificationToggle(cat.id, 'in_app')}
                                                        className="w-4 h-4 text-[var(--color-brand-primary)] rounded focus:ring-[var(--color-brand-primary)] accent-[var(--color-brand-primary)] cursor-pointer"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 sm:block sm:text-center">
                                                    <span className="text-xs text-gray-500 sm:hidden">Email</span>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={settings.notifications?.[cat.id]?.email || false}
                                                        onChange={() => handleNotificationToggle(cat.id, 'email')}
                                                        className="w-4 h-4 text-[var(--color-brand-primary)] rounded focus:ring-[var(--color-brand-primary)] accent-[var(--color-brand-primary)] cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRIVACY & DATA TAB */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6 animate-fade-in">
                                
                                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6">
                                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Privacy Controls</h3>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">Show Full Name in Community Forum</p>
                                            <p className="text-sm text-gray-500">When disabled, only your initials and username will be shown.</p>
                                        </div>
                                        <button 
                                            onClick={() => handlePrivacyToggle('show_full_name_in_forum')}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-colors relative",
                                                settings.show_full_name_in_forum ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                                                settings.show_full_name_in_forum ? 'left-7' : 'left-1'
                                            )}/>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6">
                                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Data Portability</h3>
                                    <p className="text-sm text-gray-600 mb-6">Download a machine-readable JSON copy of all your personal data, including profile info, finance goals, resumes, and community posts.</p>
                                    <Button variant="secondary" onClick={handleDataExport} className="gap-2 text-gray-700">
                                        <Download className="w-4 h-4" /> Download My Data
                                    </Button>
                                </div>

                                <div className="bg-red-50 rounded-xl border border-red-100 shadow-[var(--shadow-sm)] p-6">
                                    <h3 className="text-lg font-bold text-red-700 border-b border-red-200 pb-4 mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Danger Zone
                                    </h3>
                                    <p className="text-sm text-red-800 mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    
                                    <form onSubmit={handleDeleteAccount} className="bg-white p-4 rounded-lg border border-red-200 space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type "DELETE" to confirm</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={deleteConfirmation}
                                                onChange={e => setDeleteConfirmation(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={deletePassword}
                                                onChange={e => setDeletePassword(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white border-0" disabled={deleteConfirmation !== 'DELETE'}>
                                            Permanently Delete Account
                                        </Button>
                                    </form>
                                </div>

                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] p-6 animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                                    Theme Preferences
                                </h3>
                                
                                <div className="grid grid-cols-2 max-w-sm gap-4">
                                    <div 
                                        onClick={() => handleThemeChange('light')}
                                        className={cn(
                                            "border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white transition-all",
                                            settings.theme === 'light' ? 'border-[var(--color-brand-primary)]' : 'border-transparent hover:border-gray-200'
                                        )}
                                    >
                                        <div className="w-full h-12 bg-gray-50 border border-gray-200 rounded-md"></div>
                                        <span className={cn("font-bold text-sm", settings.theme === 'light' ? "text-[var(--color-brand-primary)]" : "text-gray-500")}>Light Mode</span>
                                    </div>
                                    <div 
                                        onClick={() => handleThemeChange('dark')}
                                        className={cn(
                                            "border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-900 transition-all",
                                            settings.theme === 'dark' ? 'border-[var(--color-brand-primary)]' : 'border-transparent hover:border-gray-700'
                                        )}
                                    >
                                        <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded-md"></div>
                                        <span className={cn("font-bold text-sm", settings.theme === 'dark' ? "text-[var(--color-brand-primary)]" : "text-gray-300")}>Dark Mode</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
