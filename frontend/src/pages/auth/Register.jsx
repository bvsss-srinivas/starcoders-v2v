import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirm: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.password !== formData.password_confirm) {
            newErrors.password_confirm = "Passwords do not match.";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        const result = await register(formData);
        
        if (!result.success) {
            setErrors(result.errors || { general: "Registration failed. Please try again." });
        }
        setIsSubmitting(false);
    };

    return (
        <AuthLayout 
            title="Create your account" 
            subtitle="Start accelerating your career today."
            bottomText="Already have an account?"
            bottomLinkText="Sign in"
            bottomLinkTo="/login"
        >
            {/* Global Errors */}
            {(errors.general || errors.non_field_errors || errors.detail) && (
                <div className="mb-6 flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-status-error)]/10 p-3 text-sm text-[var(--color-status-error)] border border-[var(--color-status-error)]/20">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="flex flex-col">
                        {errors.general && <span>{errors.general}</span>}
                        {errors.non_field_errors && <span>{errors.non_field_errors[0]}</span>}
                        {errors.detail && <span>{errors.detail}</span>}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="First Name"
                        type="text"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>
                
                <Input
                    label="Username"
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username ? errors.username[0] : null}
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email ? errors.email[0] : null}
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    error={errors.phone_number ? errors.phone_number[0] : null}
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password ? (Array.isArray(errors.password) ? errors.password[0] : errors.password) : null}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="password_confirm"
                    required
                    value={formData.password_confirm}
                    onChange={handleChange}
                    error={errors.password_confirm}
                />

                <Button
                    type="submit"
                    className="w-full mt-2"
                    isLoading={isSubmitting}
                >
                    Create Account
                </Button>
            </form>
        </AuthLayout>
    );
}
