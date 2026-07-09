import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Clock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function Verification() {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();
    
    const [statusData, setStatusData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Form state
    const [idType, setIdType] = useState('aadhaar');
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const fetchStatus = async () => {
        try {
            const res = await api.get('/verification/status/');
            setStatusData(res.data);
            if (res.data.status === 'verified') {
                await checkAuth(); // refresh user object
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleFileDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };
    
    const handleFileSelection = (selectedFile) => {
        if (!selectedFile) return;
        
        // 10MB limit
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("File is too large. Maximum size is 10MB.");
            return;
        }
        
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Invalid file type. Only PDF, JPEG, PNG, and WEBP are allowed.");
            return;
        }
        
        setFile(selectedFile);
        setError(null);
    };

    const handleIdNumberChange = (e) => {
        // Simple client side masking representation
        // The backend expects the masked version so we'll just send the last 4.
        // Actually, we should send the masked string directly.
        const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        setIdNumber(val);
    };

    const getMaskedId = (fullId) => {
        if (fullId.length <= 4) return fullId;
        return '*'.repeat(fullId.length - 4) + fullId.slice(-4);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !idNumber) return;
        
        setIsSubmitting(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('id_type', idType);
        formData.append('id_number_masked', getMaskedId(idNumber));
        formData.append('document_file', file);

        try {
            await api.post('/verification/submit/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchStatus();
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-brand-background)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const needsSubmission = !statusData || (statusData.status === 'pending' && !statusData.has_document);
    const isPendingReview = statusData?.status === 'pending' && statusData?.has_document;
    const isRejected = statusData?.status === 'rejected';

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] flex items-center justify-center p-4 selection:bg-[var(--color-brand-primary)] selection:text-white">
            <div className="w-full max-w-lg bg-white rounded-[12px] shadow-[var(--shadow-md)] overflow-hidden transition-all duration-300">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] p-6 text-white text-center">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-90" />
                    <h2 className="text-2xl font-bold font-inter tracking-tight">Identity Verification</h2>
                    <p className="text-white/80 text-sm mt-1">Securing the ElevateHer community</p>
                </div>

                <div className="p-8">
                    {/* Pending Review State */}
                    {isPendingReview && (
                        <div className="flex flex-col items-center text-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                                <Clock className="w-10 h-10 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Under Review</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Thank you for submitting your document. Our team is securely reviewing your identity. This usually takes 24-48 hours. 
                                We will notify you once approved.
                            </p>
                        </div>
                    )}

                    {/* Rejected State */}
                    {isRejected && (
                        <div className="flex flex-col items-center text-center animate-fade-in-up">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Rejected</h3>
                            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg text-sm w-full mb-6 text-left">
                                <p className="font-semibold mb-1">Reason for rejection:</p>
                                <p>{statusData.rejection_reason || "Invalid document provided."}</p>
                            </div>
                            <Button 
                                onClick={() => setStatusData({ ...statusData, status: 'pending', has_document: false })} 
                                className="w-full"
                            >
                                Upload Again
                            </Button>
                        </div>
                    )}

                    {/* Submission Form State */}
                    {needsSubmission && (
                        <form onSubmit={handleSubmit} className="animate-fade-in-up flex flex-col gap-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Type</label>
                                <select 
                                    value={idType} 
                                    onChange={(e) => setIdType(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                                >
                                    <option value="aadhaar">Aadhaar Card</option>
                                    <option value="passport">Passport</option>
                                    <option value="driving_licence">Driving Licence</option>
                                    <option value="voter_id">Voter ID</option>
                                    <option value="other">Other Government ID</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Number</label>
                                <input 
                                    type="text" 
                                    value={idNumber}
                                    onChange={handleIdNumberChange}
                                    placeholder="Enter full ID number"
                                    required
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    For your privacy, we will only store {idNumber ? getMaskedId(idNumber) : 'a masked version'}.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Document</label>
                                <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleFileDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${file ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5' : 'border-gray-300 hover:border-[var(--color-brand-primary)] bg-gray-50 hover:bg-gray-100'}`}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept=".pdf,image/jpeg,image/png,image/webp"
                                        onChange={(e) => handleFileSelection(e.target.files[0])}
                                    />
                                    
                                    {file ? (
                                        <div className="flex flex-col items-center animate-fade-in-up">
                                            <FileText className="w-10 h-10 text-[var(--color-brand-primary)] mb-2" />
                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                            <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500">PDF, JPG, PNG, WEBP (Max 10MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-2">
                                <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Privacy Notice
                                </h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Your full ID number is never stored in our database. We only store a masked version for display purposes. Your document is securely stored outside of public access and is only visible to authorized verification admins.
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full mt-2" 
                                disabled={!file || !idNumber || isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Securely Submit Document
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
