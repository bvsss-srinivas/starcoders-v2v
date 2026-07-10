import React from 'react';
import { Award, Download, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function Certificates() {
    const certificates = [
        {
            id: 1,
            course_title: 'Cloud Computing Fundamentals',
            issued_at: 'March 15, 2026',
            credential_id: 'EH-CCF-2026-987654',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-2xl font-display font-bold text-[var(--color-brand-text)] mb-1">My Certificates</h1>
                <p className="text-[var(--color-brand-text-muted)]">Showcase your achievements and skills.</p>
            </div>

            {certificates.length === 0 ? (
                <div className="bg-[var(--color-brand-background)] border border-dashed border-[var(--color-brand-border)] rounded-[var(--radius-lg)] p-12 text-center flex flex-col items-center">
                    <Award className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No certificates yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Complete your first course to earn a verifiable certificate that you can share on LinkedIn.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <div key={cert.id} className="bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col group">
                            {/* Certificate Preview */}
                            <div className="h-48 relative border-b border-[var(--color-brand-border)] bg-gray-50 p-4">
                                <div className="absolute inset-0 opacity-20">
                                    <img src={cert.thumbnail} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative h-full border-[6px] border-double border-[var(--color-brand-primary)]/30 bg-white/90 p-4 flex flex-col items-center justify-center text-center">
                                    <Award className="h-8 w-8 text-[var(--color-brand-secondary)] mb-2" />
                                    <h4 className="font-display font-bold text-[10px] uppercase tracking-wider text-[var(--color-brand-primary)] mb-1">Certificate of Completion</h4>
                                    <p className="font-semibold text-sm leading-tight text-gray-800 line-clamp-2">{cert.course_title}</p>
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="mb-6">
                                    <h3 className="font-display font-bold text-lg mb-1 line-clamp-1">{cert.course_title}</h3>
                                    <p className="text-xs text-[var(--color-brand-text-muted)] mb-1">Issued: {cert.issued_at}</p>
                                    <p className="text-xs text-[var(--color-brand-text-muted)]">ID: <span className="font-mono">{cert.credential_id}</span></p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </Button>
                                    <Button variant="primary" size="sm" className="flex-1 bg-[#0077b5] border-[#0077b5] hover:bg-[#006396]">
                                        <Share2 className="h-4 w-4 mr-2" /> LinkedIn
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
