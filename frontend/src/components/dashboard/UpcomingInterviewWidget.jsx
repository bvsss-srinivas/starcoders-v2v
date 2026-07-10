import React from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowRight, CalendarPlus, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export function UpcomingInterviewWidget({ interview }) {
    return (
        <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    Mock Interview
                </h3>
                <Link to="/interviews" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1">
                    Manage <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
                {!interview ? (
                    <div className="text-center py-4 bg-indigo-50/50 rounded-xl border border-indigo-100 p-4">
                        <p className="text-sm text-indigo-800 font-medium mb-3">No upcoming interviews scheduled.</p>
                        <Link to="/interviews">
                            <Button variant="primary" size="sm" className="gap-2 mx-auto w-full justify-center">
                                <CalendarPlus className="w-4 h-4" /> Schedule One
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded">
                                Upcoming Session
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-1">{interview.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                            <span className="flex items-center gap-1 capitalize">
                                <Video className="w-3.5 h-3.5" /> {interview.interview_type}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {new Date(interview.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'})}
                            </span>
                        </div>
                        <Link to="/interviews">
                            <Button className="w-full justify-center gap-2">
                                <Video className="w-4 h-4" /> Join Session
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
