import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Briefcase, FileText, MessageSquare, ArrowRight, MapPin } from 'lucide-react';

const JOBS = [
    { id: 1, title: 'Frontend Developer', company: 'Stripe', location: 'Remote', type: 'Full-time', level: 'Mid-Level' },
    { id: 2, title: 'Data Scientist', company: 'Spotify', location: 'New York, NY', type: 'Full-time', level: 'Entry-Level' },
    { id: 3, title: 'Product Manager', company: 'Notion', location: 'San Francisco, CA', type: 'Hybrid', level: 'Senior' },
];

export default function CareerGrowth() {
    return (
        <PublicLayout>
            <div className="bg-white py-16 border-b border-[var(--color-brand-border)]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Growth</h1>
                    <p className="text-lg text-[var(--color-brand-text-muted)] max-w-2xl mx-auto">
                        Tools to help you land your next role. From AI-powered resume reviews to job matching and interview prep.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
                
                {/* Top Features */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-indigo-50/50 border-indigo-100">
                        <CardContent className="p-8 md:p-10">
                            <div className="w-12 h-12 bg-[var(--color-brand-primary)] text-white rounded-lg flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Resume Review Tool</h2>
                            <p className="text-[var(--color-brand-text-muted)] mb-8">
                                Upload your resume and let our AI analyze it against industry standards. Get actionable feedback in seconds.
                            </p>
                            <Button variant="primary">Upload Resume</Button>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-orange-50/50 border-orange-100">
                        <CardContent className="p-8 md:p-10">
                            <div className="w-12 h-12 bg-[var(--color-brand-secondary)] text-white rounded-lg flex items-center justify-center mb-6">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Interview Prep</h2>
                            <p className="text-[var(--color-brand-text-muted)] mb-8">
                                Schedule mock interviews, practice behavioral questions, and access our library of technical assessments.
                            </p>
                            <Button variant="secondary">Start Prep</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Board Preview */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Featured Opportunities</h2>
                            <p className="text-[var(--color-brand-text-muted)]">Exclusive roles from our hiring partners.</p>
                        </div>
                        <Button variant="ghost" className="hidden sm:flex text-[var(--color-brand-primary)]">
                            View all jobs <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {JOBS.map(job => (
                            <Card key={job.id} className="hover:-translate-y-1 transition-transform duration-200">
                                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-[var(--color-brand-text-muted)]">
                                                <span className="font-medium text-[var(--color-brand-text)]">{job.company}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                        <Badge variant="outline">{job.type}</Badge>
                                        <Badge variant="secondary">{job.level}</Badge>
                                        <Button variant="primary" size="sm" className="ml-auto sm:ml-4">Apply</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Career Roadmap Banner */}
                <div className="bg-[var(--color-brand-primary)] rounded-[var(--radius-lg)] p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
                        <p className="text-indigo-100 mb-8 text-lg">
                            Explore our Career Roadmaps. Step-by-step guides showing you exactly what skills to learn from "0 to Software Engineer" in 12 months.
                        </p>
                        <Button variant="secondary" className="text-[var(--color-brand-primary)] border-transparent px-8">
                            View Roadmaps
                        </Button>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
