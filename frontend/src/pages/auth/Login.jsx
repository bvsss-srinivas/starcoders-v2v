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
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        const result = await login(email, password);
        
        if (!result.success) {
            setError(result.error);
        }
        setIsSubmitting(false);
    };

    return (
        <AuthLayout 
            title="Welcome back" 
            subtitle="Sign in to your account to continue."
            bottomText="Don't have an account?"
            bottomLinkText="Create one now"
            bottomLinkTo="/register"
        >
            {error && (
                <div className="mb-6 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-status-error)]/10 p-3 text-sm text-[var(--color-status-error)] border border-[var(--color-status-error)]/20">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
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

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isSubmitting}
                >
                    Sign in
                </Button>
            </form>
        </AuthLayout>
    );
}
