import React, { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API call
        setTimeout(() => {
            setMessage('If an account exists with this email, a password reset link has been sent.');
            setIsSubmitting(false);
            setEmail('');
        }, 1500);
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
