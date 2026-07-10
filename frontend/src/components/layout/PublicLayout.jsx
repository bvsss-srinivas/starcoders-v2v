import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export default function PublicLayout({ children }) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen flex-col bg-[var(--color-brand-background)] font-sans text-[var(--color-brand-text)]">
            
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between px-6 bg-[var(--color-brand-background)]/80 backdrop-blur-md border-b border-[var(--color-brand-border)]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] text-white shadow-[var(--shadow-sm)]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="font-display font-semibold text-xl tracking-tight text-[var(--color-brand-primary)]">ElevateHer</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-[var(--color-brand-text-muted)]">
                    <Link to="/education" className="hover:text-[var(--color-brand-primary)] transition-colors">Education Hub</Link>
                    <Link to="/fintech" className="hover:text-[var(--color-brand-primary)] transition-colors">FinTech Tools</Link>
                    <Link to="/mentorship" className="hover:text-[var(--color-brand-primary)] transition-colors">Mentorship</Link>
                    <Link to="/careers" className="hover:text-[var(--color-brand-primary)] transition-colors">Career Growth</Link>
                    <Link to="/success-stories" className="hover:text-[var(--color-brand-primary)] transition-colors">Success Stories</Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>
                        Log in
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/register')}>
                        Sign Up
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 z-40 bg-[var(--color-brand-background)] border-b border-[var(--color-brand-border)] p-4 shadow-[var(--shadow-md)] flex flex-col gap-4">
                    <Link to="/education" className="font-medium hover:text-[var(--color-brand-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Education Hub</Link>
                    <Link to="/fintech" className="font-medium hover:text-[var(--color-brand-primary)]" onClick={() => setIsMobileMenuOpen(false)}>FinTech Tools</Link>
                    <Link to="/mentorship" className="font-medium hover:text-[var(--color-brand-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Mentorship</Link>
                    <Link to="/careers" className="font-medium hover:text-[var(--color-brand-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Career Growth</Link>
                    <Link to="/success-stories" className="font-medium hover:text-[var(--color-brand-primary)]" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</Link>
                    <hr className="border-[var(--color-brand-border)]" />
                    <Button variant="ghost" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full justify-start">
                        Log in
                    </Button>
                    <Button variant="primary" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }} className="w-full">
                        Sign Up
                    </Button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col page-enter-active">
                {children}
            </main>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-[var(--color-brand-border)] py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--color-brand-primary)] text-white">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <span className="font-display font-semibold text-lg text-[var(--color-brand-text)]">ElevateHer</span>
                        </Link>
                        <p className="text-sm text-[var(--color-brand-text-muted)]">
                            Empowering women in STEM with education, financial literacy, mentorship, and career growth.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-display font-medium mb-4">Programs</h4>
                        <ul className="space-y-2 text-sm text-[var(--color-brand-text-muted)]">
                            <li><Link to="/education" className="hover:text-[var(--color-brand-primary)]">Education Hub</Link></li>
                            <li><Link to="/fintech" className="hover:text-[var(--color-brand-primary)]">FinTech Tools</Link></li>
                            <li><Link to="/mentorship" className="hover:text-[var(--color-brand-primary)]">Mentorship</Link></li>
                            <li><Link to="/careers" className="hover:text-[var(--color-brand-primary)]">Career Growth</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-medium mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-[var(--color-brand-text-muted)]">
                            <li><Link to="/success-stories" className="hover:text-[var(--color-brand-primary)]">Success Stories</Link></li>
                            <li><Link to="#" className="hover:text-[var(--color-brand-primary)]">Blog</Link></li>
                            <li><Link to="#" className="hover:text-[var(--color-brand-primary)]">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-medium mb-4">Connect</h4>
                        <p className="text-sm text-[var(--color-brand-text-muted)] mb-4">Join our newsletter for the latest updates.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email address" className="flex-1 rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand-primary)]" />
                            <Button variant="primary" size="sm">Subscribe</Button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[var(--color-brand-border)] text-center text-sm text-[var(--color-brand-text-muted)]">
                    &copy; {new Date().getFullYear()} ElevateHer. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
