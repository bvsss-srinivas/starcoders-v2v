import React, { useState, useEffect, useCallback } from 'react';
import { Users, MessageSquare, Clock, Send, ThumbsUp, Filter, Search, MoreVertical, Flag, ShieldAlert, CheckCircle, ArrowLeft, Plus } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

// Simple debounce helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

export default function CommunityForum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering and Sorting
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // New Post Modal
  const [isComposing, setIsComposing] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });

  // Thread View
  const [activePost, setActivePost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  
  // Report Modal
  const [reportModal, setReportModal] = useState(null); // { type: 'post'|'comment', id: number, post_id?: number }
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        category: categoryFilter,
        sort: sortOption,
        search: debouncedSearch
      });
      const res = await api.get(`/community/posts/?${params.toString()}`);
      setPosts(res.data.results || res.data);
      
      // If a post is active, try to update it silently so we get new comments/upvotes
      if (activePost) {
        const updatedPost = (res.data.results || res.data).find(p => p.id === activePost.id);
        if (updatedPost) setActivePost(updatedPost);
      }
    } catch (err) {
      console.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, sortOption, debouncedSearch, activePost]);

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, sortOption, debouncedSearch]); // intentionally not including fetchPosts

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    try {
      await api.post('/community/posts/', newPost);
      setIsComposing(false);
      setNewPost({ title: '', content: '', category: 'general' });
      
      // Reset filters to show the new post
      setCategoryFilter('all');
      setSortOption('recent');
      setSearchQuery('');
      
      fetchPosts();
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      await api.post(`/community/posts/${activePost.id}/comments/`, { content: commentContent });
      setCommentContent('');
      fetchPosts(); // will also update activePost due to useCallback logic
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  const handleUpvotePost = async (e, postId) => {
    e.stopPropagation();
    try {
      await api.post(`/community/posts/${postId}/toggle_upvote/`);
      fetchPosts();
    } catch (err) {
      alert("Failed to upvote.");
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      await api.post(`/community/posts/${activePost.id}/comments/${commentId}/toggle_upvote/`);
      fetchPosts();
    } catch (err) {
      alert("Failed to upvote comment.");
    }
  };

  const handleMarkBestAnswer = async (commentId) => {
    try {
      await api.post(`/community/posts/${activePost.id}/comments/${commentId}/mark_best/`);
      fetchPosts();
    } catch (err) {
      alert("Failed to mark best answer.");
    }
  };

  const submitReport = async () => {
    try {
      const url = reportModal.type === 'post' 
        ? `/community/posts/${reportModal.id}/report/`
        : `/community/posts/${reportModal.post_id}/comments/${reportModal.id}/report/`;
      
      await api.post(url, { reason: reportReason, details: reportDetails });
      setReportModal(null);
      setReportReason('spam');
      setReportDetails('');
      alert("Report submitted successfully.");
    } catch (err) {
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
            <Users className="w-7 h-7 text-[var(--color-brand-primary)]" />
            Community Forum
          </h1>
          <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">
            Connect, ask questions, and share experiences with other women.
          </p>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-brand-primary)]/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-[var(--color-brand-border)] shadow-sm">
        <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
          <div className="flex gap-2 min-w-max">
            {['all', 'tech', 'finance', 'design', 'career', 'interviews', 'general'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                  categoryFilter === cat 
                    ? 'bg-[var(--color-brand-primary)] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] bg-gray-50"
          >
            <option value="recent">Most Recent</option>
            <option value="commented">Most Commented</option>
            <option value="unanswered">Unanswered</option>
          </select>
          
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* Posts List (Hides on mobile if a thread is active) */}
        <div className={`lg:col-span-1 xl:col-span-1 space-y-4 ${activePost ? 'hidden lg:block' : 'block'}`}>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse h-32"></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-[var(--color-brand-border)]">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No discussions found.</p>
              <p className="text-sm text-gray-400 mb-4">Be the first to ask!</p>
              <button 
                onClick={() => setIsComposing(true)}
                className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline"
              >
                Start a Discussion
              </button>
            </div>
          ) : (
            posts.map(post => (
              <div 
                key={post.id} 
                onClick={() => setActivePost(post)}
                className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:border-[var(--color-brand-primary)] flex gap-3 ${activePost?.id === post.id ? 'border-[var(--color-brand-primary)] ring-1 ring-[var(--color-brand-primary)]' : 'border-[var(--color-brand-border)] shadow-sm'}`}
              >
                {/* Upvote column */}
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={(e) => handleUpvotePost(e, post.id)}
                    className={`p-1.5 rounded-md flex flex-col items-center transition-colors ${post.has_upvoted ? 'text-[var(--color-brand-primary)] bg-indigo-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                  >
                    <ThumbsUp className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">{post.upvote_count}</span>
                  </button>
                </div>
                
                {/* Content column */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--color-brand-text)] mb-1 truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <img src={`https://ui-avatars.com/api/?name=${post.user?.first_name || 'U'}&background=random`} className="w-4 h-4 rounded-full" alt="avatar" />
                      <span className="truncate max-w-[100px]">{post.user?.first_name || 'Anonymous'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-gray-400">
                      <MessageSquare className="w-3.5 h-3.5" /> {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Thread View (Fills screen on mobile if active) */}
        <div className={`lg:col-span-2 xl:col-span-2 ${activePost ? 'block' : 'hidden lg:block'}`}>
          {activePost ? (
            <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm flex flex-col h-[75vh] sticky top-6 animate-fade-in-up">
              
              {/* Thread Header (Mobile Back Button) */}
              <div className="lg:hidden p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center">
                <button onClick={() => setActivePost(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4" /> Back to discussions
                </button>
              </div>

              {/* Main Post */}
              <div className="p-6 border-b border-[var(--color-brand-border)] relative group">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setReportModal({ type: 'post', id: activePost.id })} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-md hover:bg-red-50">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="px-2.5 py-1 bg-indigo-50 text-[var(--color-brand-primary)] text-xs font-bold rounded-md uppercase tracking-wider mb-3 inline-block">
                  {activePost.category}
                </span>
                <h3 className="font-bold text-xl mb-3 text-gray-900 pr-10">{activePost.title}</h3>
                
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
                  <img src={`https://ui-avatars.com/api/?name=${activePost.user?.first_name || 'U'}&background=random`} className="w-8 h-8 rounded-full" alt="avatar" />
                  <div>
                    <p className="font-semibold text-gray-900">{activePost.user?.first_name || 'Anonymous'}</p>
                    <p className="text-xs">{new Date(activePost.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{activePost.content}</p>
                
                <div className="mt-5 flex items-center gap-2">
                  <button 
                    onClick={(e) => handleUpvotePost(e, activePost.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${activePost.has_upvoted ? 'bg-indigo-50 text-[var(--color-brand-primary)] border-indigo-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {activePost.upvote_count} Upvotes
                  </button>
                </div>
              </div>

              {/* Comments Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Responses ({activePost.comments?.length || 0})</h4>
                
                {activePost.comments?.map(comment => (
                  <div key={comment.id} className={`p-4 rounded-xl border relative group ${comment.is_best_answer ? 'bg-green-50/50 border-green-200 shadow-sm' : 'bg-white border-gray-100 shadow-sm'}`}>
                    
                    {comment.is_best_answer && (
                      <div className="absolute -top-3 left-4 bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" /> BEST ANSWER
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user?.id === activePost.user?.id && !comment.is_best_answer && (
                        <button onClick={() => handleMarkBestAnswer(comment.id)} className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-[10px] font-bold">
                          Mark as Answer
                        </button>
                      )}
                      <button onClick={() => setReportModal({ type: 'comment', id: comment.id, post_id: activePost.id })} className="p-1 text-gray-400 hover:text-red-600 bg-gray-50 rounded hover:bg-red-50">
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${comment.user?.first_name || 'U'}&background=random`} className="w-8 h-8 rounded-full mt-1" alt="avatar" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{comment.user?.first_name || 'Anonymous'}</span>
                          <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pr-16">{comment.content}</p>
                        
                        <div className="mt-3 flex items-center gap-2">
                          <button 
                            onClick={() => handleUpvoteComment(comment.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.has_upvoted ? 'text-[var(--color-brand-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> {comment.upvote_count}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Composer */}
              <div className="p-4 border-t border-[var(--color-brand-border)] bg-white rounded-b-xl">
                <form onSubmit={handleCreateComment} className="flex gap-3">
                  <textarea 
                    rows="1"
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm bg-gray-50 focus:bg-white transition-colors resize-none custom-scrollbar"
                  />
                  <button type="submit" disabled={!commentContent.trim()} className="px-4 bg-[var(--color-brand-primary)] text-white rounded-xl disabled:opacity-50 hover:bg-[var(--color-brand-primary)]/90 transition-colors shrink-0 font-bold flex items-center gap-2">
                    <Send className="w-4 h-4" /> <span className="hidden sm:inline">Reply</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center h-[75vh] text-center p-6 sticky top-6 hidden lg:flex">
              <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="font-bold text-gray-500 mb-1 text-lg">Select a discussion</h3>
              <p className="text-sm text-gray-400 max-w-sm">Click on any post in the list to view the full thread, read answers, and join the conversation.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Start a Discussion</h2>
              <button onClick={() => setIsComposing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  required 
                  type="text" 
                  maxLength="255"
                  placeholder="What's your question or topic?" 
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  value={newPost.category}
                  onChange={e => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none bg-white text-sm"
                >
                  <option value="general">General</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="design">Design</option>
                  <option value="career">Career</option>
                  <option value="interviews">Interviews</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Details</label>
                <textarea 
                  required
                  rows="5"
                  maxLength="2000"
                  placeholder="Provide more context here..."
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none resize-none text-sm custom-scrollbar"
                ></textarea>
                <p className="text-right text-[10px] text-gray-400 mt-1">{newPost.content.length}/2000</p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsComposing(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={!newPost.title.trim() || !newPost.content.trim()} className="px-6 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-brand-primary)]/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  <Send className="w-4 h-4" /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Report Content</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Why are you reporting this {reportModal.type}? Your report will be sent to the moderation team.
            </p>
            <div className="space-y-4">
              <select 
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none bg-white text-sm font-medium"
              >
                <option value="spam">Spam or self-promotion</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="other">Other</option>
              </select>
              
              <textarea 
                rows="3"
                placeholder="Additional details (optional)"
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none resize-none text-sm"
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setReportModal(null)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={submitReport} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
