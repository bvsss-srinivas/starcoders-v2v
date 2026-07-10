import React, { useState, useEffect } from 'react';
import AdminVerification from './AdminVerification';
import api from '../../api/axiosConfig';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get('courses/courses/');
            setCourses(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('courses/courses/', newCourse);
            setNewCourse({ title: '', description: '' });
            setIsCreating(false);
            fetchCourses();
        } catch (err) {
            setError("Failed to create course.");
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.delete(`courses/courses/${id}/`);
            fetchCourses();
        } catch (err) {
            setError("Failed to delete course.");
        }
    };

    if (loading) return <div className="p-8 text-center text-[var(--color-brand-text)]">Loading courses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Course Management</h2>
                <Button onClick={() => setIsCreating(!isCreating)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {isCreating ? "Cancel" : "New Course"}
                </Button>
            </div>

            {error && <div className="text-[var(--color-status-error)] bg-[var(--color-status-error)]/10 p-3 rounded-md">{error}</div>}

            {isCreating && (
                <div className="bg-[var(--color-brand-background)] border border-[var(--color-brand-border)] p-6 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-medium text-[var(--color-brand-text)]">Create New Course</h3>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <Input 
                            label="Course Title" 
                            required 
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        />
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[var(--color-brand-text)]">Description</label>
                            <textarea 
                                required
                                className="flex min-h-[100px] w-full rounded-md border border-[var(--color-brand-border)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent"
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                            />
                        </div>
                        <Button type="submit">Save Course</Button>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.length === 0 && !isCreating && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-[var(--color-brand-background)] border border-[var(--color-brand-border)] rounded-xl border-dashed">
                        No courses yet. Click "New Course" to start building your curriculum.
                    </div>
                )}
                {courses.map(course => (
                    <div key={course.id} className="bg-[var(--color-brand-background)] border border-[var(--color-brand-border)] rounded-xl overflow-hidden hover:border-[var(--color-brand-primary)]/50 transition-colors group">
                        <div className="h-32 bg-[var(--color-brand-secondary)]/10 flex items-center justify-center border-b border-[var(--color-brand-border)]">
                            <BookOpen className="h-10 w-10 text-[var(--color-brand-primary)]/40" />
                        </div>
                        <div className="p-5 space-y-3">
                            <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                            <div className="pt-4 flex items-center justify-between border-t border-[var(--color-brand-border)]">
                                <span className="text-xs font-medium bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-primary)] px-2 py-1 rounded-full">
                                    {course.modules?.length || 0} Modules
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10 rounded-lg transition-colors">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-gray-400 hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error)]/10 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('verifications');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-brand-text)]">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage users, verifications, and educational content.</p>
            </div>

            <div className="border-b border-[var(--color-brand-border)]">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('verifications')}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'verifications'
                                ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                                : 'border-transparent text-gray-500 hover:text-[var(--color-brand-text)] hover:border-gray-300'
                        }`}
                    >
                        <ShieldCheck className="h-5 w-5" />
                        Identity Verifications
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'courses'
                                ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                                : 'border-transparent text-gray-500 hover:text-[var(--color-brand-text)] hover:border-gray-300'
                        }`}
                    >
                        <BookOpen className="h-5 w-5" />
                        Course Management
                    </button>
                </nav>
            </div>

            <div className="pt-4">
                {activeTab === 'verifications' ? <AdminVerification /> : <CourseManagement />}
            </div>
        </div>
    );
}
