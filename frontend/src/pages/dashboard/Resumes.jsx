import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { UploadCloud, FileText, MoreVertical, Clock } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function Resumes() {
    const [resumes, setResumes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchResumes = async () => {
        try {
            const res = await api.get('resumes/');
            setResumes(res.data);
        } catch (error) {
            console.error("Error fetching resumes", error);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        
        setIsUploading(true);
        try {
            await api.post('resumes/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchResumes(); // Refresh the list
        } catch (error) {
            console.error("Error uploading file", error);
            alert("Failed to upload resume.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">My Resumes</h1>
                        <p className="text-[var(--color-brand-text-muted)] mt-1">Manage and optimize your resumes for specific roles.</p>
                    </div>
                    <Button 
                        variant="primary" 
                        className="shrink-0 gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <UploadCloud className="h-4 w-4" />
                        Upload New Resume
                    </Button>
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
                    className={`w-full border-2 border-dashed border-[var(--color-brand-border)] bg-white rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer animate-fade-in-up ${isUploading ? 'opacity-50' : 'hover:bg-gray-50'}`} 
                    style={{ animationDelay: '50ms' }}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className="h-16 w-16 bg-[var(--color-brand-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
                        <UploadCloud className={`h-8 w-8 ${isUploading ? 'animate-bounce' : ''}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-1">
                        {isUploading ? 'Uploading...' : 'Upload or drag your resume here'}
                    </h3>
                    <p className="text-[var(--color-brand-text-muted)] mb-4 text-sm">Supported formats: PDF, DOCX (Max 5MB)</p>
                    <Button variant="secondary" size="sm" disabled={isUploading}>Browse Files</Button>
                </div>

                {/* Resumes Grid */}
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-xl font-bold text-[var(--color-brand-text)] mb-4">Saved Resumes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.length === 0 && !isUploading && (
                            <p className="text-gray-500 text-sm">No resumes uploaded yet. Upload one to get started!</p>
                        )}
                        {resumes.map((resume) => (
                            <div key={resume.id} className="bg-white rounded-xl border border-[var(--color-brand-border)] p-5 shadow-[var(--shadow-sm)] hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                                
                                <h3 className="font-semibold text-sm truncate mb-1" title={resume.filename}>{resume.filename}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-text-muted)] mb-4">
                                    <Clock className="h-3.5 w-3.5" />
                                    Updated {new Date(resume.uploaded_at).toLocaleDateString()}
                                </div>

                                <div className="mt-auto pt-4 border-t border-[var(--color-brand-border)] flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Score</span>
                                        <div className="flex items-center gap-1 font-bold text-lg">
                                            {resume.score}
                                            <span className="text-sm text-gray-400 font-normal">/100</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        resume.score >= 90 ? 'bg-green-100 text-green-700' :
                                        resume.score >= 80 ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {resume.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
