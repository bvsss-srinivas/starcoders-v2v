import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Award, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function DashboardCourses() {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        // Mock active enrollments
        setEnrollments([
            {
                id: 1,
                course_id: 1,
                course_title: 'Cloud Computing Fundamentals',
                course_slug: 'cloud-computing-fundamentals',
                course_thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
                status: 'active',
                progress_percentage: 45,
                last_accessed: '2 hours ago'
            },
            {
                id: 2,
                course_id: 2,
                course_title: 'Data Science Bootcamp',
                course_slug: 'data-science-bootcamp',
                course_thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
                status: 'active',
                progress_percentage: 12,
                last_accessed: '3 days ago'
            }
        ]);
    }, []);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[var(--color-brand-text)]">My Learning</h1>
                    <p className="text-[var(--color-brand-text-muted)]">Continue where you left off.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/courses')}>
                    Browse More Courses
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map(enrollment => (
                    <div 
                        key={enrollment.id} 
                        className="bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col sm:flex-row"
                    >
                        <div className="w-full sm:w-48 h-40 sm:h-auto shrink-0 relative">
                            <img src={enrollment.course_thumbnail} alt={enrollment.course_title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-display font-semibold text-lg line-clamp-1 mb-1" title={enrollment.course_title}>
                                    {enrollment.course_title}
                                </h3>
                                <p className="text-xs text-[var(--color-brand-text-muted)] mb-4 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Last accessed {enrollment.last_accessed}
                                </p>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-[var(--color-brand-primary)]">
                                        {enrollment.progress_percentage}% Complete
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div 
                                        className="bg-[var(--color-brand-primary)] h-2 rounded-full" 
                                        style={{ width: `${enrollment.progress_percentage}%` }}
                                    ></div>
                                </div>
                                
                                <Button 
                                    className="w-full" 
                                    variant="primary"
                                    onClick={() => navigate(`/dashboard/courses/${enrollment.course_id}/learn`)}
                                >
                                    Continue Learning
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Completed Courses Section */}
            <div className="pt-8 border-t border-[var(--color-brand-border)]">
                <h2 className="text-xl font-display font-bold text-[var(--color-brand-text)] mb-6">Completed Certificates</h2>
                <div className="bg-[var(--color-brand-background)] border border-dashed border-[var(--color-brand-border)] rounded-[var(--radius-lg)] p-8 text-center flex flex-col items-center">
                    <Award className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="font-medium text-gray-500">No completed courses yet</h3>
                    <p className="text-sm text-gray-400 mt-1">Keep learning to earn your first certificate!</p>
                </div>
            </div>
        </div>
    );
}
