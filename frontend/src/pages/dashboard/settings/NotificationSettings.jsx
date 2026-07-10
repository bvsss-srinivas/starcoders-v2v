import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { ActionModal } from '../../../components/ui/ActionModal';
import { Bell, Mail, Smartphone, Users, Briefcase, GraduationCap, PiggyBank } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function NotificationSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Flat state for easy UI binding
    const [settings, setSettings] = useState({
        community_email: true,
        community_push: true,
        jobs_email: true,
        jobs_push: true,
        mentorship_email: true,
        mentorship_push: true,
        courses_email: true,
        courses_push: true,
        finance_email: true,
        finance_push: true,
        verification_email: true,
        verification_push: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/users/settings/');
                const notifs = res.data.notifications || {};
                
                // Map nested API response to flat state
                setSettings({
                    community_email: notifs.community?.email ?? true,
                    community_push: notifs.community?.in_app ?? true,
                    jobs_email: notifs.jobs?.email ?? true,
                    jobs_push: notifs.jobs?.in_app ?? true,
                    mentorship_email: notifs.interviews?.email ?? true,
                    mentorship_push: notifs.interviews?.in_app ?? true,
                    courses_email: notifs.courses?.email ?? true,
                    courses_push: notifs.courses?.in_app ?? true,
                    finance_email: notifs.finance?.email ?? true,
                    finance_push: notifs.finance?.in_app ?? true,
                    verification_email: notifs.verification?.email ?? true,
                    verification_push: notifs.verification?.in_app ?? true,
                });
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    const toggleSetting = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // Map flat state back to nested API payload
            const payload = {
                notifications: {
                    community: { email: settings.community_email, in_app: settings.community_push },
                    jobs: { email: settings.jobs_email, in_app: settings.jobs_push },
                    interviews: { email: settings.mentorship_email, in_app: settings.mentorship_push },
                    courses: { email: settings.courses_email, in_app: settings.courses_push },
                    finance: { email: settings.finance_email, in_app: settings.finance_push },
                    verification: { email: settings.verification_email, in_app: settings.verification_push },
                }
            };
            
            await api.put('/users/settings/', payload);
            setShowSuccess(true);
        } catch (err) {
            console.error("Failed to save settings", err);
            alert("Failed to update preferences.");
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        {
            title: "Mentorship & Coaching",
            icon: <Users className="h-5 w-5 text-[var(--color-brand-primary)]" />,
            desc: "Session reminders, new mentor matches, and feedback requests.",
            key: "mentorship"
        },
        {
            title: "Education Hub",
            icon: <GraduationCap className="h-5 w-5 text-[var(--color-brand-primary)]" />,
            desc: "Course progress reminders, new module unlocks, and certificates.",
            key: "courses"
        },
        {
            title: "Career Growth",
            icon: <Briefcase className="h-5 w-5 text-[var(--color-brand-primary)]" />,
            desc: "Job application updates, new matches, and interview prep.",
            key: "jobs"
        },
        {
            title: "Financial Literacy",
            icon: <PiggyBank className="h-5 w-5 text-[var(--color-brand-primary)]" />,
            desc: "Goal milestones, budget alerts, and new finance modules.",
            key: "finance"
        },
        {
            title: "Community Forum",
            icon: <Bell className="h-5 w-5 text-[var(--color-brand-primary)]" />,
            desc: "Replies to your posts, group announcements, and trending topics.",
            key: "community"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-xl font-display font-semibold text-[var(--color-brand-text)] mb-1">Notification Preferences</h2>
                <p className="text-sm text-[var(--color-brand-text-muted)]">Choose what updates you want to receive and where.</p>
            </div>

            <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-[var(--radius-lg)] overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-background)] font-medium text-sm text-[var(--color-brand-text-muted)]">
                    <div className="col-span-8 md:col-span-6">Category</div>
                    <div className="col-span-4 md:col-span-3 text-center flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" /> <span className="hidden md:inline">Email</span>
                    </div>
                    <div className="col-span-hidden md:col-span-3 md:flex text-center items-center justify-center gap-2 hidden">
                        <Smartphone className="h-4 w-4" /> <span>Push</span>
                    </div>
                </div>

                <div className="divide-y divide-[var(--color-brand-border)]">
                    {sections.map((section, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors">
                            <div className="col-span-8 md:col-span-6 flex gap-4">
                                <div className="mt-1">{section.icon}</div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-brand-text)] mb-0.5">{section.title}</h4>
                                    <p className="text-xs text-[var(--color-brand-text-muted)] leading-relaxed">{section.desc}</p>
                                </div>
                            </div>
                            
                            {/* Email Toggle */}
                            <div className="col-span-4 md:col-span-3 flex justify-center">
                                <button 
                                    type="button"
                                    onClick={() => toggleSetting(`${section.key}_email`)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 ${settings[`${section.key}_email`] ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[`${section.key}_email`] ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Push Toggle */}
                            <div className="col-span-12 md:col-span-3 md:flex justify-center hidden">
                                <button 
                                    type="button"
                                    onClick={() => toggleSetting(`${section.key}_push`)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 ${settings[`${section.key}_push`] ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[`${section.key}_push`] ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button variant="primary" onClick={handleSubmit} isLoading={isSaving}>
                    Save Preferences
                </Button>
            </div>

            <ActionModal 
                isOpen={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                title="Preferences Saved!" 
                message="Your notification preferences have been successfully updated." 
            />
        </div>
    );
}
