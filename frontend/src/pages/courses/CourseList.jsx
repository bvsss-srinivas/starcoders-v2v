import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosInstance from '../../api/axiosConfig';

export default function CourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // In a real app we'd fetch from /api/courses/
                // const res = await axiosInstance.get('/courses/');
                // setCourses(res.data);
                
                // Mock data for display
                setCourses([
                    {
                        id: 1,
                        slug: 'cloud-computing-fundamentals',
                        title: 'Cloud Computing Fundamentals',
                        description: 'Master the basics of AWS, Azure, and Google Cloud to kickstart your cloud engineering career.',
                        category: 'cloud',
                        level: 'beginner',
                        duration_hours: 40,
                        thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
                        author_name: 'Dr. Sarah Chen'
                    },
                    {
                        id: 2,
                        slug: 'data-science-bootcamp',
                        title: 'Data Science Bootcamp',
                        description: 'Learn Python, pandas, machine learning algorithms, and data visualization techniques.',
                        category: 'data',
                        level: 'intermediate',
                        duration_hours: 120,
                        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
                        author_name: 'Elena Rodriguez'
                    },
                    {
                        id: 3,
                        slug: 'full-stack-web-dev',
                        title: 'Full-Stack Web Development',
                        description: 'Build modern, responsive web applications using React, Node.js, and PostgreSQL.',
                        category: 'web',
                        level: 'beginner',
                        duration_hours: 160,
                        thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
                        author_name: 'Marcus Johnson'
                    }
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = [
        { id: 'all', name: 'All Courses' },
        { id: 'cloud', name: 'Cloud Computing' },
        { id: 'data', name: 'Data Science' },
        { id: 'web', name: 'Web Dev' },
        { id: 'ai', name: 'AI & ML' }
    ];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-[var(--color-brand-background)] min-h-screen py-12 px-6 md:px-12 page-enter-active">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-brand-text)] mb-4">Explore Courses</h1>
                    <p className="text-lg text-[var(--color-brand-text-muted)] max-w-2xl">
                        High-quality STEM education designed to take you from beginner to job-ready.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-[var(--color-brand-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)]">
                    <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoryFilter(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    categoryFilter === cat.id
                                        ? 'bg-[var(--color-brand-primary)] text-white'
                                        : 'bg-[var(--color-brand-background)] text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)]'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="w-full md:w-72 relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--color-brand-border)] bg-[var(--color-brand-background)] text-sm focus:outline-none focus:border-[var(--color-brand-primary)]"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-[var(--color-brand-surface)] h-80 rounded-[var(--radius-lg)] border border-[var(--color-brand-border)]"></div>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold mb-2">No courses found</h3>
                        <p className="text-[var(--color-brand-text-muted)]">Try adjusting your filters or search term.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <div 
                                key={course.id} 
                                className="group bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-primary)]/30 transition-all duration-300 flex flex-col cursor-pointer"
                                onClick={() => navigate(`/courses/${course.slug}`)}
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)] z-10">
                                        {course.category}
                                    </div>
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] opacity-80"></div>
                                    )}
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-brand-text-muted)] mb-3">
                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration_hours}h</span>
                                        <span className="capitalize">{course.level}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-display font-bold text-[var(--color-brand-text)] mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-sm text-[var(--color-brand-text-muted)] mb-6 line-clamp-2 flex-1">
                                        {course.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-brand-border)]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-secondary)] text-white flex items-center justify-center text-xs font-bold">
                                                {course.author_name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{course.author_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
