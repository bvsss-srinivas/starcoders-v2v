import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ActionModal } from '../../../components/ui/ActionModal';
import { Shield, Key, AlertTriangle } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function AccountSettings() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (passwords.new_password !== passwords.confirm_password) {
            setError('New passwords do not match.');
            return;
        }
        
        setIsSaving(true);
        try {
            await api.post('/users/change-password/', {
                current_password: passwords.current_password,
                new_password: passwords.new_password
            });
            setShowSuccess(true);
            setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to change password. Please ensure your current password is correct.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Email Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-display font-semibold text-[var(--color-brand-text)] mb-1">Email Address</h2>
                    <p className="text-sm text-[var(--color-brand-text-muted)]">Manage your account email address.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                        <Input 
                            label="Primary Email" 
                            value={user?.email || ''} 
                            disabled 
                        />
                    </div>
                    <Button variant="outline">Change Email</Button>
                </div>
                {user?.verification_status !== 'verified' && (
                    <div className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-status-warning)]/10 p-3 text-sm text-[var(--color-status-warning)] border border-[var(--color-status-warning)]/20">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                            <span className="font-semibold block mb-0.5">Verification required</span>
                            Your account is not fully verified yet. Some features may be restricted.
                        </div>
                    </div>
                )}
            </section>

            <hr className="border-[var(--color-brand-border)]" />

            {/* Password Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-display font-semibold text-[var(--color-brand-text)] mb-1">Change Password</h2>
                    <p className="text-sm text-[var(--color-brand-text-muted)]">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    {error && (
                        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-status-error)]/10 p-3 text-sm text-[var(--color-status-error)] border border-[var(--color-status-error)]/20">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    <Input 
                        label="Current Password" 
                        type="password" 
                        required 
                        value={passwords.current_password}
                        onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                        icon={<Key className="h-4 w-4" />}
                    />
                    <Input 
                        label="New Password" 
                        type="password" 
                        required 
                        value={passwords.new_password}
                        onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                        icon={<Shield className="h-4 w-4" />}
                    />
                    <Input 
                        label="Confirm New Password" 
                        type="password" 
                        required 
                        value={passwords.confirm_password}
                        onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                    />
                    <div className="pt-2">
                        <Button type="submit" variant="primary" isLoading={isSaving}>Update Password</Button>
                    </div>
                </form>
            </section>

            <hr className="border-[var(--color-brand-border)]" />

            {/* Danger Zone */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-display font-semibold text-[var(--color-status-error)] mb-1">Danger Zone</h2>
                    <p className="text-sm text-[var(--color-brand-text-muted)]">Irreversible and destructive actions.</p>
                </div>
                <div className="border border-[var(--color-status-error)]/30 rounded-[var(--radius-md)] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--color-status-error)]/5">
                    <div>
                        <h4 className="font-semibold text-[var(--color-brand-text)] mb-1">Delete Account</h4>
                        <p className="text-sm text-[var(--color-brand-text-muted)]">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <Button variant="outline" className="text-[var(--color-status-error)] border-[var(--color-status-error)] hover:bg-[var(--color-status-error)] hover:text-white shrink-0">
                        Delete Account
                    </Button>
                </div>
            </section>

            <ActionModal 
                isOpen={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                title="Password Updated!" 
                message="Your account password has been successfully changed." 
            />
        </div>
    );
}
