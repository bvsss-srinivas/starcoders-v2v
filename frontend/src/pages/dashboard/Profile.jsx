import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Briefcase, Mail, User as UserIcon } from 'lucide-react';
import api from '../../api/axiosConfig';
import { cn } from '../../lib/utils';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: ''
    });
    
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                email: user.email || '',
                phone_number: user.phone_number || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.put('users/me/', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                phone_number: formData.phone_number
            });
            setUser(response.data);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            const errorMsg = error.response?.data?.username?.[0] || 
                             error.response?.data?.detail || 
                             'Failed to update profile. Please try again.';
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">My Profile</h1>
                    <p className="text-[var(--color-brand-text-muted)] mt-2">
                        Manage your personal information and account settings.
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                    <div className="p-6 border-b border-[var(--color-brand-border)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
                                <p className="text-[var(--color-brand-text-muted)]">Member since 2026</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        
                        {status.message && (
                            <div className={cn(
                                "p-4 rounded-md text-sm font-medium",
                                status.type === 'success' ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                            )}>
                                {status.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-brand-text)]">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-brand-text)]">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-brand-text)]">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--color-brand-text)]">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-brand-text)]">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed currently.</p>
                        </div>

                        <div className="pt-4 border-t border-[var(--color-brand-border)] flex justify-end">
                            <Button type="submit" variant="primary" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
