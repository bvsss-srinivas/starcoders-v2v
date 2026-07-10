import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function JobMatchesWidget({ jobs = [] }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleApplyClick = (e, job) => {
        e.preventDefault();
        e.stopPropagation();
        if (user?.verification_status !== 'verified') {
            alert('Identity verification is required to apply for jobs on ElevateHer. Please verify your profile first.');
            navigate('/dashboard/verification');
        } else {
            // In a real app this would route to a real apply URL or trigger a modal
            alert(`Application initiated for ${job.title} at ${job.company}`);
        }
    };

    return (
        <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BriefcaseBusiness className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    Top Job Matches
                </h3>
                <Link to="/jobs" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
                {jobs.length === 0 ? (
                    <div className="text-center py-4 my-auto">
                        <p className="text-sm text-gray-500">No matching jobs found right now.</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0 pr-4">
                                <h4 className="text-sm font-bold text-gray-900 truncate" title={job.title}>{job.title}</h4>
                                <p className="text-xs text-gray-500 truncate">{job.company} • {job.location}</p>
                            </div>
                            <button 
                                onClick={(e) => handleApplyClick(e, job)}
                                className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:text-[var(--color-brand-primary)] hover:border-[var(--color-brand-primary)] px-2.5 py-1.5 rounded transition-colors shadow-sm"
                            >
                                Apply <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
