import React from 'react';
import { FileText, Mic, Target, MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { useNavigate } from 'react-router-dom';

const actions = [
    { id: 1, label: 'Update resume', icon: FileText, path: '/resumes' },
    { id: 2, label: 'Practice interview', icon: Mic, path: '/interviews' },
    { id: 3, label: 'Set new goal', icon: Target, path: '/ai-assistant' },
    { id: 4, label: 'Talk to AI coach', icon: MessageSquare, path: '/ai-assistant' },
];

export function QuickActions({ isLoading }) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="mb-4">
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-none w-[160px] h-[100px] rounded-[var(--radius-md)] bg-white p-4 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)]">
                            <Skeleton className="h-6 w-6 mb-3" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-sm font-semibold text-[var(--color-brand-text)] mb-4 uppercase tracking-wider">Quick Actions</h3>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => navigate(action.path)}
                        className="group flex-none sm:flex-1 w-[160px] sm:w-auto h-[100px] flex flex-col justify-center items-start text-left rounded-[var(--radius-md)] bg-white p-4 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 snap-start"
                    >
                        <action.icon className="w-6 h-6 text-[var(--color-brand-primary)] mb-3 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-medium text-[var(--color-brand-text)]">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
