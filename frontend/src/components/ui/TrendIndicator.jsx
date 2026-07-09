import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function TrendIndicator({ value, trend, className }) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const isNeutral = trend === 'neutral';

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        isPositive && "text-[var(--color-status-success)]",
        isNegative && "text-[var(--color-status-error)]",
        isNeutral && "text-[var(--color-brand-text-muted)]",
        className
      )}
    >
      {isPositive && <TrendingUp className="h-4 w-4" />}
      {isNegative && <TrendingDown className="h-4 w-4" />}
      {isNeutral && <Minus className="h-4 w-4" />}
      <span>{value}</span>
    </div>
  );
}
