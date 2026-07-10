import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { BookOpen, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-orange-50 -z-10" />
                {/* Abstract decorative shapes */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
                
                <div className="max-w-4xl mx-auto z-10">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-brand-text)] mb-6 leading-tight">
                        Your Path to STEM, Finance & <span className="text-[var(--color-brand-primary)]">Career Confidence</span> Starts Here
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--color-brand-text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
                        Built by women who've been there. For the ones just getting started. Gain skills, capital, and a community that supports your ambition.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto px-8">
                            Get Started
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => navigate('/education')} className="w-full sm:w-auto px-8">
                            Explore Programs
                        </Button>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="border-y border-[var(--color-brand-border)] bg-white py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-text-muted)] mb-6">Our Impact So Far</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[var(--color-brand-border)]">
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--color-brand-primary)] mb-1 tabular-data">10,000+</p>
                            <p className="text-sm text-[var(--color-brand-text-muted)]">Women Mentored</p>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--color-status-success)] mb-1 tabular-data">85%</p>
                            <p className="text-sm text-[var(--color-brand-text-muted)]">Report Income Growth</p>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--color-brand-primary)] mb-1 tabular-data">500+</p>
                            <p className="text-sm text-[var(--color-brand-text-muted)]">Hiring Partners</p>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-bold text-[var(--color-brand-secondary)] mb-1 tabular-data">50k+</p>
                            <p className="text-sm text-[var(--color-brand-text-muted)]">Courses Completed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Three Pillars */}
            <section className="py-24 bg-[var(--color-brand-background)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
                        <p className="text-[var(--color-brand-text-muted)]">A holistic approach to closing the gender gap in STEM and finance.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="hover:-translate-y-1 transition-transform duration-300">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-[var(--color-brand-primary)] flex items-center justify-center mb-6">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Education Hub</h3>
                                <p className="text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    Master Data Science, AI, and Cybersecurity through expert-led, flexible courses designed for all levels.
                                </p>
                                <Link to="/education" className="text-[var(--color-brand-primary)] font-medium flex items-center hover:underline">
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </CardContent>
                        </Card>
                        
                        <Card className="hover:-translate-y-1 transition-transform duration-300">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[var(--color-brand-secondary)] flex items-center justify-center mb-6">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">FinTech & Literacy</h3>
                                <p className="text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    Take control of your wealth with salary estimators, budget calculators, and financial inclusion tools.
                                </p>
                                <Link to="/fintech" className="text-[var(--color-brand-primary)] font-medium flex items-center hover:underline">
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="hover:-translate-y-1 transition-transform duration-300">
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[var(--color-status-success)] flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Career & Mentorship</h3>
                                <p className="text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    Connect with industry leaders, refine your resume, and land roles at top tech companies.
                                </p>
                                <Link to="/mentorship" className="text-[var(--color-brand-primary)] font-medium flex items-center hover:underline">
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Hear from our community</h2>
                    <div className="bg-[var(--color-brand-background)] p-8 md:p-12 rounded-[var(--radius-lg)] shadow-sm relative">
                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-[var(--color-brand-text)] mb-8">
                            "ElevateHer didn't just teach me how to code; it taught me how to negotiate my salary and introduced me to a mentor who changed my life. I went from feeling stuck to landing a Senior Data Analyst role."
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                {/* Fallback avatar */}
                                <span className="font-semibold text-gray-500">SJ</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-[var(--color-brand-text)]">Sarah Jenkins</p>
                                <p className="text-sm text-[var(--color-brand-text-muted)]">Senior Data Analyst</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-24 bg-[var(--color-brand-primary)] text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to take the next step?</h2>
                    <p className="text-indigo-100 text-lg mb-10">Join thousands of women building the future of tech and finance.</p>
                    <Button variant="secondary" size="lg" onClick={() => navigate('/register')} className="px-10 text-[var(--color-brand-primary)] border-transparent">
                        Create Your Free Account
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
