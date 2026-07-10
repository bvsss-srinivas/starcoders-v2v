import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Bell, MessageSquare } from 'lucide-react';

export function CommunityActivityWidget({ activities = [] }) {
    return (
        <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    Community Activity
                </h3>
                <Link to="/community" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1">
                    Go to Community <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
                {activities.length === 0 ? (
                    <div className="text-center py-4 my-auto">
                        <p className="text-sm text-gray-500">No recent community activity.</p>
                    </div>
                ) : (
                    activities.map((item, idx) => {
                        const isPost = item.type === 'post';
                        return (
                            <Link 
                                key={item.id || idx}
                                to="/community" 
                                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer group"
                            >
                                <div className="mt-0.5 shrink-0">
                                    {isPost ? (
                                        <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand-primary)]" />
                                    ) : (
                                        <Bell className="w-4 h-4 text-indigo-400 group-hover:text-[var(--color-brand-primary)]" />
                                    )}
                                </div>
                                <div>
                                    {isPost ? (
                                        <>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-500">Trending • By {item.author}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                                        </>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
