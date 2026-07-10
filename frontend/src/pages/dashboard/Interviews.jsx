import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Video, Calendar, Clock, CheckCircle, BarChart3, ChevronRight, X, PhoneCall, FileText, Bot, ArrowRight, Activity, TrendingUp, AlertCircle, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // View States: 'default', 'session', 'report'
    const [view, setView] = useState('default');
    const [activeInterview, setActiveInterview] = useState(null);
    
    // Setup Modal
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [setupData, setSetupData] = useState({
        type: 'behavioral',
        role: '',
        difficulty: 'intermediate',
        scheduleForLater: false,
        scheduled_for: ''
    });

    // Session State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerText, setAnswerText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchInterviews = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/interviews/interviews/');
            setInterviews(res.data.results || res.data);
        } catch (error) {
            console.error("Error fetching interviews", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleSetupChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSetupData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleStartSetup = (preset = null) => {
        if (preset) {
            setSetupData({ ...preset, scheduleForLater: false, scheduled_for: '' });
        } else {
            setSetupData({ type: 'behavioral', role: '', difficulty: 'intermediate', scheduleForLater: false, scheduled_for: '' });
        }
        setIsSetupModalOpen(true);
    };

    const submitSetup = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type: setupData.type,
                role: setupData.role,
                difficulty: setupData.difficulty,
            };
            if (setupData.scheduleForLater && setupData.scheduled_for) {
                payload.scheduled_for = new Date(setupData.scheduled_for).toISOString();
            }

            const res = await api.post('/interviews/interviews/', payload);
            setIsSetupModalOpen(false);
            
            if (!setupData.scheduleForLater) {
                setActiveInterview(res.data);
                setCurrentQuestionIndex(0);
                setAnswerText('');
                setView('session');
            } else {
                fetchInterviews();
            }
        } catch (error) {
            alert("Failed to setup interview.");
        }
    };

    const startScheduled = async (interview) => {
        try {
            const res = await api.post(`/interviews/interviews/${interview.id}/start_scheduled/`);
            setActiveInterview(res.data);
            setCurrentQuestionIndex(0);
            setAnswerText('');
            setView('session');
        } catch (error) {
            alert("Failed to start scheduled interview.");
        }
    };

    const submitAnswer = async () => {
        if (!answerText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        
        const currentQ = activeInterview.questions_and_answers[currentQuestionIndex];
        
        try {
            await api.post(`/interviews/interviews/${activeInterview.id}/submit_answer/`, {
                question_id: currentQ.id,
                answer: answerText
            });
            
            // Local state update to reflect answer
            const updatedQs = [...activeInterview.questions_and_answers];
            updatedQs[currentQuestionIndex] = { ...currentQ, answer: answerText, completed: true };
            setActiveInterview({ ...activeInterview, questions_and_answers: updatedQs });
            
            if (currentQuestionIndex < activeInterview.questions_and_answers.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setAnswerText('');
            } else {
                // Finish interview
                setIsAnalyzing(true);
                const res = await api.post(`/interviews/interviews/${activeInterview.id}/complete/`);
                setActiveInterview(res.data);
                setView('report');
                fetchInterviews(); // Refresh background list
            }
        } catch (error) {
            alert("Failed to submit answer.");
        } finally {
            setIsSubmitting(false);
            setIsAnalyzing(false);
        }
    };

    const renderDefaultView = () => {
        const upcoming = interviews.filter(i => i.status === 'scheduled');
        const completed = interviews.filter(i => i.status === 'completed');
        
        // Prepare chart data (reverse to show chronological order)
        const chartData = [...completed].reverse().map((i, idx) => ({
            name: `Int ${idx + 1}`,
            score: i.score
        }));

        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
                            <Video className="w-8 h-8 text-[var(--color-brand-primary)]" />
                            Mock Interviews
                        </h1>
                        <p className="text-[var(--color-brand-text-muted)] mt-1">Practice with AI, get structured feedback, and track your progress.</p>
                    </div>
                    <Button variant="primary" className="shrink-0 gap-2" onClick={() => handleStartSetup()}>
                        <Video className="h-4 w-4" /> Schedule Interview
                    </Button>
                </div>

                {/* Progress Chart */}
                {completed.length >= 2 && (
                    <div className="bg-white rounded-xl border border-[var(--color-brand-border)] p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-[var(--color-brand-primary)]" />
                            <h2 className="text-lg font-bold">Progress Over Time</h2>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} width={30} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="score" stroke="var(--color-brand-primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--color-brand-primary)', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Upcoming */}
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-brand-text)] mb-4">Upcoming Sessions</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcoming.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No upcoming interviews.</p>
                        ) : upcoming.map(i => (
                            <div key={i.id} className="bg-white rounded-xl border border-[var(--color-brand-border)] p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-indigo-50 text-[var(--color-brand-primary)] rounded-xl flex items-center justify-center shrink-0 mt-1">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{i.role}</h3>
                                        <p className="text-sm font-medium text-[var(--color-brand-primary)] capitalize mb-1">{i.type} • {i.difficulty}</p>
                                        <p className="text-xs text-gray-500">Scheduled: {new Date(i.scheduled_for).toLocaleString()}</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => startScheduled(i)}>Join Session</Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Past Results */}
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-brand-text)] mb-4">Past Results</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {completed.length === 0 ? (
                            <div className="lg:col-span-2 text-center py-12 bg-white rounded-xl border border-[var(--color-brand-border)] border-dashed">
                                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No past interviews yet. Complete your first session to see results!</p>
                            </div>
                        ) : completed.map(i => {
                            const badgeColor = i.score >= 80 ? 'bg-green-100 text-green-700 border-green-200' : 
                                               i.score >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                               'bg-red-100 text-red-700 border-red-200';
                            return (
                                <div key={i.id} className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden cursor-pointer group" onClick={() => { setActiveInterview(i); setView('report'); }}>
                                    <div className="p-5 flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-[var(--color-brand-primary)] transition-colors">{i.role}</h3>
                                                <p className="text-xs text-gray-500 capitalize">{i.type} • {i.difficulty}</p>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                                                Score: {i.score}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-4">Completed: {new Date(i.completed_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-between items-center">
                                        <span className="text-xs font-semibold text-[var(--color-brand-primary)]">View full report</span>
                                        <ChevronRight className="h-4 w-4 text-[var(--color-brand-primary)] transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderSessionView = () => {
        if (!activeInterview) return null;
        
        if (isAnalyzing) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
                    <div className="w-16 h-16 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your responses...</h2>
                    <p className="text-gray-500">The AI coach is reviewing your answers and generating your feedback report.</p>
                </div>
            );
        }

        const currentQ = activeInterview.questions_and_answers[currentQuestionIndex];
        const progressPct = ((currentQuestionIndex) / activeInterview.questions_and_answers.length) * 100;

        return (
            <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
                <button onClick={() => setView('default')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 font-medium">
                    <X className="w-4 h-4" /> Exit Session
                </button>
                
                <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-brand-border)] overflow-hidden">
                    {/* Header Progress */}
                    <div className="h-1.5 w-full bg-gray-100">
                        <div className="h-full bg-[var(--color-brand-primary)] transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                    </div>
                    
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <span className="px-3 py-1 bg-indigo-50 text-[var(--color-brand-primary)] rounded-full text-xs font-bold uppercase tracking-wider">
                                Question {currentQuestionIndex + 1} of {activeInterview.questions_and_answers.length}
                            </span>
                        </div>
                        
                        <div className="flex gap-4 mb-8">
                            <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                    {currentQ?.question}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Your Response
                            </label>
                            <textarea 
                                autoFocus
                                rows="6"
                                placeholder="Type your answer here..."
                                value={answerText}
                                onChange={e => setAnswerText(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none resize-none bg-gray-50 text-sm sm:text-base leading-relaxed"
                            />
                            
                            <div className="flex justify-end pt-2">
                                <Button 
                                    onClick={submitAnswer} 
                                    disabled={!answerText.trim() || isSubmitting}
                                    className="px-8 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        currentQuestionIndex === activeInterview.questions_and_answers.length - 1 ? 'Finish Interview' : 'Next Question'
                                    )}
                                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderReportView = () => {
        if (!activeInterview || !activeInterview.feedback) return null;
        const f = activeInterview.feedback;
        const colorClass = activeInterview.score >= 80 ? 'text-green-600' : activeInterview.score >= 60 ? 'text-amber-500' : 'text-red-500';

        return (
            <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
                <button onClick={() => setView('default')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 font-medium">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Dashboard
                </button>
                
                <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-brand-border)] overflow-hidden mb-6">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 border-b border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Feedback Report</h1>
                            <p className="text-gray-500">{activeInterview.role} ({activeInterview.difficulty})</p>
                            <p className="text-xs text-gray-400 mt-2">Completed on {new Date(activeInterview.completed_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Overall Score</span>
                                <div className={`text-5xl font-black ${colorClass}`}>
                                    {activeInterview.score}
                                </div>
                            </div>
                            <Button 
                                onClick={() => {
                                    handleStartSetup({
                                        type: activeInterview.type,
                                        role: activeInterview.role,
                                        difficulty: activeInterview.difficulty
                                    });
                                }}
                                className="ml-4 gap-2 shadow-sm"
                            >
                                <RotateCcw className="w-4 h-4" /> Practice Again
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Categories */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> Category Breakdown
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(f.categories || {}).map(([cat, score]) => (
                                    <div key={cat}>
                                        <div className="flex justify-between text-sm font-semibold mb-1">
                                            <span className="text-gray-700">{cat}</span>
                                            <span className="text-gray-900">{score}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[var(--color-brand-primary)]" style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Key Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {f.strengths?.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-700 bg-green-50/50 p-2.5 rounded-lg border border-green-100">
                                            <span className="text-green-500 font-bold">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {f.improvements?.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                                            <span className="text-amber-500 font-bold">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {f.action && (
                        <div className="mx-6 md:mx-8 mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <p className="text-sm font-bold text-indigo-900 mb-1">Next Step Recommended by AI:</p>
                            <p className="text-sm text-indigo-700">{f.action}</p>
                        </div>
                    )}
                </div>

                {/* Review Answers */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-8">Your Responses</h3>
                <div className="space-y-4">
                    {activeInterview.questions_and_answers?.map((q, idx) => (
                        <div key={q.id} className="bg-white p-5 rounded-xl border border-[var(--color-brand-border)] shadow-sm">
                            <p className="font-bold text-gray-900 mb-3"><span className="text-[var(--color-brand-primary)]">Q{idx + 1}:</span> {q.question}</p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
                                {q.answer || <span className="italic text-gray-400">Skipped/No answer</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] page-enter-active">
            {view === 'default' && renderDefaultView()}
            {view === 'session' && renderSessionView()}
            {view === 'report' && renderReportView()}

            {/* Setup Modal */}
            {isSetupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Setup Mock Interview</h3>
                            <button onClick={() => setIsSetupModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-md shadow-sm"><X className="h-4 w-4"/></button>
                        </div>
                        <form onSubmit={submitSetup} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Interview Type</label>
                                <select name="type" value={setupData.type} onChange={handleSetupChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm font-medium text-gray-700">
                                    <option value="behavioral">Behavioral (Leadership & Culture)</option>
                                    <option value="technical">Technical (Concepts & Architecture)</option>
                                    <option value="case_study">Case Study (Strategy & Product)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Target Role</label>
                                <input required type="text" name="role" value={setupData.role} onChange={handleSetupChange} placeholder="e.g. Senior Frontend Engineer" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Difficulty</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['beginner', 'intermediate', 'advanced'].map(level => (
                                        <button 
                                            key={level} type="button" 
                                            onClick={() => setSetupData(prev => ({...prev, difficulty: level}))}
                                            className={`py-2 text-xs font-bold rounded-lg border capitalize transition-colors ${setupData.difficulty === level ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer mb-3">
                                    <input type="checkbox" name="scheduleForLater" checked={setupData.scheduleForLater} onChange={handleSetupChange} className="rounded text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)] w-4 h-4" />
                                    Schedule for later
                                </label>
                                {setupData.scheduleForLater && (
                                    <input required type="datetime-local" name="scheduled_for" value={setupData.scheduled_for} onChange={handleSetupChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm animate-fade-in" />
                                )}
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-gray-100">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsSetupModalOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" className="flex-1">
                                    {setupData.scheduleForLater ? 'Confirm Booking' : 'Start Now'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
