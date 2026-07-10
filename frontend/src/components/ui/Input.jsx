import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({ className, label, error, type = 'text', icon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 animate-fade-in-up">
      {label && (
        <label className="text-sm font-medium text-[var(--color-brand-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-brand-text-muted)]">
                {icon}
            </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] bg-white py-2 text-sm placeholder:text-[var(--color-brand-text-muted)] focus:outline-none focus-glow transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10 pr-3" : "px-3",
            isPassword && !icon ? "px-3 pr-10" : "",
            isPassword && icon ? "pl-10 pr-10" : "",
            error && "border-[var(--color-status-error)] focus:ring-0 focus:border-[var(--color-status-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
            className
          )}
          {...props}
        />
        {isPassword && (
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)] focus:outline-none"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        )}
      </div>
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
