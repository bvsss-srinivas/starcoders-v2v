import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WelcomeCard({ isLoading, summary }) {
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

    // Determine the most relevant nudge based on summary data
    let nudge = { message: "You're 2 steps away from a stronger profile.", link: "/profile" };
    
    if (summary) {
        if (!summary.resume) {
            nudge = { message: "Upload your resume to get an AI score.", link: "/resumes" };
        } else if (!summary.next_interview) {
            nudge = { message: "Practice your first mock interview.", link: "/interviews" };
        } else if (!summary.finance_goals || summary.finance_goals.length === 0) {
            nudge = { message: "Set your first savings goal.", link: "/finance" };
        } else if (summary.resume && summary.resume.score < 70) {
            nudge = { message: "Your resume could use improvement — see suggestions.", link: "/resumes" };
        } else {
            nudge = { message: "Check out the latest job matches for your profile.", link: "/jobs" };
        }
    }

    return (
        <div className="relative w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] overflow-hidden transition-all duration-150 hover:shadow-[var(--shadow-md)] flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Left accent border */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]" />
            
            <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-brand-text)]">
                        Welcome back, {firstName}
                    </h2>
                    {summary?.streak && (
                        <div className="hidden sm:flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full text-xs font-bold" title={summary.streak.label}>
                            <Flame className="w-3.5 h-3.5" />
                            {summary.streak.days} Day Streak
                        </div>
                    )}
                </div>
                <p className="text-sm text-[var(--color-brand-text-muted)] mb-4">
                    {currentDate}
                </p>
                
                {/* Contextual Nudge */}
                <Link to={nudge.link} className="flex items-center gap-2 text-sm font-medium text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 px-3 py-2 rounded-[var(--radius-sm)] w-fit hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                    <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse shrink-0" />
                    {nudge.message}
                </Link>
            </div>
            
            {/* Mobile streak view */}
            {summary?.streak && (
                <div className="sm:hidden flex items-center gap-1 bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-full text-xs font-bold w-fit">
                    <Flame className="w-3 h-3" />
                    {summary.streak.days} Day Streak
                </div>
            )}
        </div>
    );
}
