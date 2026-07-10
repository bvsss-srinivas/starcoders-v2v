import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ActionModal } from '../../../components/ui/ActionModal';
import { User, Link as LinkIcon, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import api from '../../../api/axiosConfig';

export default function ProfileSettings() {
    const { user, setUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        avatar_url: user?.avatar_url || '',
        bio: '',
        education_level: '',
        current_role: '',
        stem_field: '',
        location: '',
        linkedin_url: '',
        resume_url: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profiles/me/');
                setFormData(prev => ({ 
                    ...prev, 
                    ...res.data,
                    first_name: user?.first_name || '',
                    last_name: user?.last_name || '',
                    avatar_url: user?.avatar_url || ''
                }));
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        if (user) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Update User Profile details
            await api.put('/profiles/me/', {
                bio: formData.bio,
                education_level: formData.education_level,
                current_role: formData.current_role,
                stem_field: formData.stem_field,
                location: formData.location,
                linkedin_url: formData.linkedin_url,
                resume_url: formData.resume_url,
            });

            const res = await api.put('/users/me/', {
                first_name: formData.first_name,
                last_name: formData.last_name
            });

            setUser(res.data);
            setShowSuccess(true);
        } catch (err) {
            console.error("Failed to save profile", err);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-xl font-display font-semibold text-[var(--color-brand-text)] mb-1">Public Profile</h2>
                <p className="text-sm text-[var(--color-brand-text-muted)]">This is how others will see you on the platform.</p>
            </div>

            <div className="flex items-center gap-6 pb-6 border-b border-[var(--color-brand-border)]">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] flex items-center justify-center text-white text-3xl font-display font-bold shadow-inner overflow-hidden shrink-0">
                    {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        user?.first_name?.[0] || 'U'
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[var(--color-brand-text)]">{formData.first_name} {formData.last_name}</h3>
                    <p className="text-sm text-[var(--color-brand-text-muted)]">{formData.current_role || 'Update your profile to stand out'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="First Name" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleChange} 
                        icon={<User className="h-4 w-4" />}
                    />
                    <Input 
                        label="Last Name" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleChange} 
                        icon={<User className="h-4 w-4" />}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--color-brand-text)]">Bio</label>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="flex w-full rounded-md border border-[var(--color-brand-border)] bg-[var(--color-brand-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-shadow resize-y"
                        placeholder="Write a few sentences about yourself..."
                    ></textarea>
                    <p className="text-xs text-[var(--color-brand-text-muted)]">Brief description for your profile. URLs are hyperlinked.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Current Role" 
                        name="current_role" 
                        value={formData.current_role} 
                        onChange={handleChange} 
                        icon={<Briefcase className="h-4 w-4" />}
                    />
                    <Input 
                        label="STEM Field" 
                        name="stem_field" 
                        value={formData.stem_field} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Education Level" 
                        name="education_level" 
                        value={formData.education_level} 
                        onChange={handleChange} 
                        icon={<GraduationCap className="h-4 w-4" />}
                    />
                    <Input 
                        label="Location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        icon={<MapPin className="h-4 w-4" />}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="LinkedIn URL" 
                        name="linkedin_url" 
                        type="url"
                        value={formData.linkedin_url} 
                        onChange={handleChange} 
                        icon={<LinkIcon className="h-4 w-4" />}
                    />
                    <Input 
                        label="Personal Website (Resume)" 
                        name="resume_url" 
                        type="url"
                        value={formData.resume_url}
                        onChange={handleChange}
                        placeholder="https://"
                        icon={<LinkIcon className="h-4 w-4" />}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost">Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button>
                </div>
            </form>

            <ActionModal 
                isOpen={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                title="Profile Updated!" 
                message="Your public profile changes have been successfully saved to your account." 
            />
        </div>
    );
}
