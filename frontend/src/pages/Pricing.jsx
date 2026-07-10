import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Pricing() {
    const navigate = useNavigate();

    const tiers = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for getting started with your tech journey.",
            icon: <Star className="h-6 w-6 text-[var(--color-brand-text-muted)]" />,
            features: [
                "Basic foundational courses",
                "Community forum access",
                "Financial literacy basics",
                "1 resume upload & review",
                "Public job board viewing"
            ],
            buttonText: "Get Started",
            buttonVariant: "ghost",
            highlight: false
        },
        {
            name: "Pro",
            price: "$19",
            period: "/mo",
            description: "Everything you need to accelerate your career growth.",
            icon: <Zap className="h-6 w-6 text-[var(--color-brand-secondary)]" />,
            features: [
                "All premium courses & certificates",
                "1:1 Mentor matching & sessions",
                "AI-powered resume builder",
                "Full job board with easy-apply",
                "Salary negotiation tool",
                "Advanced financial tracking"
            ],
            buttonText: "Start Free Trial",
            buttonVariant: "primary",
            highlight: true,
            badge: "Most Popular"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations empowering their female workforce.",
            icon: <Crown className="h-6 w-6 text-[var(--color-brand-primary)]" />,
            features: [
                "Custom learning paths",
                "Dedicated mentor team",
                "Advanced analytics dashboard",
                "Priority 24/7 support",
                "API access & integrations",
                "Branded portal"
            ],
            buttonText: "Contact Sales",
            buttonVariant: "outline",
            highlight: false
        }
    ];

    return (
        <div className="bg-[var(--color-brand-background)] min-h-screen py-20 px-6 md:px-12 page-enter-active">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-brand-text)]">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-lg text-[var(--color-brand-text-muted)] max-w-2xl mx-auto">
                        Invest in your future. Choose the plan that best fits your career goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                    {tiers.map((tier, idx) => (
                        <div 
                            key={idx} 
                            className={`relative bg-[var(--color-brand-surface)] rounded-[var(--radius-lg)] border p-8 transition-all duration-300 flex flex-col h-full
                            ${tier.highlight 
                                ? 'border-[var(--color-brand-secondary)] shadow-[var(--shadow-lg)] md:-translate-y-4 md:scale-105 z-10' 
                                : 'border-[var(--color-brand-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]'
                            }`}
                        >
                            {tier.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-brand-secondary)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {tier.badge}
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${tier.highlight ? 'bg-[var(--color-brand-secondary)]/10' : 'bg-[var(--color-brand-background)]'}`}>
                                        {tier.icon}
                                    </div>
                                    <h3 className="text-xl font-display font-semibold">{tier.name}</h3>
                                </div>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-display font-bold tabular-data">{tier.price}</span>
                                    {tier.period && <span className="text-[var(--color-brand-text-muted)] font-medium">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-[var(--color-brand-text-muted)]">{tier.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${tier.highlight ? 'bg-[var(--color-brand-secondary)]/20 text-[var(--color-brand-secondary)]' : 'bg-[var(--color-status-success)]/10 text-[var(--color-status-success)]'}`}>
                                            <Check className="h-3 w-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-[var(--color-brand-text)]">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                variant={tier.buttonVariant} 
                                className="w-full group"
                                onClick={() => navigate(tier.name === 'Enterprise' ? '/contact' : '/signup')}
                            >
                                {tier.buttonText}
                                {tier.highlight && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
