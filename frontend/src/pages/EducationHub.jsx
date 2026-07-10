import React, { useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Clock, BookOpen, Star, Filter } from 'lucide-react';

const MOCK_COURSES = [
    { id: 1, title: 'Intro to Python for Data Science', duration: '4 weeks', level: 'Beginner', category: 'Data Science', price: 'Free', rating: 4.8 },
    { id: 2, title: 'Machine Learning Foundations', duration: '8 weeks', level: 'Intermediate', category: 'AI/ML', price: 'Paid', rating: 4.9 },
    { id: 3, title: 'Cloud Security Fundamentals', duration: '6 weeks', level: 'Beginner', category: 'Cybersecurity', price: 'Paid', rating: 4.7 },
    { id: 4, title: 'Advanced React & System Design', duration: '10 weeks', level: 'Advanced', category: 'Software Eng', price: 'Paid', rating: 4.9 },
    { id: 5, title: 'Financial Modeling in Excel', duration: '4 weeks', level: 'Intermediate', category: 'FinTech', price: 'Free', rating: 4.6 },
    { id: 6, title: 'AWS Cloud Architect', duration: '12 weeks', level: 'Advanced', category: 'Cloud', price: 'Paid', rating: 4.8 },
];

export default function EducationHub() {
    const [filter, setFilter] = useState('All');

    const filteredCourses = filter === 'All' 
        ? MOCK_COURSES 
        : MOCK_COURSES.filter(c => c.category === filter);

    return (
        <PublicLayout>
            <div className="bg-[var(--color-brand-primary)] text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Education Hub</h1>
                    <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
                        Build highly sought-after skills in tech and finance. Explore our curated learning paths designed by industry experts.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
                    <div>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-[var(--color-brand-text)]"><Filter className="w-4 h-4" /> Filters</h3>
                        <div className="space-y-2">
                            {['All', 'Data Science', 'AI/ML', 'Cybersecurity', 'Software Eng', 'FinTech', 'Cloud'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`block w-full text-left px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${filter === cat ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] font-medium' : 'text-[var(--color-brand-text-muted)] hover:bg-gray-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Course Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Featured Courses</h2>
                        <span className="text-sm text-[var(--color-brand-text-muted)]">{filteredCourses.length} results</span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <Card key={course.id} className="flex flex-col">
                                <div className="h-40 bg-indigo-50 border-b border-[var(--color-brand-border)] flex items-center justify-center relative overflow-hidden">
                                    <BookOpen className="w-12 h-12 text-[var(--color-brand-primary)] opacity-20" />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <Badge variant={course.price === 'Free' ? 'success' : 'default'}>{course.price}</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-5 flex flex-col flex-1">
                                    <Badge variant="outline" className="w-fit mb-3">{course.category}</Badge>
                                    <h3 className="font-bold text-lg mb-2 leading-tight">{course.title}</h3>
                                    
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-brand-text-muted)] mt-auto mb-4">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-orange-400" /> {course.rating}</span>
                                    </div>
                                    <Button variant="secondary" className="w-full mt-auto">Enroll Now</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
