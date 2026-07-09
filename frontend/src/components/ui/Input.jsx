import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 animate-fade-in-up">
      {label && (
        <label className="text-sm font-medium text-[var(--color-brand-text)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] bg-white px-3 py-2 text-sm placeholder:text-[var(--color-brand-text-muted)] focus:outline-none focus-glow transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[var(--color-status-error)] focus:ring-0 focus:border-[var(--color-status-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--color-status-error)] flex items-center gap-1 mt-0.5 font-medium">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
