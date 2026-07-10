import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../../components/ui/Button';
import { Send, Bot, User, Sparkles, Briefcase, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../api/axiosConfig';

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: "Hi there! I'm your ElevateHer AI career coach. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        const newUserMessage = { id: Date.now(), role: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            const apiMessages = updatedMessages.map(m => ({
                role: m.role,
                text: m.text
            }));
            
            const res = await api.post('/ai/chat/', { messages: apiMessages });
            
            const newAIMessage = { 
                id: Date.now() + 1, 
                role: 'assistant', 
                text: res.data.response, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            };
            setMessages(prev => [...prev, newAIMessage]);
        } catch (err) {
            console.error("AI Chat Error", err);
            const errorMessage = err.response?.data?.error || "I'm having trouble connecting to my server right now. Please try again later.";
            const errorMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: errorMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestions = [
        { icon: Briefcase, text: "Help me prepare for a PM interview" },
        { icon: FileText, text: "Review my latest resume" },
        { icon: Sparkles, text: "How do I negotiate salary?" }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] overflow-hidden mx-4 sm:mx-6 lg:mx-8 my-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-brand-border)] bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">Career AI Coach</h2>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-status-success)]">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-status-success)] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-status-success)]"></span>
                            </span>
                            Online
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-brand-background)]">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", msg.role === 'user' ? "bg-gray-200 text-gray-600" : "bg-[var(--color-brand-primary)] text-white")}>
                                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-md",
                                    msg.role === 'user' ? "bg-[var(--color-brand-primary)] text-white rounded-tr-sm" : "bg-white border border-[var(--color-brand-border)] text-[var(--color-brand-text)] rounded-tl-sm shadow-sm prose prose-sm max-w-none"
                                )}>
                                    {msg.role === 'user' ? (
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    ) : (
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]} 
                                            className="text-sm leading-relaxed prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-[var(--color-brand-primary)]"
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-white border border-[var(--color-brand-border)] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--color-brand-border)] bg-white">
                <div className="max-w-3xl mx-auto">
                    {messages.length === 1 && !isTyping && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestions.map((s, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => {
                                        setInputValue(s.text);
                                        // A small timeout to ensure state is updated before sending
                                        setTimeout(() => {
                                            document.getElementById('ai-chat-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                        }, 50);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/20 rounded-full hover:bg-[var(--color-brand-primary)]/10 transition-colors"
                                >
                                    <s.icon className="h-3 w-3" />
                                    {s.text}
                                </button>
                            ))}
                        </div>
                    )}
                    <form id="ai-chat-form" onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message AI Coach..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-[var(--color-brand-border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-[var(--color-brand-primary)] transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white hover:bg-[#4a3ded] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-gray-400 mt-2">AI can make mistakes. Consider verifying important information.</p>
                </div>
            </div>
        </div>
    );
}
