import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, Award, Heart, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function About() {
    const navigate = useNavigate();

    // Stats counter animation
    const [stats, setStats] = useState({ learners: 0, mentors: 0, satisfaction: 0, growth: 0 });

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            // Ease out quad
            const easeOut = progress * (2 - progress);
            
            setStats({
                learners: Math.floor(easeOut * 10000),
                mentors: Math.floor(easeOut * 500),
                satisfaction: Math.floor(easeOut * 95),
                growth: Math.floor(easeOut * 75)
            });
            
            if (currentStep >= steps) {
                clearInterval(timer);
                setStats({ learners: 10000, mentors: 500, satisfaction: 95, growth: 75 });
            }
        }, stepTime);
        
        return () => clearInterval(timer);
    }, []);

    const team = [
        { name: "Dr. Sarah Chen", role: "Founder & CEO", initials: "SC", color: "bg-[var(--color-brand-primary)]" },
        { name: "Marcus Johnson", role: "Head of Education", initials: "MJ", color: "bg-[var(--color-brand-secondary)]" },
        { name: "Elena Rodriguez", role: "Director of Mentorship", initials: "ER", color: "bg-[var(--color-status-success)]" },
        { name: "Aisha Patel", role: "Chief Financial Officer", initials: "AP", color: "bg-[var(--color-status-warning)]" }
    ];

    return (
        <div className="flex flex-col w-full bg-[var(--color-brand-background)] page-enter-active">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-light)] text-[var(--color-brand-surface)] py-24 px-6 md:px-12">
                <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4 text-[var(--color-brand-secondary)]" />
                        <span>Our Mission</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                        Empowering Women to Lead in STEM
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        We are building the ultimate ecosystem for women to learn technical skills, achieve financial independence, and accelerate their careers through world-class mentorship.
                    </p>
                </div>
            </section>

            {/* Three Pillars Section */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-brand-text)]">Our Three Pillars</h2>
                    <p className="text-[var(--color-brand-text-muted)] max-w-2xl mx-auto">The holistic approach to closing the gender gap in technology and leadership.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Learn */}
                    <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors duration-300">
                            <BookOpen className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-display font-semibold mb-3">Learn</h3>
                        <p className="text-[var(--color-brand-text-muted)] leading-relaxed">
                            Accessible, high-quality STEM education designed to take you from beginner to job-ready in high-growth tech fields.
                        </p>
                    </div>

                    {/* Earn */}
                    <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-brand-secondary)] group-hover:text-white transition-colors duration-300">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-display font-semibold mb-3">Earn</h3>
                        <p className="text-[var(--color-brand-text-muted)] leading-relaxed">
                            Financial literacy tools, budgeting strategies, and salary negotiation skills to build long-term wealth and independence.
                        </p>
                    </div>

                    {/* Lead */}
                    <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-status-success)] group-hover:text-white transition-colors duration-300">
                            <Users className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-display font-semibold mb-3">Lead</h3>
                        <p className="text-[var(--color-brand-text-muted)] leading-relaxed">
                            1:1 mentorship from industry leaders, networking opportunities, and career advancement support.
                        </p>
                    </div>
                </div>
            </section>

            {/* Impact Numbers */}
            <section className="bg-[var(--color-brand-primary)] text-white py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-display font-bold tabular-data">
                            {stats.learners.toLocaleString()}+
                        </div>
                        <div className="text-white/80 font-medium">Active Learners</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-display font-bold tabular-data">
                            {stats.mentors.toLocaleString()}+
                        </div>
                        <div className="text-white/80 font-medium">Verified Mentors</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-display font-bold tabular-data">
                            {stats.satisfaction}%
                        </div>
                        <div className="text-white/80 font-medium">Satisfaction Rate</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl md:text-5xl font-display font-bold tabular-data">
                            {stats.growth}%
                        </div>
                        <div className="text-white/80 font-medium">Career Growth</div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-brand-text)]">Meet Our Team</h2>
                    <p className="text-[var(--color-brand-text-muted)] max-w-2xl mx-auto">Dedicated professionals working to close the gender gap.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)]/50 hover:shadow-[var(--shadow-md)] transition-all duration-300">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-display font-bold mb-4 shadow-inner ${member.color}`}>
                                {member.initials}
                            </div>
                            <h4 className="text-lg font-semibold text-[var(--color-brand-text)]">{member.name}</h4>
                            <p className="text-sm text-[var(--color-brand-text-muted)]">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-[var(--color-brand-surface)] to-[var(--color-brand-background)] border border-[var(--color-brand-border)] p-12 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]">
                    <Heart className="h-12 w-12 text-[var(--color-brand-secondary)] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-brand-text)] mb-4">Ready to accelerate your career?</h2>
                    <p className="text-[var(--color-brand-text-muted)] mb-8 max-w-xl mx-auto">
                        Join thousands of women who are already transforming their futures with ElevateHer.
                    </p>
                    <Button size="lg" className="w-full sm:w-auto px-8 group" onClick={() => navigate('/signup')}>
                        Join ElevateHer Today
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </section>
        </div>
    );
}
