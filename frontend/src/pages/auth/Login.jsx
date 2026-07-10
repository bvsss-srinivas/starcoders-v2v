import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, verifyOtp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        if (requiresOtp) {
            const result = await verifyOtp(email, password, otp);
            if (!result.success) {
                setError(result.error);
            }
        } else {
            const result = await login(email, password);
            if (result.requiresOtp) {
                setRequiresOtp(true);
            } else if (!result.success) {
                setError(result.error);
            }
        }
        setIsSubmitting(false);
    };

    return (
        <AuthLayout 
            title={requiresOtp ? "Two-Factor Authentication" : "Welcome back"} 
            subtitle={requiresOtp ? "Enter the 6-digit code sent to your email." : "Sign in to your account to continue."}
            bottomText={requiresOtp ? "" : "Don't have an account?"}
            bottomLinkText={requiresOtp ? "Cancel" : "Create one now"}
            bottomLinkTo={requiresOtp ? "/login" : "/register"}
        >
            {error && (
                <div className="mb-6 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-status-error)]/10 p-3 text-sm text-[var(--color-status-error)] border border-[var(--color-status-error)]/20">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!requiresOtp ? (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-[var(--color-brand-text)]">Password</label>
                                <Link to="/forgot-password" className="text-xs font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="space-y-1">
                        <Input
                            label="6-Digit Code"
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className="text-center tabular-nums tracking-widest text-lg"
                        />
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isSubmitting}
                >
                    {requiresOtp ? "Verify & Sign in" : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    );
}
