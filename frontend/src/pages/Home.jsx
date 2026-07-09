import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LiveAurora } from '../components/ui/LiveAurora';
import { Button } from '../components/ui/Button';
import { Menu, X } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen flex-col bg-[var(--color-brand-background)] font-sans text-[var(--color-brand-text)] overflow-hidden page-enter-active">
            
            {/* Live Wallpaper Background */}
            <LiveAurora />

            {/* Top Navbar */}
            <header className="relative z-50 flex h-16 w-full items-center justify-between px-6 bg-[var(--color-brand-background)]/50 backdrop-blur-md border-b border-[var(--color-brand-border)]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-brand-primary)] text-white shadow-[var(--shadow-sm)] animate-logo-breathe">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="font-display font-semibold tracking-tight">ElevateHer</span>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-4">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/login')}
                        className="text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/20 hover:bg-[var(--color-brand-primary)]/5"
                    >
                        Log in
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/register')}
                    >
                        Get started
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-16 left-0 right-0 z-40 bg-[var(--color-brand-background)] border-b border-[var(--color-brand-border)] p-4 shadow-[var(--shadow-md)]">
                    <div className="flex flex-col gap-3">
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate('/login')}
                            className="w-full text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/20"
                        >
                            Log in
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => navigate('/register')}
                            className="w-full"
                        >
                            Get started
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-brand-text)] mb-6">
                        Your career, elevated.
                    </h1>
                    <p className="text-lg sm:text-xl text-[var(--color-brand-text-muted)] mb-8">
                        The AI-powered platform for ambitious women building financial independence and accelerating their careers.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto"
                        >
                            Start your journey
                        </Button>
                        <Button 
                            variant="secondary" 
                            size="lg"
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto"
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-[var(--color-brand-border)] py-6 text-center text-xs text-[var(--color-brand-text-muted)] bg-[var(--color-brand-background)]">
                <p>&copy; {new Date().getFullYear()} ElevateHer AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
