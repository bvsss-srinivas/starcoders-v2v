import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, LayoutDashboard, Target, Briefcase, FileText, Video, Menu, ChevronLeft } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Target },
  { name: 'My Profile', path: '/profile', icon: Briefcase },
  { name: 'Resumes', path: '/resumes', icon: FileText },
  { name: 'Interviews', path: '/interviews', icon: Video },
];

export function Sidebar({ isCollapsed, toggleSidebar, isMobileOpen, closeMobile }) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-60",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-brand-border)]">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--color-brand-primary)] text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            {!isCollapsed && <span className="font-display text-lg font-bold">ElevateHer</span>}
          </div>
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 border-l-3 border-[var(--color-brand-primary)] pl-[13px]"
                        : "text-[var(--color-brand-text-muted)] hover:bg-gray-50 hover:text-[var(--color-brand-text)] border-l-3 border-transparent pl-[13px]"
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
