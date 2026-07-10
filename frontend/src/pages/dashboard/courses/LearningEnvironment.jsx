import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, CheckCircle, PlayCircle, FileText, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function LearningEnvironment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Mock data
    const course = { title: "Cloud Computing Fundamentals" };
    const modules = [
        {
            id: 1, title: 'Introduction to Cloud Computing', 
            lessons: [
                { id: 101, title: 'What is Cloud Computing?', type: 'video', completed: true, duration: '10:00' },
                { id: 102, title: 'Cloud Deployment Models', type: 'video', completed: true, duration: '15:30' },
                { id: 103, title: 'Reading: History of Cloud', type: 'text', completed: true, duration: '5 min read' }
            ]
        },
        {
            id: 2, title: 'Compute Services', 
            lessons: [
                { id: 201, title: 'Virtual Machines vs Containers', type: 'video', completed: true, duration: '12:45' },
                { id: 202, title: 'Serverless Computing Basics', type: 'video', completed: false, duration: '18:20', current: true },
                { id: 203, title: 'Compute Knowledge Check', type: 'quiz', completed: false, duration: '10 questions' }
            ]
        }
    ];

    const [currentLesson, setCurrentLesson] = useState(modules[1].lessons[1]); // Serverless basics

    return (
        <div className="h-screen flex flex-col bg-[var(--color-brand-background)] overflow-hidden">
            {/* Navbar */}
            <div className="h-16 bg-[#0B0B0C] text-white flex items-center px-4 justify-between shrink-0 z-20 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard/courses')} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-300 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="h-6 w-px bg-white/20 mx-2"></div>
                    <h1 className="font-display font-semibold hidden md:block text-lg">{course.title}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                        Leave Feedback
                    </Button>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="p-2 hover:bg-white/10 rounded-md transition-colors lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto bg-white">
                    {/* Video Player Area */}
                    <div className="w-full bg-black aspect-video relative flex items-center justify-center">
                        {/* Mock Player */}
                        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6 text-center">
                            <PlayCircle className="h-20 w-20 text-[var(--color-brand-secondary)] mb-4 opacity-80" />
                            <h2 className="text-2xl font-semibold mb-2">{currentLesson.title}</h2>
                            <p className="text-gray-400">Video player placeholder</p>
                        </div>
                    </div>
                    
                    {/* Lesson Content Area */}
                    <div className="max-w-4xl w-full mx-auto p-8 flex-1">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-display font-bold text-[var(--color-brand-text)]">{currentLesson.title}</h2>
                            <Button variant="outline" className="border-[var(--color-status-success)] text-[var(--color-status-success)] hover:bg-[var(--color-status-success)]/10">
                                <Check className="h-4 w-4 mr-2" /> Mark Complete
                            </Button>
                        </div>
                        
                        <div className="prose max-w-none text-[var(--color-brand-text-muted)]">
                            <p>In this lesson, we will explore the fundamentals of {currentLesson.title.toLowerCase()}. This is a placeholder for transcript, lecture notes, or text content.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <div className="bg-[var(--color-brand-primary)]/5 p-4 rounded-[var(--radius-md)] border border-[var(--color-brand-primary)]/20 my-6">
                                <h4 className="text-[var(--color-brand-primary)] font-semibold mt-0">Key Takeaway</h4>
                                <p className="mb-0">Serverless computing allows you to build and run applications and services without thinking about servers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Curriculum */}
                <div className={`w-80 bg-[var(--color-brand-surface)] border-l border-[var(--color-brand-border)] shrink-0 flex flex-col transition-all duration-300 absolute lg:relative h-full right-0 z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.05)] lg:shadow-none ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="p-4 border-b border-[var(--color-brand-border)] bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-[var(--color-brand-text)]">Course Content</h3>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:text-black">
                            <ArrowLeft className="h-5 w-5 rotate-180" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {modules.map((module, mIdx) => (
                            <div key={module.id} className="border-b border-[var(--color-brand-border)]">
                                <div className="p-4 bg-gray-50/50">
                                    <h4 className="font-semibold text-sm text-[var(--color-brand-text)]">Section {mIdx + 1}: {module.title}</h4>
                                    <p className="text-xs text-[var(--color-brand-text-muted)] mt-1">{module.lessons.filter(l => l.completed).length} / {module.lessons.length} | 45min</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {module.lessons.map((lesson) => (
                                        <div 
                                            key={lesson.id} 
                                            onClick={() => setCurrentLesson(lesson)}
                                            className={`p-4 flex gap-3 cursor-pointer transition-colors ${lesson.current ? 'bg-[var(--color-brand-primary)]/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="shrink-0 mt-0.5">
                                                {lesson.completed ? (
                                                    <CheckCircle className="h-5 w-5 text-[var(--color-status-success)]" />
                                                ) : lesson.type === 'video' ? (
                                                    <PlayCircle className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className={`text-sm ${lesson.current ? 'font-medium text-[var(--color-brand-text)]' : 'text-gray-600'}`}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    {lesson.type === 'video' && <PlayCircle className="h-3 w-3" />}
                                                    {lesson.type === 'text' && <FileText className="h-3 w-3" />}
                                                    <span>{lesson.duration}</span>
                                                </div>
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
    );
}
