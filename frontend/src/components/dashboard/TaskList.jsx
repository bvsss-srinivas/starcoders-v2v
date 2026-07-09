import React, { useState, useEffect } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/utils';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../api/axiosConfig';

const priorityColors = {
    high: 'bg-[var(--color-status-error)]',
    medium: 'bg-[var(--color-status-warning)]',
    low: 'bg-[var(--color-status-success)]',
};

export function TaskList({ isLoading }) {
    const [tasks, setTasks] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        due_date: '',
        due_time: '',
        priority: 'medium'
    });

    const fetchTasks = async () => {
        try {
            const res = await api.get('dashboard/tasks/');
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            fetchTasks();
        }
    }, [isLoading]);

    const toggleTask = async (id, currentStatus) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
        try {
            await api.patch(`dashboard/tasks/${id}/`, { completed: !currentStatus });
            fetchTasks(); // Re-fetch to guarantee correct ordering
        } catch (error) {
            console.error("Error updating task", error);
            // Revert on error
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
        }
    };

    const handleAddChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('dashboard/tasks/', formData);
            setFormData({ title: '', due_date: '', due_time: '', priority: 'medium' });
            setShowAddForm(false);
            fetchTasks();
        } catch (error) {
            console.error("Error adding task", error);
            alert("Failed to add task.");
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="w-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col">
                <div className="mb-6">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-center p-3 border border-gray-100 rounded-lg">
                            <Skeleton className="h-5 w-5 rounded shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const hasTasks = tasks && tasks.length > 0;

    return (
        <div className="w-full h-full rounded-[var(--radius-md)] bg-white p-6 shadow-[var(--shadow-sm)] border border-[var(--color-brand-border)] flex flex-col transition-all duration-150">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">Upcoming Tasks</h3>
                    <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">Stay on top of your career goals.</p>
                </div>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="gap-1.5" 
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showAddForm ? 'Cancel' : 'Add Task'}
                </Button>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 hide-scrollbar" style={{ maxHeight: '400px' }}>
                
                {/* Add Task Form (Inline) */}
                {showAddForm && (
                    <form onSubmit={handleAddTask} className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in-up flex flex-col gap-3">
                        <input 
                            required 
                            type="text" 
                            name="title" 
                            placeholder="What do you need to do?" 
                            value={formData.title} 
                            onChange={handleAddChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] focus:border-[var(--color-brand-primary)]"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                required 
                                type="date" 
                                name="due_date" 
                                value={formData.due_date} 
                                onChange={handleAddChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                            />
                            <input 
                                type="time" 
                                name="due_time" 
                                value={formData.due_time} 
                                onChange={handleAddChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                            />
                        </div>
                        <div className="flex gap-3 items-center mt-1">
                            <select 
                                name="priority" 
                                value={formData.priority} 
                                onChange={handleAddChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <Button type="submit" size="sm" className="flex-1">Save Task</Button>
                        </div>
                    </form>
                )}

                {!hasTasks && !showAddForm ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <EmptyState 
                            title="All caught up!"
                            description="You have no pending tasks right now."
                            actionLabel="Add your first task"
                            onAction={() => setShowAddForm(true)}
                        />
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div 
                            key={task.id} 
                            className={cn(
                                "group flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-primary)]/30 hover:shadow-sm transition-all duration-200 cursor-pointer",
                                task.completed && "opacity-60 bg-gray-50"
                            )}
                            onClick={() => toggleTask(task.id, task.completed)}
                            role="checkbox"
                            aria-checked={task.completed}
                            tabIndex={0}
                        >
                            {/* Animated Checkbox */}
                            <div className={cn(
                                "flex items-center justify-center w-5 h-5 rounded border mt-0.5 shrink-0 transition-colors duration-200",
                                task.completed 
                                    ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white" 
                                    : "border-gray-300 bg-white group-hover:border-[var(--color-brand-primary)]"
                            )}>
                                {task.completed && (
                                    <Check className="w-3.5 h-3.5 stroke-[3] animate-fade-in-up" style={{ animationDuration: '200ms' }} />
                                )}
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <h4 className={cn(
                                    "text-sm font-medium transition-colors break-words",
                                    task.completed ? "text-gray-500 line-through" : "text-[var(--color-brand-text)]"
                                )}>
                                    {task.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-brand-text-muted)]">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", priorityColors[task.priority])} />
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                    </span>
                                    <span className="text-gray-300 text-xs">•</span>
                                    <span className="text-xs text-[var(--color-brand-text-muted)]">
                                        Due {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                                        {task.due_time ? ` at ${task.due_time}` : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
