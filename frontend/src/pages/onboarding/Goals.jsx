import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Rocket, Cloud, BarChart3, Code2, Brain, Shield, Briefcase, RefreshCw, ArrowUpRight, Building2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Goals() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    
    const [selections, setSelections] = useState({
        level: '',
        field: '',
        goal: ''
    });

    const handleSelect = (category, value) => {
        setSelections({ ...selections, [category]: value });
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleFinish = () => {
        // In a real app, save selections to backend here
        navigate('/onboarding/cohort');
    };

    const isNextDisabled = () => {
        if (currentStep === 1 && !selections.level) return true;
        if (currentStep === 2 && !selections.field) return true;
        if (currentStep === 3 && !selections.goal) return true;
        return false;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">What's your current skill level?</h2>
                            <p className="text-[var(--color-brand-text-muted)]">This helps us recommend the right starting point.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'beginner', title: 'Beginner', desc: 'Just starting out', icon: <Sprout className="h-6 w-6" /> },
                                { id: 'intermediate', title: 'Intermediate', desc: 'Have some basic knowledge', icon: <TrendingUp className="h-6 w-6" /> },
                                { id: 'advanced', title: 'Advanced', desc: 'Experienced professional', icon: <Rocket className="h-6 w-6" /> }
                            ].map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleSelect('level', item.id)}
                                    className={`cursor-pointer border-2 rounded-[var(--radius-lg)] p-6 transition-all duration-300 flex flex-col items-center text-center
                                        ${selections.level === item.id 
                                            ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm' 
                                            : 'border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] hover:border-[var(--color-brand-primary)]/40 hover:bg-[var(--color-brand-surface)]'
                                        }`}
                                >
                                    <div className={`p-3 rounded-full mb-4 ${selections.level === item.id ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-100 text-[var(--color-brand-text-muted)]'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm text-[var(--color-brand-text-muted)]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">What STEM field interests you?</h2>
                            <p className="text-[var(--color-brand-text-muted)]">Select your primary area of focus.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'cloud', title: 'Cloud Computing', icon: <Cloud className="h-5 w-5" /> },
                                { id: 'data', title: 'Data Science & Analytics', icon: <BarChart3 className="h-5 w-5" /> },
                                { id: 'web', title: 'Web Development', icon: <Code2 className="h-5 w-5" /> },
                                { id: 'ai', title: 'AI & Machine Learning', icon: <Brain className="h-5 w-5" /> },
                                { id: 'cyber', title: 'Cybersecurity', icon: <Shield className="h-5 w-5" /> }
                            ].map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleSelect('field', item.id)}
                                    className={`cursor-pointer border-2 rounded-[var(--radius-md)] p-4 transition-all duration-300 flex items-center gap-4
                                        ${selections.field === item.id 
                                            ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm' 
                                            : 'border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] hover:border-[var(--color-brand-primary)]/40'
                                        }`}
                                >
                                    <div className={`${selections.field === item.id ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-brand-text-muted)]'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-medium text-base">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">What's your primary career goal?</h2>
                            <p className="text-[var(--color-brand-text-muted)]">We'll tailor your mentorship and financial tools accordingly.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'first_job', title: 'Get my first tech job', icon: <Briefcase className="h-5 w-5" /> },
                                { id: 'switch', title: 'Switch careers into tech', icon: <RefreshCw className="h-5 w-5" /> },
                                { id: 'promote', title: 'Get promoted / advance', icon: <ArrowUpRight className="h-5 w-5" /> },
                                { id: 'business', title: 'Start a business', icon: <Building2 className="h-5 w-5" /> },
                                { id: 'learn', title: 'Just learn for fun', icon: <Sparkles className="h-5 w-5" /> }
                            ].map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleSelect('goal', item.id)}
                                    className={`cursor-pointer border-2 rounded-[var(--radius-md)] p-4 transition-all duration-300 flex items-center gap-4
                                        ${selections.goal === item.id 
                                            ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 shadow-sm' 
                                            : 'border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] hover:border-[var(--color-brand-primary)]/40'
                                        }`}
                                >
                                    <div className={`${selections.goal === item.id ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-brand-text-muted)]'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-medium text-base">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] flex flex-col page-enter-active">
            {/* Top Navigation */}
            <div className="h-16 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] px-6 flex items-center justify-center relative">
                <span className="font-display font-bold text-xl text-[var(--color-brand-primary)]">ElevateHer</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto py-12">
                
                {/* Progress Bar */}
                <div className="w-full mb-12">
                    <div className="flex justify-between text-sm font-medium text-[var(--color-brand-text-muted)] mb-2">
                        <span>Step {currentStep} of 3</span>
                        <span>{Math.round((currentStep / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-[var(--color-brand-primary)] h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${(currentStep / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full min-h-[400px]">
                    {renderStepContent()}
                </div>

                {/* Bottom Navigation */}
                <div className="w-full mt-12 flex justify-between pt-6 border-t border-[var(--color-brand-border)]">
                    <Button 
                        variant="outline" 
                        onClick={handleBack} 
                        disabled={currentStep === 1}
                        className="w-32"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    
                    {currentStep < 3 ? (
                        <Button 
                            variant="primary" 
                            onClick={handleNext} 
                            disabled={isNextDisabled()}
                            className="w-32"
                        >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            variant="primary" 
                            onClick={handleFinish} 
                            disabled={isNextDisabled()}
                            className="w-32"
                        >
                            Finish
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
