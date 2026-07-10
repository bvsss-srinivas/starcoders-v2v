import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Target, CheckCircle, IndianRupee, TrendingUp, AlertCircle, CreditCard, Home, Book, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axiosConfig';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const CATEGORY_META = {
  emergency: { label: 'Emergency Fund', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  investment: { label: 'Investment', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  debt: { label: 'Debt Payoff', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-100' },
  purchase: { label: 'Big Purchase', icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' },
  education: { label: 'Education', icon: Book, color: 'text-purple-600', bg: 'bg-purple-100' },
  other: { label: 'Other', icon: PiggyBank, color: 'text-gray-600', bg: 'bg-gray-100' }
};

export default function FinancialGoals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [activeAnimations, setActiveAnimations] = useState({});
  
  const [formData, setFormData] = useState({
    title: '', category: 'other', target_amount: '', current_amount: '', target_date: ''
  });

  const [customAmounts, setCustomAmounts] = useState({});
  const [showCustomInputs, setShowCustomInputs] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});

  const fetchGoals = async () => {
    try {
      const res = await api.get('/finance/goals/');
      setGoals(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAddModal = () => {
    setEditingGoal(null);
    setFormData({ title: '', category: 'other', target_amount: '', current_amount: '', target_date: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      category: goal.category,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        target_date: formData.target_date || null
      };

      if (editingGoal) {
        await api.patch(`/finance/goals/${editingGoal.id}/`, payload);
      } else {
        await api.post('/finance/goals/', payload);
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      alert('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      try {
        await api.delete(`/finance/goals/${id}/`);
        fetchGoals();
      } catch (err) {
        alert("Failed to delete goal");
      }
    }
  };

  const handleAddContribution = async (goal, amount) => {
    if (!amount || amount <= 0) return;
    try {
      const oldProgress = (goal.current_amount / goal.target_amount) * 100;
      const res = await api.post(`/finance/goals/${goal.id}/contributions/`, { amount });
      
      const updatedGoal = res.data;
      const newProgress = (updatedGoal.current_amount / updatedGoal.target_amount) * 100;
      
      // Check milestones (25, 50, 75, 100)
      const milestones = [25, 50, 75, 100];
      const crossedMilestone = milestones.some(m => oldProgress < m && newProgress >= m);
      
      if (crossedMilestone) {
        setActiveAnimations(prev => ({ ...prev, [goal.id]: true }));
        setTimeout(() => {
          setActiveAnimations(prev => ({ ...prev, [goal.id]: false }));
        }, 1500); // 1.5s animation
      }

      // Hide custom input and fetch
      setShowCustomInputs(prev => ({ ...prev, [goal.id]: false }));
      setCustomAmounts(prev => ({ ...prev, [goal.id]: '' }));
      fetchGoals();

    } catch (err) {
      alert('Failed to add contribution. Ensure amount is valid.');
    }
  };

  const toggleHistory = (id) => {
    setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculations for Summary
  const totalSaved = goals.reduce((acc, g) => acc + parseFloat(g.current_amount), 0);
  const activeGoalsCount = goals.filter(g => parseFloat(g.current_amount) < parseFloat(g.target_amount)).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  let thisMonthContributions = 0;
  goals.forEach(goal => {
    if (goal.contributions) {
      goal.contributions.forEach(c => {
        const d = new Date(c.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          thisMonthContributions += parseFloat(c.amount);
        }
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in-up max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
            <PiggyBank className="w-7 h-7 text-[var(--color-brand-primary)]" />
            Financial Goals
          </h1>
          <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">
            Track your savings, investments, and financial milestones.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-brand-primary)]/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[var(--color-brand-border)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Saved</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSaved)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[var(--color-brand-border)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Goals</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeGoalsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[var(--color-brand-border)] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(thisMonthContributions)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Goal List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[var(--color-brand-border)]">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Set your first financial goal</h3>
          <p className="text-gray-500 mb-6">Start your journey by setting a savings or investment goal.</p>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-brand-primary)]/90 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const currentAmount = parseFloat(goal.current_amount);
            const targetAmount = parseFloat(goal.target_amount);
            const progress = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
            const isCompleted = progress >= 100;
            const meta = CATEGORY_META[goal.category] || CATEGORY_META['other'];
            const Icon = meta.icon;

            // Pace calculation
            let paceStatus = null;
            if (goal.target_date && !isCompleted && currentAmount > 0) {
              const start = new Date(goal.created_at).getTime();
              const target = new Date(goal.target_date).getTime();
              const now = Date.now();
              
              if (now < target && target > start) {
                const totalDuration = target - start;
                const elapsedDuration = now - start;
                const expectedProgress = (elapsedDuration / totalDuration) * 100;
                
                if (progress >= expectedProgress) {
                  paceStatus = { text: 'On track', color: 'text-emerald-600' };
                } else {
                  paceStatus = { text: 'Behind schedule', color: 'text-amber-600' };
                }
              }
            }

            return (
              <div key={goal.id} className="bg-white rounded-xl p-6 border border-[var(--color-brand-border)] shadow-sm relative overflow-hidden group flex flex-col">
                {/* Actions (Hover) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(goal)} className="p-1.5 text-gray-400 hover:text-[var(--color-brand-primary)] bg-gray-50 rounded-md hover:bg-indigo-50"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-md hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>

                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4 pr-16">
                  <div className={`p-2 rounded-lg ${meta.bg} ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{goal.title}</h3>
                    <span className={`text-xs font-medium uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6 flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">{formatCurrency(currentAmount)}</span>
                    <span className="text-gray-500">Target: {formatCurrency(targetAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-[var(--color-brand-primary)]'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs font-medium">
                      {paceStatus && <span className={paceStatus.color}>{paceStatus.text}</span>}
                      {!paceStatus && goal.target_date && <span className="text-gray-400">By {new Date(goal.target_date).toLocaleDateString()}</span>}
                    </div>
                    <div className={`text-xs font-bold transition-transform duration-300 ${activeAnimations[goal.id] ? 'scale-150 text-[var(--color-brand-secondary)]' : 'text-[var(--color-brand-primary)]'}`}>
                      {progress}%
                    </div>
                  </div>
                </div>

                {/* Contribution Buttons */}
                {!isCompleted && (
                  <div className="space-y-3">
                    {showCustomInputs[goal.id] ? (
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Amount ₹"
                          value={customAmounts[goal.id] || ''}
                          onChange={e => setCustomAmounts(prev => ({...prev, [goal.id]: e.target.value}))}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-[var(--color-brand-primary)]"
                        />
                        <button 
                          onClick={() => handleAddContribution(goal, parseFloat(customAmounts[goal.id]))}
                          className="px-4 py-2 bg-[var(--color-brand-primary)] text-white font-medium rounded-lg text-sm"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => setShowCustomInputs(prev => ({...prev, [goal.id]: false}))}
                          className="px-3 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAddContribution(goal, 1000)}
                          className="flex-1 py-2 bg-indigo-50 text-[var(--color-brand-primary)] font-semibold rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                        >
                          + ₹1,000
                        </button>
                        <button 
                          onClick={() => handleAddContribution(goal, 5000)}
                          className="flex-1 py-2 bg-indigo-50 text-[var(--color-brand-primary)] font-semibold rounded-lg text-sm hover:bg-indigo-100 transition-colors"
                        >
                          + ₹5,000
                        </button>
                        <button 
                          onClick={() => setShowCustomInputs(prev => ({...prev, [goal.id]: true}))}
                          className="flex-1 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          Custom
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* History Toggle */}
                {goal.contributions && goal.contributions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-brand-border)]">
                    <button 
                      onClick={() => toggleHistory(goal.id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Recent Contributions
                      {expandedHistory[goal.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedHistory[goal.id] && (
                      <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {[...goal.contributions].reverse().map(c => (
                          <div key={c.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-md">
                            <span className="text-gray-500">{new Date(c.date).toLocaleDateString()}</span>
                            <span className="font-bold text-gray-900 text-green-600">+{formatCurrency(c.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Title</label>
                <input 
                  required 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--color-brand-primary)]" 
                  placeholder="e.g. Dream Home Downpayment" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--color-brand-primary)] bg-white"
                >
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Amount (₹)</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    value={formData.target_amount}
                    onChange={e => setFormData({...formData, target_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--color-brand-primary)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Starting Saved (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    disabled={!!editingGoal} // Only allow setting current amount on creation
                    value={formData.current_amount}
                    onChange={e => setFormData({...formData, current_amount: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--color-brand-primary)] disabled:bg-gray-100" 
                    placeholder="0"
                  />
                  {editingGoal && <p className="text-[10px] text-gray-400 mt-1">Use the card to add funds.</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Date (Optional)</label>
                <input 
                  type="date" 
                  value={formData.target_date}
                  onChange={e => setFormData({...formData, target_date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md outline-none focus:border-[var(--color-brand-primary)]" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-md font-medium">
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
