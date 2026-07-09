import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const stages = [
    { id: 1, title: 'Profile Setup', description: 'Complete your initial profile.', status: 'completed' },
    { id: 2, title: 'Resume Review', description: 'AI analyzes your uploaded resume.', status: 'completed' },
    { id: 3, title: 'Skill Gap Analysis', description: 'Identify areas for growth.', status: 'current' },
    { id: 4, title: 'Mock Interview', description: 'Practice with AI coach.', status: 'upcoming' },
    { id: 5, title: 'Job Matching', description: 'Get matched with top roles.', status: 'upcoming' },
];

export function RoadmapStepper({ isLoading }) {
    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[350px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col">
                <div className="mb-6">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="flex flex-col gap-6 flex-1 mt-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[350px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] transition-all duration-150">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">Career Roadmap</h3>
                <p className="text-sm text-[var(--color-brand-text-muted)]">Your recommended path to success.</p>
            </div>

            <div className="relative pl-3 mt-4">
                {/* Vertical line connecting steps */}
                <div className="absolute left-[23px] top-2 bottom-6 w-[2px] bg-[var(--color-brand-border)] z-0" />
                
                <div className="flex flex-col gap-6 relative z-10">
                    {stages.map((stage) => {
                        const isCompleted = stage.status === 'completed';
                        const isCurrent = stage.status === 'current';
                        
                        return (
                            <div key={stage.id} className="flex gap-4 group">
                                <div className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 bg-white transition-colors duration-200",
                                    isCompleted ? "border-[var(--color-status-success)] bg-[var(--color-status-success)] text-white" :
                                    isCurrent ? "border-[var(--color-brand-primary)]" : "border-gray-300"
                                )}>
                                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                                    {isCurrent && <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]" />}
                                </div>
                                <div className="flex flex-col pb-2">
                                    <h4 className={cn(
                                        "text-sm font-semibold",
                                        isCompleted ? "text-[var(--color-brand-text)]" :
                                        isCurrent ? "text-[var(--color-brand-primary)]" : "text-gray-400"
                                    )}>
                                        {stage.title}
                                    </h4>
                                    <p className={cn(
                                        "text-xs mt-0.5",
                                        isCurrent ? "text-[var(--color-brand-text)]" : "text-gray-400"
                                    )}>
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
