import React from 'react';
import { Link } from 'react-router-dom';
import { PiggyBank, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinanceSnapshotWidget({ goals = [] }) {
    return (
        <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    Finance Goals
                </h3>
                <Link to="/finance" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
                {goals.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-3">No active savings goals yet.</p>
                        <Link to="/finance">
                            <Button variant="secondary" size="sm" className="gap-2 mx-auto">
                                <Plus className="w-4 h-4" /> Add Goal
                            </Button>
                        </Link>
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal.id}>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-gray-700 truncate mr-2" title={goal.name}>{goal.name}</span>
                                <span className="text-gray-900 shrink-0">{goal.percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--color-brand-primary)] rounded-full transition-all duration-1000" 
                                    style={{ width: `${Math.min(goal.percentage, 100)}%` }} 
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">
                                ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
