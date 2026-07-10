import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]',
  secondary: 'bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)]',
  success: 'bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]',
  warning: 'bg-[var(--color-status-warning)]/10 text-[var(--color-status-warning)]',
  error: 'bg-[var(--color-status-error)]/10 text-[var(--color-status-error)]',
  outline: 'border border-gray-200 text-gray-800',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
