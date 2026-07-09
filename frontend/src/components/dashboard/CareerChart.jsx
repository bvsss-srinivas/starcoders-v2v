import React, { useState, useEffect } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    ReferenceDot
} from 'recharts';
import { Skeleton } from '../ui/Skeleton';

const data = [
    { month: 'Jan', progress: 30, milestone: null },
    { month: 'Feb', progress: 45, milestone: null },
    { month: 'Mar', progress: 55, milestone: 'Resume Optimized' },
    { month: 'Apr', progress: 60, milestone: null },
    { month: 'May', progress: 78, milestone: 'First Interview' },
    { month: 'Jun', progress: 85, milestone: null },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-[var(--radius-sm)] bg-gray-900 px-3 py-2 text-white shadow-lg text-sm border border-gray-800">
                <p className="font-medium mb-1">{label}</p>
                <p className="text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]"></span>
                    Score: <span className="tabular-data font-semibold text-white">{payload[0].value}</span>
                </p>
                {payload[0].payload.milestone && (
                    <p className="mt-1 text-xs text-[var(--color-brand-secondary)] font-medium">
                        ✨ {payload[0].payload.milestone}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export function CareerChart({ isLoading }) {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setShouldAnimate(!mediaQuery.matches);
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[350px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col">
                <div className="mb-6">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex-1 w-full bg-gray-50/50 rounded-lg flex items-end">
                    <Skeleton className="w-full h-3/4 rounded-b-lg rounded-t-none" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[350px] rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] transition-all duration-150">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">Career Progress</h3>
                <p className="text-sm text-[var(--color-brand-text-muted)]">Your overall readiness score over the past 6 months.</p>
            </div>
            
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--color-brand-text-muted)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--color-brand-text-muted)', fontSize: 12 }}
                            className="tabular-data"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <Area 
                            type="monotone" 
                            dataKey="progress" 
                            stroke="var(--color-brand-primary)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorProgress)"
                            isAnimationActive={shouldAnimate}
                            animationDuration={400}
                            animationEasing="ease-out"
                        />
                        
                        {/* Milestones as Reference Dots */}
                        {data.map((entry, index) => {
                            if (entry.milestone) {
                                return (
                                    <ReferenceDot 
                                        key={`dot-${index}`}
                                        x={entry.month} 
                                        y={entry.progress} 
                                        r={4} 
                                        fill="var(--color-brand-secondary)" 
                                        stroke="white" 
                                        strokeWidth={2} 
                                    />
                                );
                            }
                            return null;
                        })}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
