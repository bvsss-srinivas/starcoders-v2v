import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function QuizView() {
    const { id, quizId } = useParams();
    const navigate = useNavigate();
    
    // Mock Quiz Data
    const quiz = {
        title: "Cloud Computing Fundamentals: Knowledge Check",
        passingScore: 70,
        questions: [
            {
                id: 1,
                text: "Which of the following is a key characteristic of cloud computing?",
                options: [
                    { id: 'a', text: "Requires long-term contracts" },
                    { id: 'b', text: "On-demand self-service" },
                    { id: 'c', text: "Fixed capacity only" },
                    { id: 'd', text: "Manual provisioning" }
                ],
                correctOption: 'b'
            },
            {
                id: 2,
                text: "What does IaaS stand for?",
                options: [
                    { id: 'a', text: "Information as a Service" },
                    { id: 'b', text: "Internet as a Service" },
                    { id: 'c', text: "Infrastructure as a Service" },
                    { id: 'd', text: "Integration as a Service" }
                ],
                correctOption: 'c'
            }
        ]
    };

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelectOption = (optionId) => {
        if (isSubmitted) return;
        setAnswers({ ...answers, [currentQuestionIdx]: optionId });
    };

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(currentQuestionIdx - 1);
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOption) {
                correctCount++;
            }
        });
        const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
        setScore(finalScore);
        setIsSubmitted(true);
    };

    const passed = score >= quiz.passingScore;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[var(--color-brand-background)] flex items-center justify-center p-6 page-enter-active">
                <div className="max-w-md w-full bg-white rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] p-8 text-center shadow-sm">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]' : 'bg-[var(--color-status-error)]/10 text-[var(--color-status-error)]'}`}>
                        {passed ? <Award className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                    </div>
                    
                    <h2 className="text-2xl font-display font-bold mb-2">
                        {passed ? "Congratulations!" : "Keep Trying!"}
                    </h2>
                    
                    <p className="text-[var(--color-brand-text-muted)] mb-6">
                        You scored <span className={`font-bold ${passed ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}`}>{score}%</span>. 
                        The passing score is {quiz.passingScore}%.
                    </p>
                    
                    <div className="space-y-3">
                        {passed ? (
                            <Button className="w-full" variant="primary" onClick={() => navigate(`/dashboard/courses/${id}/learn`)}>
                                Continue Course
                            </Button>
                        ) : (
                            <Button className="w-full" variant="primary" onClick={() => { setIsSubmitted(false); setAnswers({}); setCurrentQuestionIdx(0); }}>
                                Retake Quiz
                            </Button>
                        )}
                        <Button className="w-full" variant="outline" onClick={() => navigate(`/dashboard/courses/${id}/learn`)}>
                            Back to Course
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] flex flex-col page-enter-active">
            {/* Header */}
            <div className="h-16 bg-white border-b border-[var(--color-brand-border)] flex items-center px-6 shrink-0 sticky top-0 z-10">
                <button onClick={() => navigate(`/dashboard/courses/${id}/learn`)} className="p-2 -ml-2 text-gray-500 hover:text-black mr-4">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="font-display font-semibold text-lg line-clamp-1">{quiz.title}</div>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-[var(--color-brand-text-muted)] font-medium mb-2">
                        <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
                        <span>{Math.round(((currentQuestionIdx + 1) / quiz.questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-[var(--color-brand-primary)] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                        {question.text}
                    </h3>

                    <div className="space-y-4">
                        {question.options.map(option => (
                            <div 
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={`p-4 border-2 rounded-[var(--radius-md)] cursor-pointer transition-colors flex items-center gap-4
                                    ${answers[currentQuestionIdx] === option.id 
                                        ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5' 
                                        : 'border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)]/40 hover:bg-white bg-white'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                    ${answers[currentQuestionIdx] === option.id 
                                        ? 'border-[var(--color-brand-primary)]' 
                                        : 'border-gray-300'
                                    }`}
                                >
                                    {answers[currentQuestionIdx] === option.id && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-primary)]"></div>
                                    )}
                                </div>
                                <span className="text-[var(--color-brand-text)]">{option.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-12 pt-6 border-t border-[var(--color-brand-border)]">
                    <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIdx === 0}>
                        Previous
                    </Button>
                    
                    {currentQuestionIdx === quiz.questions.length - 1 ? (
                        <Button 
                            variant="primary" 
                            onClick={handleSubmit} 
                            disabled={!answers[currentQuestionIdx]}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button 
                            variant="primary" 
                            onClick={handleNext} 
                            disabled={!answers[currentQuestionIdx]}
                        >
                            Next Question
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
