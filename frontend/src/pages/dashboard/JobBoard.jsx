import React, { useState, useEffect } from 'react';
import { BriefcaseBusiness, Search, MapPin, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/');
        setJobs(res.data.results || res.data);
      } catch (err) {
        console.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);



  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
            <BriefcaseBusiness className="w-7 h-7 text-[var(--color-brand-primary)]" />
            Curated Job Board
          </h1>
          <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">
            Opportunities matched to your skills and preferences.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[var(--color-brand-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
      </div>

      {/* Job List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[var(--color-brand-border)]">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl p-5 border border-[var(--color-brand-border)] hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[var(--color-brand-text)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[var(--color-brand-text-muted)] font-medium mt-1">
                    {job.company}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-[var(--color-brand-primary)] text-xs font-semibold rounded-md">
                  {job.job_type}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> {job.salary}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">
                {job.description}
              </p>
              
              <button 
                onClick={() => {
                  if (job.apply_url) {
                    window.open(job.apply_url, '_blank', 'noopener,noreferrer');
                  } else {
                    alert('This job does not have an external application link.');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] rounded-lg font-semibold hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
