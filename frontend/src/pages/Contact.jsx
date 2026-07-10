import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Just UI for now
        console.log("Form submitted", formData);
        alert("Thanks for reaching out! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 page-enter-active">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-brand-text)]">Get in Touch</h1>
                <p className="text-lg text-[var(--color-brand-text-muted)] max-w-2xl mx-auto">
                    Whether you have a question about courses, want to partner with us, or need technical support, our team is here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Left Column: Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-display font-semibold mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-[var(--radius-md)]">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-brand-text)]">Email Us</h4>
                                    <p className="text-[var(--color-brand-text-muted)]">hello@elevateher.com</p>
                                    <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">We aim to respond within 24 hours.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] rounded-[var(--radius-md)]">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-brand-text)]">Call Us</h4>
                                    <p className="text-[var(--color-brand-text-muted)]">+1 (555) 123-4567</p>
                                    <p className="text-sm text-[var(--color-brand-text-muted)] mt-1">Mon-Fri from 9am to 6pm PT.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[var(--color-status-success)]/10 text-[var(--color-status-success)] rounded-[var(--radius-md)]">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-brand-text)]">Visit Us</h4>
                                    <p className="text-[var(--color-brand-text-muted)]">100 Tech Hub Blvd, Suite 400</p>
                                    <p className="text-[var(--color-brand-text-muted)]">San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[var(--color-brand-border)]">
                        <h3 className="font-display font-semibold mb-4">Follow our journey</h3>
                        <div className="flex gap-4">
                            {/* Placeholder social circles */}
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] flex items-center justify-center text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-primary)] hover:border-[var(--color-brand-primary)] transition-colors cursor-pointer shadow-sm">
                                    <MessageSquare className="h-4 w-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="bg-[var(--color-brand-surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-brand-border)] shadow-[var(--shadow-md)]">
                    <h2 className="text-2xl font-display font-semibold mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input 
                            label="Full Name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                            placeholder="Jane Doe"
                        />
                        <Input 
                            label="Email Address" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            placeholder="jane@example.com"
                        />
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--color-brand-text)]">Subject</label>
                            <select 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow"
                            >
                                <option>General Inquiry</option>
                                <option>Partnership</option>
                                <option>Technical Support</option>
                                <option>Mentorship</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--color-brand-text)]">Message</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="How can we help you?"
                                className="flex w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow resize-y"
                            ></textarea>
                        </div>

                        <Button type="submit" className="w-full mt-2 group">
                            <Send className="mr-2 h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
