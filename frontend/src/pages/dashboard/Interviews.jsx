import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Video, Calendar, Clock, CheckCircle, BarChart3, ChevronRight, X, PhoneCall, FileText } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [activeJoinSession, setActiveJoinSession] = useState(null);
    const [activeReport, setActiveReport] = useState(null);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        date: '',
        time: ''
    });

    const fetchInterviews = async () => {
        try {
            const res = await api.get('interviews/');
            setInterviews(res.data);
        } catch (error) {
            console.error("Error fetching interviews", error);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await api.post('interviews/', formData);
            setIsScheduleModalOpen(false);
            setFormData({ role: '', company: '', date: '', time: '' });
            fetchInterviews();
        } catch (error) {
            console.error("Error scheduling interview", error);
            alert("Failed to schedule interview.");
        }
    };

    const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming');
    const pastInterviews = interviews.filter(i => i.status === 'Completed' || i.status !== 'Upcoming');

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">Mock Interviews</h1>
                        <p className="text-[var(--color-brand-text-muted)] mt-1">Practice with AI, get detailed feedback, and track your progress.</p>
                    </div>
                    <Button variant="primary" className="shrink-0 gap-2" onClick={() => setIsScheduleModalOpen(true)}>
                        <Video className="h-4 w-4" />
                        Schedule Mock Interview
                    </Button>
                </div>

                {/* Schedule Modal */}
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                            <div className="flex justify-between items-center p-4 border-b border-[var(--color-brand-border)]">
                                <h3 className="font-bold text-lg">Schedule Interview</h3>
                                <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5"/></button>
                            </div>
                            <form onSubmit={handleSchedule} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Target Role</label>
                                    <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] rounded-md outline-none" placeholder="e.g. Senior Product Manager" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Target Company</label>
                                    <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] rounded-md outline-none" placeholder="e.g. Google" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] rounded-md outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Time</label>
                                        <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)] rounded-md outline-none" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4">Confirm Booking</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Join Session Modal */}
                {activeJoinSession && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col items-center p-8 text-center" style={{ animationDelay: '0ms' }}>
                            <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 relative">
                                <Video className="h-10 w-10" />
                                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Connecting to AI Interviewer...</h2>
                            <p className="text-gray-500 mb-8">Preparing your session for {activeJoinSession.role} at {activeJoinSession.company}</p>
                            
                            <div className="flex gap-4 w-full">
                                <Button variant="secondary" className="flex-1" onClick={() => setActiveJoinSession(null)}>Cancel</Button>
                                <Button variant="primary" className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                                    <PhoneCall className="h-4 w-4" /> Join Audio
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Report Modal */}
                {activeReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" style={{ animationDelay: '0ms' }}>
                            <div className="flex justify-between items-center p-6 border-b border-[var(--color-brand-border)] bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-[var(--color-brand-primary)]" />
                                    <h3 className="font-bold text-xl">Feedback Report</h3>
                                </div>
                                <button onClick={() => setActiveReport(null)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm"><X className="h-5 w-5"/></button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-8">
                                <div>
                                    <h4 className="text-lg font-bold mb-1">{activeReport.role}</h4>
                                    <p className="text-sm text-gray-500">{activeReport.company} • {activeReport.date}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Overall Score</span>
                                        <span className="text-4xl font-black text-blue-700">{activeReport.score || '-'}</span>
                                        <span className="text-xs text-blue-500 mt-1">/100</span>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 font-bold text-green-700 mb-2">
                                                <CheckCircle className="h-4 w-4" /> Key Strengths
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {activeReport.strengths.length > 0 ? (
                                                    activeReport.strengths.map((s, i) => <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{s}</span>)
                                                ) : <span className="text-sm text-gray-500">Not recorded</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 font-bold text-orange-700 mb-2">
                                                <BarChart3 className="h-4 w-4" /> Area for Improvement
                                            </div>
                                            <p className="text-sm text-gray-700 bg-orange-50 border border-orange-100 p-3 rounded-lg">
                                                {activeReport.improvement || 'Not recorded'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold mb-3 border-b pb-2">Detailed AI Assessment</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        This is a simulated detailed report. In a fully connected version, the AI would provide a paragraph-by-paragraph breakdown of your behavioral responses, technical accuracy, and communication style during the interview session.
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-[var(--color-brand-border)] bg-gray-50 flex justify-end">
                                <Button variant="secondary" onClick={() => setActiveReport(null)}>Close Report</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upcoming */}
                <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                    <h2 className="text-xl font-bold text-[var(--color-brand-text)] mb-4">Upcoming Sessions</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcomingInterviews.length === 0 && (
                            <p className="text-gray-500 text-sm">No upcoming interviews. Schedule one!</p>
                        )}
                        {upcomingInterviews.map((interview) => (
                            <div key={interview.id} className="bg-white rounded-xl border border-[var(--color-brand-border)] p-6 shadow-[var(--shadow-sm)] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{interview.role}</h3>
                                        <p className="text-sm font-medium text-[var(--color-brand-primary)] mb-2">{interview.company}</p>
                                        <div className="flex items-center gap-4 text-sm text-[var(--color-brand-text-muted)]">
                                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {interview.date}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {interview.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" className="w-full sm:w-auto hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors" onClick={() => setActiveJoinSession(interview)}>Join Session</Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Past Results */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-xl font-bold text-[var(--color-brand-text)] mb-4">Past Results</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pastInterviews.length === 0 && (
                            <p className="text-gray-500 text-sm">No past interviews yet.</p>
                        )}
                        {pastInterviews.map((interview) => (
                            <div key={interview.id} className="bg-white rounded-xl border border-[var(--color-brand-border)] p-0 shadow-[var(--shadow-sm)] hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                                <div className="p-6 pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">{interview.role}</h3>
                                            <p className="text-sm text-[var(--color-brand-text-muted)]">{interview.company} • {interview.date}</p>
                                        </div>
                                        <div className={`flex flex-col items-center justify-center h-12 w-12 rounded-full border-4 ${interview.score >= 80 ? 'border-green-100 bg-green-50 text-green-700' : 'border-blue-100 bg-blue-50 text-blue-700'}`}>
                                            <span className="font-bold text-sm">{interview.score || '-'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
                                                <CheckCircle className="h-3.5 w-3.5" /> Strengths
                                            </div>
                                            <ul className="text-sm text-[var(--color-brand-text)] space-y-1">
                                                {interview.strengths.length > 0 ? interview.strengths.map((s, i) => <li key={i}>• {s}</li>) : <li>• N/A</li>}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">
                                                <BarChart3 className="h-3.5 w-3.5" /> Focus Area
                                            </div>
                                            <p className="text-sm text-[var(--color-brand-text)]">{interview.improvement || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={() => setActiveReport(interview)} className="mt-auto border-t border-[var(--color-brand-border)] bg-gray-50 px-6 py-3 flex justify-between items-center group cursor-pointer hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-[var(--color-brand-primary)]">View full feedback report</span>
                                    <ChevronRight className="h-4 w-4 text-[var(--color-brand-primary)] transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
