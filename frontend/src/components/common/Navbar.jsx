import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../ui/SearchBar';
import { Bell, Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

export function Navbar({ openMobileSidebar }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/community/notifications/');
        const allNotifs = res.data.results || res.data;
        setNotifications(allNotifs.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put('/community/notifications/mark-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-brand-border)] bg-[var(--color-brand-surface)]/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={openMobileSidebar}
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block w-64"></div>
      </div>

      <div className="flex flex-1 items-center justify-center max-w-md px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative">
        {user?.verification_status === 'verified' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-semibold mr-2 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </div>
        )}
        
        <div className="relative">
          <button 
            onClick={handleOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-[var(--color-brand-text-muted)] transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-status-error)] border-2 border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)] hover:underline">
                        Mark all as read
                    </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-indigo-50/30' : ''}`}>
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-[var(--color-brand-border)] mx-1 hidden sm:block"></div>

        <Link to="/dashboard/settings/profile" className="flex items-center gap-2 rounded-full hover:bg-gray-50 p-1 pr-2 transition-colors border border-transparent hover:border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[var(--color-brand-primary)]">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block">
            {user?.username || 'Profile'}
          </span>
        </Link>
        <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors hidden sm:block ml-2">
          Logout
        </button>
      </div>
    </header>
  );
}
