import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldX, Clock, CheckCircle2, XCircle, Eye, Search, Filter, AlertCircle, Download, RefreshCw, Users, FileCheck2, FileX2, Hourglass, Flag, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const STATUS_COLORS = {
  pending:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  verified: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  rejected: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'   },
};

const ID_TYPE_LABELS = {
  aadhaar:         'Aadhaar Card',
  passport:        'Passport',
  driving_licence: 'Driving Licence',
  voter_id:        'Voter ID',
  other:           'Other',
};

export default function AdminVerification() {
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' or 'moderation'

  // Verifications State
  const [verifications, setVerifications] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  // Reject modal
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Moderation State
  const [reports, setReports] = useState([]);
  const [isReportsLoading, setIsReportsLoading] = useState(true);

  const fetchVerifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/verification/admin/');
      setVerifications(res.data.results ?? res.data);
    } catch (err) {
      setError('Failed to load verifications. Make sure you are logged in as an admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    setIsReportsLoading(true);
    try {
      const res = await api.get('/community/admin/reports/');
      setReports(res.data.results ?? res.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setIsReportsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
    fetchReports();
  }, []);

  useEffect(() => {
    let list = [...verifications];
    if (statusFilter !== 'all') list = list.filter(v => v.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(v =>
        v.user?.email?.toLowerCase().includes(q) ||
        v.user?.first_name?.toLowerCase().includes(q) ||
        v.user?.last_name?.toLowerCase().includes(q)
      );
    }
    setFilteredList(list);
  }, [verifications, statusFilter, searchQuery]);

  const handleApprove = async (id, email) => {
    if (!window.confirm(`Approve verification for ${email}?`)) return;
    setActionLoading(id + '_approve');
    try {
      await api.post(`/verification/admin/${id}/approve/`);
      setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'verified' } : v));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to approve.');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id, email) => {
    setRejectModal({ id, email });
    setRejectReason('');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { alert('Please provide a rejection reason.'); return; }
    setActionLoading(rejectModal.id + '_reject');
    try {
      await api.post(`/verification/admin/${rejectModal.id}/reject/`, { reason: rejectReason });
      setVerifications(prev => prev.map(v =>
        v.id === rejectModal.id ? { ...v, status: 'rejected', rejection_reason: rejectReason } : v
      ));
      setRejectModal(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to reject.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadDocument = async (id, email) => {
    try {
      const res = await api.get(`/verification/admin/${id}/document/`, { responseType: 'blob' });
      
      const mimeType = res.data.type || 'application/pdf';
      let ext = 'pdf';
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('png')) ext = 'png';
      
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mimeType }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `verification_${email}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download document.');
    }
  };

  const handleResolveReport = async (id) => {
    try {
      await api.post(`/community/admin/reports/${id}/resolve/`);
      setReports(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
    } catch (err) {
      alert("Failed to resolve report");
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm("Delete this reported content? This cannot be undone.")) return;
    try {
      await api.post(`/community/admin/reports/${id}/delete_content/`);
      setReports(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
    } catch (err) {
      alert("Failed to delete content");
    }
  };

  const stats = {
    total:    verifications.length,
    pending:  verifications.filter(v => v.status === 'pending').length,
    verified: verifications.filter(v => v.status === 'verified').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[var(--color-brand-primary)]" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">
            Review user verifications and moderate community content
          </p>
        </div>
        <button
          onClick={() => { fetchVerifications(); fetchReports(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-brand-border)] text-sm text-[var(--color-brand-text-muted)] hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-brand-border)] gap-6">
        <button 
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'verifications' ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Verifications
        </button>
        <button 
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'moderation' ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Community Moderation
          {reports.filter(r => !r.resolved).length > 0 && (
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {reports.filter(r => !r.resolved).length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'verifications' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total,    icon: Users,      color: 'text-[var(--color-brand-primary)]', bg: 'bg-[var(--color-brand-primary)]/10' },
              { label: 'Pending',  value: stats.pending,  icon: Hourglass,  color: 'text-amber-600',  bg: 'bg-amber-50' },
              { label: 'Verified', value: stats.verified, icon: FileCheck2, color: 'text-green-600',  bg: 'bg-green-50' },
              { label: 'Rejected', value: stats.rejected, icon: FileX2,    color: 'text-red-600',    bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[var(--color-brand-border)] p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-brand-text)]">{s.value}</p>
                  <p className="text-xs text-[var(--color-brand-text-muted)]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-[var(--color-brand-border)] p-4 flex flex-wrap gap-3 items-center shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              {['all', 'pending', 'verified', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    statusFilter === s
                      ? 'bg-[var(--color-brand-primary)] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading verifications...</p>
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-12 h-12 text-gray-200" />
                <p className="text-sm text-gray-400">No verification records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['User', 'ID Type', 'Submitted', 'Status', 'Document', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredList.map(v => {
                      const col = STATUS_COLORS[v.status] || STATUS_COLORS.pending;
                      const isLoadingApprove = actionLoading === v.id + '_approve';
                      const isLoadingReject  = actionLoading === v.id + '_reject';
                      return (
                        <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center text-[var(--color-brand-primary)] font-bold text-sm">
                                {v.user?.first_name?.[0] || v.user?.email?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="font-medium text-[var(--color-brand-text)]">
                                  {v.user?.first_name && v.user?.last_name
                                    ? `${v.user.first_name} ${v.user.last_name}`
                                    : v.user?.username || '—'}
                                </p>
                                <p className="text-xs text-gray-400">{v.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{ID_TYPE_LABELS[v.id_type] || v.id_type || '—'}</td>
                          <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(v.submitted_at)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${col.bg} ${col.text} ${col.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`}></span>
                              {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                            </span>
                            {v.status === 'rejected' && v.rejection_reason && (
                              <p className="text-xs text-red-500 mt-1 max-w-[160px] truncate" title={v.rejection_reason}>
                                {v.rejection_reason}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {v.id_type ? (
                              <button onClick={() => handleDownloadDocument(v.id, v.user?.email)} className="flex items-center gap-1.5 text-xs text-[var(--color-brand-primary)] font-medium hover:underline">
                                <Download className="w-3.5 h-3.5" /> Download
                              </button>
                            ) : (<span className="text-xs text-gray-400">No document</span>)}
                          </td>
                          <td className="px-5 py-4">
                            {v.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleApprove(v.id, v.user?.email)} disabled={isLoadingApprove} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">
                                  {isLoadingApprove ? <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve
                                </button>
                                <button onClick={() => openRejectModal(v.id, v.user?.email)} disabled={isLoadingReject} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">{v.status === 'verified' ? '✅ Approved' : '❌ Rejected'}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm overflow-hidden">
            {isReportsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-[var(--color-brand-primary)]/20 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <Flag className="w-12 h-12 text-gray-200" />
                <p className="text-sm text-gray-400">No community reports found. All good!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report Info</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 capitalize text-red-600">{r.reason}</p>
                          <p className="text-xs text-gray-500 mb-1">By {r.reporter?.first_name || r.reporter?.email}</p>
                          {r.details && <p className="text-xs text-gray-600 italic">"{r.details}"</p>}
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                        </td>
                        <td className="px-5 py-4">
                          {r.post ? (
                            <div>
                              <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded uppercase text-gray-600">Post</span>
                              <p className="font-semibold text-gray-900 mt-1">{r.post_title}</p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded uppercase text-gray-600">Comment</span>
                              <p className="text-gray-600 mt-1 line-clamp-2">{r.comment_content}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {r.resolved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold">
                              <AlertCircle className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {!r.resolved && (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleResolveReport(r.id)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-xs font-bold transition-colors"
                              >
                                Dismiss
                              </button>
                              <button 
                                onClick={() => handleDeleteContent(r.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Delete Content
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reject Verification</h3>
                <p className="text-xs text-gray-500">{rejectModal.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Provide a clear reason. This will be shown directly to the user so they can fix and resubmit.
            </p>
            <textarea
              autoFocus
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. The document image is blurry. Please upload a clear, readable photo of your ID."
              className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-300 focus:border-transparent outline-none bg-gray-50"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
