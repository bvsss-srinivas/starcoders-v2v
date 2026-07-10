import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { UploadCloud, FileText, MoreVertical, Clock, Star, Edit2, Trash2, RefreshCw, Eye, Columns, X, CheckCircle, Target, ArrowRight } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function Resumes() {
    const [resumes, setResumes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    const [targetRole, setTargetRole] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    
    // Modals
    const [previewResume, setPreviewResume] = useState(null);
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState([]);
    
    // Rename
    const [renameData, setRenameData] = useState(null); // { id, filename }
    
    // Rescore
    const [rescoreData, setRescoreData] = useState(null); // { id, target_role }
    const [isRescoring, setIsRescoring] = useState(false);

    // Expandable Card
    const [expandedCardId, setExpandedCardId] = useState(null);

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resumes/');
            setResumes(res.data.results || res.data);
        } catch (error) {
            console.error("Error fetching resumes", error);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Close dropdown menu if clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!targetRole.trim()) {
                const role = prompt("What is the target role for this resume? (e.g. Senior Product Manager)");
                if (role) {
                    setTargetRole(role);
                    uploadFile(file, role);
                } else {
                    fileInputRef.current.value = '';
                }
            } else {
                uploadFile(file, targetRole);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (!targetRole.trim()) {
                const role = prompt("What is the target role for this resume?");
                if (role) {
                    setTargetRole(role);
                    uploadFile(file, role);
                }
            } else {
                uploadFile(file, targetRole);
            }
        }
    };

    const uploadFile = async (file, role) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('target_role', role);
        
        setIsUploading(true);
        try {
            await api.post('/resumes/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchResumes();
            setTargetRole('');
        } catch (error) {
            alert("Failed to upload resume.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const deleteResume = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resume?")) return;
        try {
            await api.delete(`/resumes/${id}/`);
            fetchResumes();
            if (previewResume?.id === id) setPreviewResume(null);
            setCompareSelection(prev => prev.filter(rId => rId !== id));
        } catch (error) {
            alert("Failed to delete.");
        }
    };

    const setPrimary = async (id) => {
        try {
            await api.post(`/resumes/${id}/set_primary/`);
            fetchResumes();
        } catch (error) {
            alert("Failed to set primary.");
        }
    };

    const handleRename = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/resumes/${renameData.id}/`, { filename: renameData.filename });
            setRenameData(null);
            fetchResumes();
        } catch (error) {
            alert("Failed to rename.");
        }
    };

    const handleRescore = async (e) => {
        e.preventDefault();
        setIsRescoring(true);
        try {
            await api.post(`/resumes/${rescoreData.id}/rescore/`, { target_role: rescoreData.target_role });
            setRescoreData(null);
            fetchResumes();
        } catch (error) {
            alert("Failed to rescore.");
        } finally {
            setIsRescoring(false);
        }
    };

    const toggleCompareSelection = (id) => {
        setCompareSelection(prev => {
            if (prev.includes(id)) return prev.filter(rId => rId !== id);
            if (prev.length >= 2) return [prev[1], id];
            return [...prev, id];
        });
    };

    const renderProgressBar = (label, value) => (
        <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-700">{label}</span>
                <span className="text-gray-900">{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-brand-primary)]" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
                            <FileText className="w-8 h-8 text-[var(--color-brand-primary)]" />
                            My Resumes
                        </h1>
                        <p className="text-[var(--color-brand-text-muted)] mt-1">AI-powered scoring, tailored feedback, and version management.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {resumes.length >= 2 && (
                            <Button 
                                variant="secondary" 
                                className={`gap-2 ${isCompareMode ? 'bg-indigo-50 border-indigo-200 text-[var(--color-brand-primary)]' : ''}`}
                                onClick={() => { setIsCompareMode(!isCompareMode); setCompareSelection([]); }}
                            >
                                <Columns className="h-4 w-4" />
                                {isCompareMode ? 'Cancel Compare' : 'Compare'}
                            </Button>
                        )}
                        <Button 
                            variant="primary" 
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <UploadCloud className="h-4 w-4" />
                            Upload Resume
                        </Button>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept=".pdf,.docx,.doc"
                />

                {/* Upload Zone */}
                <div 
                    className={`w-full border-2 border-dashed border-[var(--color-brand-border)] bg-white rounded-xl p-8 lg:p-12 flex flex-col items-center justify-center text-center transition-colors animate-fade-in-up ${isUploading ? 'opacity-50' : 'hover:bg-gray-50'}`} 
                    style={{ animationDelay: '50ms' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {isUploading ? (
                        <>
                            <div className="h-16 w-16 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin mb-4"></div>
                            <h3 className="text-lg font-bold text-[var(--color-brand-text)] mb-1">Analyzing resume...</h3>
                            <p className="text-[var(--color-brand-text-muted)] text-sm">Our AI is extracting text and evaluating ATS compatibility.</p>
                        </>
                    ) : (
                        <>
                            <div className="h-16 w-16 bg-[var(--color-brand-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                                <UploadCloud className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--color-brand-text)] mb-2">
                                Upload or drag your resume here
                            </h3>
                            <div className="w-full max-w-sm mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Optional: Enter Target Role before uploading" 
                                    value={targetRole}
                                    onChange={e => setTargetRole(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-center bg-white"
                                />
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
                            <p className="text-[var(--color-brand-text-muted)] mt-4 text-xs font-medium">Supported formats: PDF, DOCX (Max 5MB)</p>
                        </>
                    )}
                </div>

                {/* Compare Mode Banner */}
                {isCompareMode && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-3">
                            <Columns className="w-5 h-5 text-[var(--color-brand-primary)]" />
                            <p className="text-sm font-semibold text-indigo-900">
                                Select 2 resumes below to compare them side-by-side. ({compareSelection.length}/2 selected)
                            </p>
                        </div>
                        {compareSelection.length === 2 && (
                            <Button size="sm" onClick={() => setPreviewResume('compare')}>View Comparison</Button>
                        )}
                    </div>
                )}

                {/* Resumes Grid */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.length === 0 && !isUploading && (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 text-sm">
                                No resumes uploaded yet. Upload one to get started!
                            </div>
                        )}
                        {resumes.map((resume) => {
                            const isSelectedForCompare = compareSelection.includes(resume.id);
                            
                            return (
                                <div 
                                    key={resume.id} 
                                    className={`bg-white rounded-xl border p-5 shadow-[var(--shadow-sm)] flex flex-col h-full transition-all relative ${
                                        isCompareMode 
                                            ? isSelectedForCompare ? 'border-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-primary)]/20 cursor-pointer' : 'border-[var(--color-brand-border)] hover:border-gray-300 cursor-pointer'
                                            : 'border-[var(--color-brand-border)] hover:shadow-md'
                                    }`}
                                    onClick={() => isCompareMode ? toggleCompareSelection(resume.id) : setPreviewResume(resume)}
                                >
                                    {/* Primary Badge */}
                                    {resume.is_primary && (
                                        <div className="absolute -top-3 -right-3 bg-amber-400 text-white p-1.5 rounded-full shadow-sm" title="Primary Resume">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-[var(--color-brand-primary)] shrink-0">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        
                                        {!isCompareMode && (
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === resume.id ? null : resume.id); }}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors hover:bg-gray-100"
                                                >
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                                {activeMenuId === resume.id && (
                                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-10 animate-fade-in" onClick={e => e.stopPropagation()}>
                                                        <button onClick={() => { setActiveMenuId(null); setPreviewResume(resume); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Eye className="w-4 h-4" /> Preview
                                                        </button>
                                                        <button onClick={() => { setActiveMenuId(null); setRenameData(resume); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Edit2 className="w-4 h-4" /> Rename
                                                        </button>
                                                        <button onClick={() => { setActiveMenuId(null); setRescoreData(resume); }} className="w-full text-left px-4 py-2 text-sm text-[var(--color-brand-primary)] hover:bg-indigo-50 flex items-center gap-2">
                                                            <RefreshCw className="w-4 h-4" /> Re-score
                                                        </button>
                                                        {!resume.is_primary && (
                                                            <button onClick={() => { setActiveMenuId(null); setPrimary(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                                                                <Star className="w-4 h-4" /> Set Primary
                                                            </button>
                                                        )}
                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                        <button onClick={() => { setActiveMenuId(null); deleteResume(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="font-bold text-sm text-gray-900 truncate mb-1" title={resume.filename}>{resume.filename}</h3>
                                    {resume.target_role && (
                                        <p className="text-xs font-semibold text-[var(--color-brand-primary)] mb-2 flex items-center gap-1.5 truncate">
                                            <Target className="w-3.5 h-3.5" /> {resume.target_role}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
                                        <Clock className="h-3.5 w-3.5" /> Updated {new Date(resume.uploaded_at).toLocaleDateString()}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Score</span>
                                            <div className="flex items-center gap-1 font-bold text-xl text-gray-900">
                                                {resume.score}
                                                <span className="text-xs text-gray-400 font-medium">/100</span>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            resume.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {resume.status}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setExpandedCardId(expandedCardId === resume.id ? null : resume.id); }}
                                        className="w-full mt-4 py-2 border-t border-gray-100 text-xs font-semibold text-[var(--color-brand-primary)] hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors"
                                    >
                                        {expandedCardId === resume.id ? 'Hide Details' : 'View Breakdown & Feedback'}
                                    </button>

                                    {expandedCardId === resume.id && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in text-left">
                                            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Sub-Scores</h4>
                                            <div className="space-y-1 mb-5">
                                                {Object.entries(resume.sub_scores || {}).map(([key, val]) => (
                                                    <div key={key}>
                                                        <div className="flex justify-between text-[10px] font-semibold mb-1">
                                                            <span className="text-gray-600">{key}</span>
                                                            <span className="text-gray-900">{val}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                                            <div className="h-full bg-[var(--color-brand-primary)]" style={{ width: `${val}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Actionable AI Feedback
                                            </h4>
                                            <ul className="space-y-2">
                                                {resume.suggestions?.map((s, idx) => (
                                                    <li key={idx} className="flex gap-2 text-[11px] text-gray-700 leading-relaxed bg-gray-50 p-2 rounded-md border border-gray-100">
                                                        <ArrowRight className="w-3 h-3 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Rename Modal */}
            {renameData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold">Rename Resume</h3>
                            <button onClick={() => setRenameData(null)}><X className="w-4 h-4 text-gray-400"/></button>
                        </div>
                        <form onSubmit={handleRename} className="p-5 space-y-4">
                            <input 
                                autoFocus
                                required 
                                type="text" 
                                value={renameData.filename} 
                                onChange={e => setRenameData({...renameData, filename: e.target.value})} 
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setRenameData(null)}>Cancel</Button>
                                <Button type="submit" size="sm">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rescore Modal */}
            {rescoreData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4 text-[var(--color-brand-primary)]"/> Re-score Resume</h3>
                            <button onClick={() => setRescoreData(null)} disabled={isRescoring}><X className="w-4 h-4 text-gray-400"/></button>
                        </div>
                        {isRescoring ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center">
                                <div className="h-10 w-10 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin mb-3"></div>
                                <p className="font-bold text-gray-900">Re-evaluating resume...</p>
                                <p className="text-xs text-gray-500 mt-1">Simulating AI assessment against new target role.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRescore} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Target Role</label>
                                    <input 
                                        autoFocus
                                        required 
                                        type="text" 
                                        placeholder="e.g. Lead Data Scientist"
                                        value={rescoreData.target_role || ''} 
                                        onChange={e => setRescoreData({...rescoreData, target_role: e.target.value})} 
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <Button type="button" variant="secondary" size="sm" onClick={() => setRescoreData(null)}>Cancel</Button>
                                    <Button type="submit" size="sm">Start Analysis</Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Inline Preview / Details Modal */}
            {previewResume && previewResume !== 'compare' && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewResume(null)}>
                    <div className="w-full max-w-2xl bg-white h-full overflow-y-auto animate-slide-in-right shadow-2xl" onClick={e => e.stopPropagation()}>
                        
                        <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{previewResume.filename}</h2>
                                {previewResume.target_role && (
                                    <p className="text-sm font-semibold text-[var(--color-brand-primary)] mt-1 flex items-center gap-1.5">
                                        <Target className="w-4 h-4" /> Targeted for: {previewResume.target_role}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {previewResume.is_primary && <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full"><Star className="w-3.5 h-3.5 fill-current" /> Primary</span>}
                                <button onClick={() => setPreviewResume(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><X className="w-5 h-5"/></button>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-10">
                            {/* Score Overview */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="text-center shrink-0">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Overall Score</span>
                                    <div className={`text-6xl font-black ${previewResume.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                                        {previewResume.score}
                                    </div>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${previewResume.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {previewResume.status}
                                    </span>
                                </div>
                                <div className="flex-1 w-full">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Sub-Score Breakdown</h4>
                                    {Object.entries(previewResume.sub_scores || {}).map(([key, val]) => (
                                        <div key={key}>{renderProgressBar(key, val)}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Actionable Suggestions */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" /> AI Suggestions
                                </h3>
                                <ul className="space-y-3">
                                    {previewResume.suggestions?.map((s, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                            <ArrowRight className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Document Preview Placeholder */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Document Details</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                    <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                    <p className="font-semibold text-gray-700">{previewResume.filename}</p>
                                    <p className="text-sm text-gray-500 mt-1">File parsing and text extraction was successful.</p>
                                    <a href={previewResume.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-bold text-[var(--color-brand-primary)] hover:underline">Download Original File</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Compare Mode Modal */}
            {previewResume === 'compare' && (
                <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 sm:p-8" onClick={() => setPreviewResume(null)}>
                    <div className="w-full max-w-6xl bg-gray-50 h-full rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        
                        <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10 shrink-0">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Columns className="w-5 h-5 text-[var(--color-brand-primary)]"/> Compare Resumes</h2>
                            <button onClick={() => setPreviewResume(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><X className="w-4 h-4"/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                {compareSelection.map(id => {
                                    const r = resumes.find(x => x.id === id);
                                    if (!r) return null;
                                    return (
                                        <div key={id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                            <h3 className="font-bold text-lg text-gray-900 truncate mb-1" title={r.filename}>{r.filename}</h3>
                                            <p className="text-sm font-semibold text-[var(--color-brand-primary)] mb-6 flex items-center gap-1.5"><Target className="w-4 h-4" /> Targeted for: {r.target_role || 'General'}</p>
                                            
                                            <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className={`text-4xl font-black ${r.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>{r.score}</div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overall</div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${r.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{r.status}</span>
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Sub-Score Breakdown</h4>
                                            <div className="mb-8">
                                                {Object.entries(r.sub_scores || {}).map(([key, val]) => (
                                                    <div key={key}>{renderProgressBar(key, val)}</div>
                                                ))}
                                            </div>

                                            <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Suggestions</h4>
                                            <ul className="space-y-2">
                                                {r.suggestions?.map((s, idx) => (
                                                    <li key={idx} className="flex gap-2 text-xs text-gray-600">
                                                        <span className="text-[var(--color-brand-primary)]">•</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
