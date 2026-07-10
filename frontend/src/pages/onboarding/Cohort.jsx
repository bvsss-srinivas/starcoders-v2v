import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Users, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Cohort() {
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Trigger simple entrance animation
        setTimeout(() => setShowConfetti(true), 300);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] flex flex-col items-center justify-center p-6 page-enter-active">
            <div className="max-w-2xl w-full bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] shadow-[var(--shadow-md)] p-8 md:p-12 text-center relative overflow-hidden">
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-brand-secondary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-full bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] mb-6 transition-all duration-1000 ${showConfetti ? 'scale-110 rotate-12' : 'scale-50 opacity-0'}`}>
                        <Sparkles className="h-10 w-10" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-brand-text)] mb-4">
                        Your Personalized Path is Ready!
                    </h1>
                    <p className="text-[var(--color-brand-text-muted)] mb-10 max-w-lg mx-auto">
                        Based on your goals and background, we've matched you with the perfect starting point and a supportive learning community.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                        {/* Course Match */}
                        <div className="border border-[var(--color-brand-border)] rounded-[var(--radius-md)] p-5 hover:border-[var(--color-brand-primary)]/50 transition-colors bg-white shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-md">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-[var(--color-brand-text)]">Recommended Course</h3>
                            </div>
                            <h4 className="font-display font-bold text-lg mb-2">Cloud Computing Fundamentals</h4>
                            <p className="text-sm text-[var(--color-brand-text-muted)] mb-4 line-clamp-2">
                                Master the basics of AWS, Azure, and Google Cloud to kickstart your cloud engineering career.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-brand-text-muted)]">
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 8 weeks</span>
                                <span className="px-2 py-0.5 bg-gray-100 rounded-full">Beginner</span>
                            </div>
                        </div>

                        {/* Cohort Match */}
                        <div className="border border-[var(--color-brand-border)] rounded-[var(--radius-md)] p-5 hover:border-[var(--color-brand-secondary)]/50 transition-colors bg-white shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] rounded-md">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-[var(--color-brand-text)]">Your Learning Cohort</h3>
                            </div>
                            <h4 className="font-display font-bold text-lg mb-2">Winter 2026 Cloud Pioneers</h4>
                            <p className="text-sm text-[var(--color-brand-text-muted)] mb-4 line-clamp-2">
                                Join 45 other women starting their cloud journey at the same time. Support each other and grow together.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-brand-text-muted)]">
                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Starts today</span>
                                <span className="flex items-center gap-1 text-[var(--color-brand-primary)]">45 Members</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full sm:w-auto px-8"
                            onClick={() => navigate('/dashboard')}
                        >
                            Start Learning
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="lg"
                            className="w-full sm:w-auto px-8"
                            onClick={() => navigate('/courses')}
                        >
                            Browse All Courses
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
