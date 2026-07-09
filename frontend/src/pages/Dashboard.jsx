import React, { useState, useEffect } from 'react';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { ProgressRingCard } from '../components/dashboard/ProgressRingCard';
import { CareerChart } from '../components/dashboard/CareerChart';
import { RoadmapStepper } from '../components/dashboard/RoadmapStepper';
import { ConversationList } from '../components/dashboard/ConversationList';
import { TaskList } from '../components/dashboard/TaskList';
import { QuickActions } from '../components/dashboard/QuickActions';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading for 800ms to demonstrate perfectly matching skeletons
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Helper to calculate staggered animation delays
    const getStagger = (index) => ({ animationDelay: `${index * 50}ms`, opacity: 0 });

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                
                {/* Row 1: Welcome */}
                <div className="w-full animate-fade-in-up" style={getStagger(0)}>
                    <WelcomeCard isLoading={isLoading} />
                </div>

                {/* Row 2: Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="animate-fade-in-up" style={getStagger(1)}>
                        <ProgressRingCard 
                            title="Profile Completion" 
                            value={85} 
                            label="Almost ready" 
                            trendValue="+5" 
                            trendIsUp={true} 
                            isLoading={isLoading} 
                            delay={1 * 50}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={getStagger(2)}>
                        <ProgressRingCard 
                            title="Resume Score" 
                            value={92} 
                            label="Top 10% candidate" 
                            trendValue="+12" 
                            trendIsUp={true} 
                            isLoading={isLoading} 
                            color="var(--color-status-success)"
                            delay={2 * 50}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={getStagger(3)}>
                        <ProgressRingCard 
                            title="Skill Progress" 
                            value={68} 
                            label="Python fundamentals" 
                            trendValue="+2" 
                            trendIsUp={true} 
                            isLoading={isLoading} 
                            color="var(--color-brand-secondary)"
                            delay={3 * 50}
                        />
                    </div>
                </div>

                {/* Row 3: Charts & Roadmap */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 animate-fade-in-up" style={getStagger(4)}>
                        <CareerChart isLoading={isLoading} />
                    </div>
                    <div className="lg:col-span-2 animate-fade-in-up" style={getStagger(5)}>
                        <RoadmapStepper isLoading={isLoading} />
                    </div>
                </div>

                {/* Row 4: Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="animate-fade-in-up" style={getStagger(6)}>
                        <ConversationList isLoading={isLoading} />
                    </div>
                    <div className="animate-fade-in-up" style={getStagger(7)}>
                        <TaskList isLoading={isLoading} />
                    </div>
                </div>

                {/* Row 5: Quick Actions */}
                <div className="w-full animate-fade-in-up" style={getStagger(8)}>
                    <QuickActions isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
