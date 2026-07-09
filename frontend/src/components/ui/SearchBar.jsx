import React from 'react';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';

export function SearchBar({ className, ...props }) {
  return (
    <div className={cn("relative flex items-center w-full max-w-sm", className)}>
      <Search className="absolute left-3 h-4 w-4 text-[var(--color-brand-text-muted)]" />
      <input
        type="text"
        placeholder="Search... (⌘K)"
        className="h-9 w-full rounded-[var(--radius-sm)] border border-transparent bg-gray-100 pl-9 pr-4 text-sm transition-all focus:border-[var(--color-brand-border)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] placeholder:text-[var(--color-brand-text-muted)]"
        {...props}
      />
    </div>
  );
}
