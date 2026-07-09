import React from 'react';
import { SearchBar } from '../ui/SearchBar';
import { Bell, Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ openMobileSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-brand-border)] bg-[var(--color-brand-surface)]/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={openMobileSidebar}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Placeholder for left-side items if sidebar is collapsed, but logo is in sidebar */}
        <div className="hidden sm:block w-64"></div>
      </div>

      <div className="flex flex-1 items-center justify-center max-w-md px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user?.verification_status === 'verified' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-semibold mr-2 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </div>
        )}
        
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-[var(--color-brand-text-muted)] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-status-error)] border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-[var(--color-brand-border)] mx-1 hidden sm:block"></div>

        <button onClick={logout} className="flex items-center gap-2 rounded-full hover:bg-gray-50 p-1 pr-2 transition-colors border border-transparent hover:border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[var(--color-brand-primary)]">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block">
            {user?.username || 'Profile'}
          </span>
        </button>
      </div>
    </header>
  );
}
