import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, interactive, children, ...props }) {
  return (
    <div 
      className={cn(
        "bg-[var(--color-brand-surface)] rounded-[var(--radius-md)] border border-[#F1F5F9] shadow-[var(--shadow-sm)] overflow-hidden",
        interactive && "transition-shadow duration-150 ease-out hover:shadow-[var(--shadow-md)] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("font-semibold leading-none tracking-tight text-[var(--color-brand-text)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-[var(--color-brand-text-muted)]", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
