import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';

export function WelcomeCard({ isLoading }) {
    const { user } = useAuth();

    // Format current date: e.g., "Thursday, October 24"
    const currentDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    if (isLoading) {
        return (
            <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col justify-center">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-64" />
            </div>
        );
    }

    const firstName = user?.firstName || user?.username || 'User';

    return (
        <div className="relative w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] overflow-hidden transition-all duration-150 hover:shadow-[var(--shadow-md)]">
            {/* Left accent border */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]" />
            
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-brand-text)] mb-1">
                    Welcome back, {firstName}
                </h2>
                <p className="text-sm text-[var(--color-brand-text-muted)] mb-4">
                    {currentDate}
                </p>
                
                {/* Contextual Nudge */}
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 px-3 py-2 rounded-[var(--radius-sm)] w-fit">
                    <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                    You're 2 steps away from a stronger profile.
                </div>
            </div>
        </div>
    );
}
