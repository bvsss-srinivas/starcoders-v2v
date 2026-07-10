import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BarChart, BookOpen, CheckCircle, Shield, Award, PlayCircle, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';

export default function CourseDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        // Mock fetch based on slug
        setTimeout(() => {
            setCourse({
                id: 1,
                slug: 'cloud-computing-fundamentals',
                title: 'Cloud Computing Fundamentals',
                description: 'Master the basics of AWS, Azure, and Google Cloud to kickstart your cloud engineering career. This comprehensive course covers core cloud concepts, core services, security, architecture, pricing, and support.',
                category: 'Cloud Computing',
                level: 'Beginner',
                duration_hours: 40,
                thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
                author_name: 'Dr. Sarah Chen',
                modules: [
                    { id: 1, title: 'Introduction to Cloud Computing', lessons_count: 5, duration: '4h 30m' },
                    { id: 2, title: 'Compute Services', lessons_count: 8, duration: '7h 15m' },
                    { id: 3, title: 'Storage & Databases', lessons_count: 6, duration: '6h 00m' },
                    { id: 4, title: 'Networking & Security', lessons_count: 7, duration: '8h 45m' },
                ]
            });
            setLoading(false);
        }, 800);
    }, [slug]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/courses/' + slug);
            return;
        }

        setEnrolling(true);
        try {
            // await axiosInstance.post(`/courses/${slug}/enroll/`);
            setTimeout(() => {
                setEnrolling(false);
                navigate(`/dashboard/courses/1/learn`);
            }, 1000);
        } catch (error) {
            console.error('Enrollment failed:', error);
            setEnrolling(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-primary)]"></div></div>;
    }

    if (!course) return <div>Course not found</div>;

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] page-enter-active">
            {/* Hero Section */}
            <div className="bg-[var(--color-brand-primary)] text-white py-16 md:py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-primary)] to-transparent"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-brand-secondary)] uppercase tracking-wider">
                            <span>{course.category}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                            <span className="text-white/80">{course.level}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                            {course.title}
                        </h1>
                        
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                            {course.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)] flex items-center justify-center text-lg font-bold">
                                    {course.author_name.charAt(0)}
                                </div>
                                <span>{course.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <Clock className="h-5 w-5" />
                                {course.duration_hours} Hours
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <BookOpen className="h-5 w-5" />
                                {course.modules.length} Modules
                            </div>
                        </div>
                    </div>
                    
                    {/* Enrollment Card (Desktop floats, mobile inline) */}
                    <div className="lg:col-span-4 relative lg:translate-y-24 z-20">
                        <div className="bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] shadow-[var(--shadow-lg)] p-8 text-[var(--color-brand-text)]">
                            <div className="mb-6">
                                <span className="text-3xl font-display font-bold">Free</span>
                                <span className="text-[var(--color-brand-text-muted)] ml-2">with ElevateHer</span>
                            </div>
                            
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-full mb-6 text-lg py-6"
                                onClick={handleEnroll}
                                isLoading={enrolling}
                            >
                                Enroll Now
                            </Button>
                            
                            <div className="space-y-4">
                                <h4 className="font-semibold">This course includes:</h4>
                                <ul className="space-y-3 text-sm text-[var(--color-brand-text-muted)]">
                                    <li className="flex items-center gap-3"><PlayCircle className="h-4 w-4 text-[var(--color-brand-secondary)]" /> {course.duration_hours} hours on-demand video</li>
                                    <li className="flex items-center gap-3"><Award className="h-4 w-4 text-[var(--color-brand-secondary)]" /> Certificate of completion</li>
                                    <li className="flex items-center gap-3"><Shield className="h-4 w-4 text-[var(--color-brand-secondary)]" /> Lifetime access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* What you'll learn */}
                    <div className="bg-white border border-[var(--color-brand-border)] rounded-[var(--radius-lg)] p-8 shadow-sm">
                        <h2 className="text-2xl font-display font-bold mb-6">What you'll learn</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Understand fundamental cloud computing concepts and terminology",
                                "Design highly available and fault-tolerant architectures",
                                "Implement foundational security and compliance practices",
                                "Understand cloud pricing, billing, and support models"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-[var(--color-status-success)] shrink-0 mt-0.5" />
                                    <span className="text-sm text-[var(--color-brand-text-muted)]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Content / Modules */}
                    <div>
                        <h2 className="text-2xl font-display font-bold mb-6">Course Content</h2>
                        <div className="space-y-4">
                            {course.modules.map((module, idx) => (
                                <div key={module.id} className="border border-[var(--color-brand-border)] rounded-[var(--radius-md)] overflow-hidden bg-white">
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="text-[var(--color-brand-primary)] font-bold">M{idx + 1}</div>
                                            <h3 className="font-semibold">{module.title}</h3>
                                        </div>
                                        <div className="text-sm text-[var(--color-brand-text-muted)] hidden sm:block">
                                            {module.lessons_count} lessons • {module.duration}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-[var(--color-brand-border)] space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <PlayCircle className="h-4 w-4 text-[var(--color-brand-text-muted)]" />
                                                    <span className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-primary)] cursor-pointer">Lesson {i + 1} Title Goes Here</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Lock className="h-3 w-3 text-gray-400" />
                                                    <span className="text-gray-400">10:00</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
