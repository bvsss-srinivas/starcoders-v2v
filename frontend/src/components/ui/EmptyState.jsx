import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export function EmptyState({ className, title, description, actionLabel, onAction }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <h3 className="text-sm font-medium text-[var(--color-brand-text)]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-brand-text-muted)] max-w-sm">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
