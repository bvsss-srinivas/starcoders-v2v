import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../api/axiosConfig';

export default function ResetPassword() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');
        
        try {
            const res = await api.post('/users/reset-password/', { 
                uidb64, 
                token, 
                new_password: password 
            });
            setMessage(res.data.detail || 'Password successfully reset.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password. The link may be invalid or expired.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout 
            title="Create New Password" 
            subtitle="Please enter your new password below."
            bottomText="Remember your password?"
            bottomLinkText="Back to login"
            bottomLinkTo="/login"
        >
            {message && (
                <div className="mb-6 rounded-[var(--radius-sm)] bg-[var(--color-status-success)]/10 p-4 text-sm text-[var(--color-status-success)] border border-[var(--color-status-success)]/20">
                    {message} Redirecting to login...
                </div>
            )}
            
            {error && (
                <div className="mb-6 rounded-[var(--radius-sm)] bg-[var(--color-status-error)]/10 p-4 text-sm text-[var(--color-status-error)] border border-[var(--color-status-error)]/20">
                    {error}
                </div>
            )}

            {!message && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <Input
                        label="Confirm New Password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        isLoading={isSubmitting}
                    >
                        Reset Password
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
}
