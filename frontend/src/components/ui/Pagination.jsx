import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={cn("flex items-center space-x-1", className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-brand-text-muted)] hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors tabular-data",
            currentPage === page
              ? "bg-[var(--color-brand-primary)] text-white"
              : "text-[var(--color-brand-text)] hover:bg-gray-100"
          )}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-brand-text-muted)] hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        <span className="sr-only">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
