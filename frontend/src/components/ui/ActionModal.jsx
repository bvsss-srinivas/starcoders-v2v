import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export function ActionModal({ isOpen, onClose, onConfirm, title, message }) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fade-in px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                <div className="p-6 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="pt-2">
                        <h3 className="text-xl font-display font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-2">{message}</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100">
                    <Button 
                        variant="outline" 
                        onClick={onClose} 
                        className="w-full sm:flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-blue-500"
                    >
                        Dismiss
                    </Button>
                    <Button 
                        onClick={onConfirm || onClose} 
                        className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
