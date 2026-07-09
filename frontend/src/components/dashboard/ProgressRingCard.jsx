import React, { useEffect, useState } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { TrendIndicator } from '../ui/TrendIndicator';
import { cn } from '../../lib/utils';

export function ProgressRingCard({ 
    title, 
    value, 
    label, 
    trendValue, 
    trendIsUp, 
    isLoading,
    color = "var(--color-brand-primary)",
    delay = 0
}) {
    const [progress, setProgress] = useState(0);
    const size = 64;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        if (!isLoading) {
            // Animate from 0 to value on mount, respecting prefers-reduced-motion
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (mediaQuery.matches) {
                setProgress(value);
            } else {
                const timer = setTimeout(() => {
                    setProgress(value);
                }, 50 + delay); // slight delay to allow layout to settle
                return () => clearTimeout(timer);
            }
        }
    }, [isLoading, value, delay]);

    const strokeDashoffset = circumference - (progress / 100) * circumference;

    if (isLoading) {
        return (
            <div className="w-full rounded-[var(--radius-md)] bg-white p-5 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="rounded-full shrink-0" style={{ width: size, height: size }} />
            </div>
        );
    }

    return (
        <div className="group w-full rounded-[var(--radius-md)] bg-white p-5 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex items-center justify-between transition-all duration-150">
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-[var(--color-brand-text-muted)]">
                    {title}
                </h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-[var(--color-brand-text)] tabular-data">
                        {value}%
                    </span>
                    {trendValue && (
                        <TrendIndicator value={trendValue} isUp={trendIsUp} />
                    )}
                </div>
                {label && (
                    <p className="text-xs text-[var(--color-brand-text-muted)] mt-1">
                        {label}
                    </p>
                )}
            </div>

            {/* SVG Progress Ring */}
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    {/* Background track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="var(--color-brand-border)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress fill */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                            transition: 'stroke-dashoffset 800ms ease-out'
                        }}
                    />
                </svg>
            </div>
        </div>
    );
}
