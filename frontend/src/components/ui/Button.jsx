import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  primary: 'bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] bg-[length:200%_auto] text-white hover:bg-[position:right_center] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:opacity-100 active:scale-[0.98] active:translate-y-0 active:shadow-[var(--shadow-sm)] border-transparent shadow-[var(--shadow-sm)]',
  secondary: 'bg-white text-[var(--color-brand-text)] border border-[var(--color-brand-border)] hover:bg-gray-50 hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:bg-gray-100 active:scale-[0.98] active:translate-y-0 shadow-[var(--shadow-sm)]',
  ghost: 'bg-transparent text-[var(--color-brand-text)] hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98]',
  destructive: 'bg-[var(--color-status-error)] text-white hover:bg-red-600 hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)] active:bg-red-700 active:scale-[0.98] active:translate-y-0 shadow-[var(--shadow-sm)]',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-8 text-base',
};

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled, 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none animate-fade-in-up',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
