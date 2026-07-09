import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const conversations = [
    { id: 1, topic: 'Salary Negotiation Prep', time: '2 hours ago', icon: MessageSquare },
    { id: 2, title: 'Resume Feedback: Tech Lead', time: 'Yesterday', icon: MessageSquare },
    { id: 3, title: 'Interview Practice: System Design', time: 'Oct 22', icon: MessageSquare },
];

export function ConversationList({ isLoading }) {
    if (isLoading) {
        return (
            <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-center">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const hasConversations = conversations && conversations.length > 0;

    return (
        <div className="w-full h-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col transition-all duration-150">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">Recent AI Coaching</h3>
                    <p className="text-sm text-[var(--color-brand-text-muted)]">Pick up where you left off.</p>
                </div>
                {hasConversations && (
                    <Link to="/chat" className="text-sm font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
                {!hasConversations ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <EmptyState 
                            title="No conversations yet"
                            description="Start chatting with your AI coach to get personalized career advice."
                            actionLabel="Start a Chat"
                            onAction={() => {}}
                        />
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div 
                            key={conv.id} 
                            className="group flex items-center gap-3 p-3 -mx-3 rounded-[var(--radius-sm)] hover:bg-gray-50 transition-colors cursor-pointer"
                            tabIndex={0}
                            role="button"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] shrink-0 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors">
                                <conv.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h4 className="text-sm font-medium text-[var(--color-brand-text)] truncate">
                                    {conv.topic || conv.title}
                                </h4>
                                <span className="text-xs text-[var(--color-brand-text-muted)]">
                                    {conv.time}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
