import React from 'react';
import { Link } from 'react-router-dom';
import { LiveAurora } from '../ui/LiveAurora';

export default function AuthLayout({ children, title, subtitle, bottomText, bottomLinkText, bottomLinkTo }) {
    return (
        <div className="relative flex min-h-screen flex-col bg-[var(--color-brand-background)] font-sans text-[var(--color-brand-text)] overflow-hidden page-enter-active">
            
            {/* The Live Wallpaper Aurora Background */}
            <LiveAurora />

            {/* Minimal Header */}
            <header className="relative z-10 flex h-16 w-full items-center justify-between px-6 bg-[var(--color-brand-background)]/50 backdrop-blur-sm border-b border-transparent">
                <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 animate-fade-in-up">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-brand-primary)] text-white animate-logo-breathe shadow-[var(--shadow-sm)]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="font-display font-semibold tracking-tight">ElevateHer</span>
                </Link>
            </header>

            {/* Centered Main Content */}
            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
                <div className="w-full max-w-[400px]">
                    <div className="mb-8 text-center animate-fade-in-up delay-100 opacity-0">
                        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-brand-text)]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 text-sm text-[var(--color-brand-text-muted)]">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="rounded-[var(--radius-md)] bg-white/85 backdrop-blur-[12px] p-8 shadow-[0_8px_24px_rgba(17,24,39,0.10)] border border-white/40 animate-fade-in-up delay-200 opacity-0">
                        {children}
                    </div>

                    {bottomText && bottomLinkText && (
                        <div className="mt-6 text-center animate-fade-in-up delay-200 opacity-0">
                            <p className="text-sm text-[var(--color-brand-text-muted)] mb-4">
                                {bottomText}{' '}
                                <Link 
                                    to={bottomLinkTo} 
                                    className="font-medium text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-secondary)] hover:underline hover:underline-offset-4"
                                >
                                    {bottomLinkText}
                                </Link>
                            </p>
                            
                            {/* Trust Line */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-[var(--color-brand-border)]/50">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-gray-300 to-purple-200"></div>
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-purple-200 to-purple-300"></div>
                                </div>
                                <span className="text-xs font-medium text-[var(--color-brand-text-muted)]">Trusted by 12,000+ ambitious professionals</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Auth Footer */}
            <footer className="relative z-10 w-full border-t border-[var(--color-brand-border)] py-6 text-center text-xs text-[var(--color-brand-text-muted)] bg-[var(--color-brand-background)]">
                <p>&copy; {new Date().getFullYear()} ElevateHer AI. All rights reserved.</p>
            </footer>
        </div>
    );
}
