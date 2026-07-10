import React, { useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, MapPin, Building, Calendar } from 'lucide-react';

const MENTORS = [
    { id: 1, name: 'Dr. Evelyn Chen', role: 'VP of Engineering', company: 'TechNova', tags: ['Leadership', 'System Design'], available: true },
    { id: 2, name: 'Sarah Jenkins', role: 'Senior Data Scientist', company: 'FinServe', tags: ['Python', 'Machine Learning'], available: true },
    { id: 3, name: 'Maya Patel', role: 'Cybersecurity Lead', company: 'SecureNet', tags: ['Security', 'Cloud'], available: false },
    { id: 4, name: 'Jordan Lee', role: 'Product Manager', company: 'InnovateX', tags: ['Product Strategy', 'Agile'], available: true },
];

export default function Mentorship() {
    return (
        <PublicLayout>
            <div className="bg-indigo-50 py-16 border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-brand-text)]">Find Your Guide</h1>
                        <p className="text-lg text-[var(--color-brand-text-muted)] mb-8">
                            Connect with experienced women in STEM. Get advice on navigating your career, negotiating offers, and overcoming challenges.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="primary">Find a Mentor</Button>
                            <Button variant="secondary">Become a Mentor</Button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center">
                        <div className="w-72 h-72 rounded-full border-8 border-white shadow-xl overflow-hidden bg-purple-200 relative">
                           {/* Placeholder for imagery */}
                           <div className="absolute inset-0 flex items-center justify-center text-purple-400 font-bold">Mentor Network</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Search / Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by industry, role, or skill..." 
                            className="w-full pl-10 pr-4 py-3 rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                        />
                    </div>
                    <select className="px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] focus:outline-none">
                        <option>All Industries</option>
                        <option>Software Engineering</option>
                        <option>Data Science</option>
                        <option>Product Management</option>
                    </select>
                </div>

                {/* Mentor Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {MENTORS.map(mentor => (
                        <Card key={mentor.id} className="flex flex-col">
                            <CardContent className="p-6 flex flex-col flex-1 text-center items-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-xl font-bold text-gray-500">
                                    {mentor.name.charAt(0)}
                                </div>
                                <h3 className="font-bold text-lg">{mentor.name}</h3>
                                <p className="text-sm text-[var(--color-brand-text-muted)] mb-1">{mentor.role}</p>
                                <p className="text-sm text-[var(--color-brand-text-muted)] mb-4 flex items-center gap-1 justify-center">
                                    <Building className="w-3 h-3" /> {mentor.company}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {mentor.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-[10px] px-2">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="mt-auto w-full">
                                    <Button 
                                        variant={mentor.available ? "secondary" : "ghost"} 
                                        className="w-full"
                                        disabled={!mentor.available}
                                    >
                                        {mentor.available ? 'Request Mentorship' : 'Fully Booked'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Events Preview */}
                <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] p-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Upcoming Community Events</h2>
                            <p className="text-[var(--color-brand-text-muted)]">Join our live Q&A sessions and workshops.</p>
                        </div>
                        <Button variant="ghost">View Calendar</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Navigating Your First Tech Interview', date: 'Next Tuesday, 5:00 PM EST', type: 'Webinar' },
                            { title: 'Salary Negotiation Workshop', date: 'Oct 15, 2:00 PM EST', type: 'Workshop' }
                        ].map((event, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-[var(--radius-sm)] border border-gray-100 gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{event.title}</h4>
                                        <p className="text-sm text-[var(--color-brand-text-muted)]">{event.date}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="w-fit">{event.type}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
