import React, { useState } from 'react';
import { Settings, User, Bell, Shield, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
        <Settings className="w-7 h-7 text-[var(--color-brand-primary)]" />
        Settings
      </h1>

      <div className="bg-white rounded-xl border border-[var(--color-brand-border)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-[var(--color-brand-border)] p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-indigo-50 text-[var(--color-brand-primary)]' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <User className="w-4 h-4" /> Account
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-indigo-50 text-[var(--color-brand-primary)]' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'privacy' ? 'bg-indigo-50 text-[var(--color-brand-primary)]' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Shield className="w-4 h-4" /> Privacy & Security
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" readOnly value={user?.first_name || ''} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" readOnly value={user?.last_name || ''} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" readOnly value={user?.email || ''} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500" />
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--color-brand-border)] mt-8">
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-bold">Job Matches</h4>
                    <p className="text-sm text-gray-500">Get notified when new jobs match your profile</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-[var(--color-brand-primary)] rounded" />
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-bold">Community Mentions</h4>
                    <p className="text-sm text-gray-500">Get notified when someone replies to your post</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-[var(--color-brand-primary)] rounded" />
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-bold">Goal Reminders</h4>
                    <p className="text-sm text-gray-500">Weekly update on your financial goals</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-[var(--color-brand-primary)] rounded" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Privacy & Security</h2>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-1">Profile Visibility</h4>
                  <p className="text-sm text-gray-500 mb-4">Control who can see your professional profile</p>
                  <select className="w-full md:w-auto px-4 py-2 border rounded-lg outline-none">
                    <option>Public (Visible to verified users)</option>
                    <option>Private (Only you)</option>
                  </select>
                </div>

                <div className="p-4 border border-red-100 bg-red-50 rounded-lg mt-8">
                  <h4 className="font-bold text-red-700 flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4" /> Danger Zone
                  </h4>
                  <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
