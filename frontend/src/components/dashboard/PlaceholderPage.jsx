import React from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export function PlaceholderPage({ title, description, icon: Icon }) {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 page-enter-active">
            <div className="w-full max-w-md bg-white rounded-xl border border-[var(--color-brand-border)] p-8 text-center shadow-[var(--shadow-sm)]">
                <div className="flex justify-center mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                        {Icon && <Icon className="h-8 w-8" />}
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-brand-text)] mb-3">{title}</h2>
                <p className="text-[var(--color-brand-text-muted)] mb-8">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
