import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const ALUMNAE = [
    {
        id: 1,
        name: 'Jessica M.',
        before: 'Retail Assistant',
        after: 'Junior Software Engineer @ TechCorp',
        quote: "The frontend roadmap gave me structure, but my mentor gave me the confidence to ace the technical interview.",
        program: 'Software Engineering',
        initial: 'J'
    },
    {
        id: 2,
        name: 'Aisha K.',
        before: 'Data Entry Clerk',
        after: 'Data Analyst @ FinServe',
        quote: "I didn't think I was 'good at math' until I took the Python for Data Science course. It completely changed my trajectory.",
        program: 'Data Science',
        initial: 'A'
    },
    {
        id: 3,
        name: 'Elena R.',
        before: 'Marketing Coordinator',
        after: 'Product Manager @ StartupX',
        quote: "ElevateHer helped me translate my communication skills into tech requirements. The salary negotiation tool got me a 30% bump.",
        program: 'Product Management',
        initial: 'E'
    },
    {
        id: 4,
        name: 'Priya S.',
        before: 'Teacher',
        after: 'UX Designer @ CreativeAgency',
        quote: "Transitioning careers was terrifying, but the community here held my hand the entire way. The portfolio reviews were invaluable.",
        program: 'UX Design',
        initial: 'P'
    },
];

export default function SuccessStories() {
    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
                    <p className="text-lg text-[var(--color-brand-text-muted)]">
                        Meet the women who have transformed their careers, shattered glass ceilings, and are now leading the charge in STEM.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {ALUMNAE.map(story => (
                        <Card key={story.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-8 pb-6">
                                    <p className="text-lg italic font-medium leading-relaxed mb-6">"{story.quote}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-xl text-[var(--color-brand-primary)]">
                                            {story.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{story.name}</h4>
                                            <Badge variant="secondary" className="mt-1">{story.program}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 border-t border-[var(--color-brand-border)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs uppercase text-[var(--color-brand-text-muted)] font-semibold mb-1">Before</p>
                                        <p className="text-sm font-medium">{story.before}</p>
                                    </div>
                                    <div className="hidden sm:block text-gray-300">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                    </div>
                                    <div className="flex-1 sm:text-right">
                                        <p className="text-xs uppercase text-[var(--color-status-success)] font-semibold mb-1">After</p>
                                        <p className="text-sm font-bold text-[var(--color-brand-text)]">{story.after}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center bg-orange-50 rounded-2xl p-10 border border-orange-100">
                    <h2 className="text-2xl font-bold mb-4">Have your own story to tell?</h2>
                    <p className="text-[var(--color-brand-text-muted)] mb-6 max-w-lg mx-auto">Your journey could be the exact inspiration another woman needs to take her first step into STEM.</p>
                    <Button variant="primary">Share Your Story</Button>
                </div>
            </div>
        </PublicLayout>
    );
}
