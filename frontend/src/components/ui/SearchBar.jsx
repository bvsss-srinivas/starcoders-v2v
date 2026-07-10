import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Search, BriefcaseBusiness, MessageSquare, FileText } from 'lucide-react';
import api from '../../api/axiosConfig';

export function SearchBar({ className, ...props }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Handle Cmd+K / Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/dashboard/search/?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (url) => {
    navigate(url);
    setIsOpen(false);
    setQuery('');
  };

  const hasResults = results && (results.jobs.length > 0 || results.community.length > 0 || results.resumes.length > 0);

  return (
    <div ref={wrapperRef} className={cn("relative flex items-center w-full max-w-md", className)}>
      <Search className="absolute left-3 h-4 w-4 text-[var(--color-brand-text-muted)]" />
      <input
        id="global-search-input"
        type="text"
        placeholder="Search jobs, forum, resumes... (⌘K)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
            if (query.trim() && results) setIsOpen(true);
        }}
        className="h-9 w-full rounded-[var(--radius-sm)] border border-transparent bg-gray-100 pl-9 pr-4 text-sm transition-all focus:border-[var(--color-brand-border)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] placeholder:text-[var(--color-brand-text-muted)]"
        {...props}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] flex flex-col animate-fade-in-up">
            <div className="overflow-y-auto p-2">
                {isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : !hasResults ? (
                    <div className="p-4 text-center text-sm text-gray-500">No results found for "{query}"</div>
                ) : (
                    <div className="space-y-4">
                        {/* Jobs */}
                        {results.jobs.length > 0 && (
                            <div>
                                <h4 className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jobs</h4>
                                {results.jobs.map(job => (
                                    <button 
                                        key={`job-${job.id}`}
                                        onClick={() => handleResultClick(job.url)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-start gap-3 transition-colors"
                                    >
                                        <BriefcaseBusiness className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{job.subtitle}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Community */}
                        {results.community.length > 0 && (
                            <div>
                                <h4 className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Community</h4>
                                {results.community.map(post => (
                                    <button 
                                        key={`post-${post.id}`}
                                        onClick={() => handleResultClick(post.url)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-start gap-3 transition-colors"
                                    >
                                        <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{post.subtitle}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Resumes */}
                        {results.resumes.length > 0 && (
                            <div>
                                <h4 className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Resumes</h4>
                                {results.resumes.map(resume => (
                                    <button 
                                        key={`resume-${resume.id}`}
                                        onClick={() => handleResultClick(resume.url)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-start gap-3 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-[var(--color-status-success)] mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{resume.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{resume.subtitle}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
