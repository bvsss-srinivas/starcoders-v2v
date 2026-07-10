import React, { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../api/axiosConfig';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [devLink, setDevLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setDevLink('');
        
        try {
            const res = await api.post('/users/forgot-password/', { email });
            setMessage(res.data.detail || 'If an account exists with this email, a password reset link has been sent.');
            if (res.data.dev_reset_link) {
                setDevLink(res.data.dev_reset_link);
            }
            setEmail('');
        } catch (error) {
            if (error.response?.data?.detail) {
                setMessage(error.response.data.detail);
            } else {
                setMessage('If an account exists with this email, a password reset link has been sent.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Enter your email to receive a reset link."
            bottomText="Remember your password?"
            bottomLinkText="Back to login"
            bottomLinkTo="/login"
        >
            {message && (
                <div className="mb-6 rounded-[var(--radius-sm)] bg-[var(--color-status-success)]/10 p-4 text-sm text-[var(--color-status-success)] border border-[var(--color-status-success)]/20">
                    {message}
                    {devLink && (
                        <div className="mt-2 pt-2 border-t border-[var(--color-status-success)]/20">
                            <strong>[Local Dev Only]</strong> Click here to reset your password: <br/>
                            <a href={devLink} className="underline font-bold break-all">{devLink}</a>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isSubmitting}
                >
                    Send Reset Link
                </Button>
            </form>
        </AuthLayout>
    );
}
