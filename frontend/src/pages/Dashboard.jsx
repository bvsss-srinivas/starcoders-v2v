import React, { useState, useEffect } from 'react';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { ProgressRingCard } from '../components/dashboard/ProgressRingCard';
import { CareerChart } from '../components/dashboard/CareerChart';
import { RoadmapStepper } from '../components/dashboard/RoadmapStepper';
import { ConversationList } from '../components/dashboard/ConversationList';
import { TaskList } from '../components/dashboard/TaskList';
import { QuickActions } from '../components/dashboard/QuickActions';

// New Widgets
import { FinanceSnapshotWidget } from '../components/dashboard/FinanceSnapshotWidget';
import { JobMatchesWidget } from '../components/dashboard/JobMatchesWidget';
import { CommunityActivityWidget } from '../components/dashboard/CommunityActivityWidget';
import { UpcomingInterviewWidget } from '../components/dashboard/UpcomingInterviewWidget';

import api from '../api/axiosConfig';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard/summary/');
                setSummary(res.data);
            } catch (err) {
                console.error("Failed to load dashboard summary data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);

    const getStagger = (index) => ({ animationDelay: `${index * 50}ms`, opacity: 0 });

    return (
        <div className="min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text)] page-enter-active pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                
                {/* Row 1: Welcome */}
                <div className="w-full animate-fade-in-up" style={getStagger(0)}>
                    <WelcomeCard isLoading={isLoading} summary={summary} />
                </div>

                {/* Row 2: Stats (Legacy placeholders for now, can be wired up later) */}
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
                            value={summary?.resume?.score || 0} 
                            label={summary?.resume ? "Latest AI Score" : "Upload to score"}
                            trendValue={summary?.resume ? "+12" : "0"} 
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

                {/* Row 3: New Feature Widgets */}
                {!isLoading && summary && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up" style={getStagger(4)}>
                        <div className="lg:col-span-1">
                            <FinanceSnapshotWidget goals={summary.finance_goals} />
                        </div>
                        <div className="lg:col-span-1">
                            <UpcomingInterviewWidget interview={summary.next_interview} />
                        </div>
                        <div className="lg:col-span-1">
                            <JobMatchesWidget jobs={summary.job_matches} />
                        </div>
                        <div className="lg:col-span-1">
                            <CommunityActivityWidget activities={summary.community_activity} />
                        </div>
                    </div>
                )}

                {/* Row 4: Charts & Roadmap */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 animate-fade-in-up" style={getStagger(5)}>
                        <CareerChart isLoading={isLoading} />
                    </div>
                    <div className="lg:col-span-2 animate-fade-in-up" style={getStagger(6)}>
                        <RoadmapStepper isLoading={isLoading} />
                    </div>
                </div>

                {/* Row 5: Lists & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="animate-fade-in-up" style={getStagger(7)}>
                        <ConversationList isLoading={isLoading} />
                    </div>
                    <div className="animate-fade-in-up" style={getStagger(8)}>
                        <TaskList isLoading={isLoading} />
                    </div>
                    <div className="animate-fade-in-up" style={getStagger(9)}>
                        <QuickActions isLoading={isLoading} />
                    </div>
                </div>

            </div>
        </div>
    );
}
