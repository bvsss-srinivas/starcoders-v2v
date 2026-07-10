import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Calculator, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';

export default function FinTech() {
    return (
        <PublicLayout>
            <div className="bg-orange-50 py-16 border-b border-orange-100">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-brand-text)]">Financial Literacy & Tools</h1>
                    <p className="text-[var(--color-brand-text-muted)] max-w-2xl mx-auto text-lg">
                        Take control of your financial future. Because financial inclusion is the foundation of true independence for women in STEM.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
                
                {/* Tools Grid */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Interactive Tools</h2>
                            <p className="text-[var(--color-brand-text-muted)]">Calculate, estimate, and plan your financial growth.</p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-[var(--shadow-md)] transition-shadow">
                            <CardContent className="p-6 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Salary Negotiation Estimator</h3>
                                <p className="text-sm text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    Compare your offer against industry benchmarks and learn how to ask for what you're worth.
                                </p>
                                <Button variant="secondary" className="w-full">Launch Tool</Button>
                            </CardContent>
                        </Card>
                        
                        <Card className="hover:shadow-[var(--shadow-md)] transition-shadow">
                            <CardContent className="p-6 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                    <Calculator className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Budget Calculator</h3>
                                <p className="text-sm text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    A simple 50/30/20 rule planner designed to help you save, invest, and enjoy life.
                                </p>
                                <Button variant="secondary" className="w-full">Launch Tool</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-[var(--shadow-md)] transition-shadow">
                            <CardContent className="p-6 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                    <LineChart className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Investment Basics Quiz</h3>
                                <p className="text-sm text-[var(--color-brand-text-muted)] mb-6 flex-1">
                                    Test your knowledge on index funds, compound interest, and retirement planning.
                                </p>
                                <Button variant="secondary" className="w-full">Take Quiz</Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Explainer Section */}
                <section className="bg-white rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-brand-border)] overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="p-10 md:p-16 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-4">Why Financial Inclusion Matters</h2>
                            <p className="text-[var(--color-brand-text-muted)] mb-6 leading-relaxed">
                                Women in STEM often face distinct financial challenges—from the persistent gender pay gap to a lack of targeted investment education. We believe that empowering women with tech skills must go hand-in-hand with giving them the tools to build and manage wealth.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3">
                                    <ShieldCheck className="w-6 h-6 text-[var(--color-status-success)] flex-shrink-0" />
                                    <span className="text-sm text-[var(--color-brand-text)]">Closing the wealth gap starts with understanding compensation structures.</span>
                                </li>
                                <li className="flex gap-3">
                                    <ShieldCheck className="w-6 h-6 text-[var(--color-status-success)] flex-shrink-0" />
                                    <span className="text-sm text-[var(--color-brand-text)]">Investment literacy turns a great salary into long-term financial freedom.</span>
                                </li>
                            </ul>
                            <Button variant="primary" className="w-fit">Read our full manifesto <ArrowRight className="w-4 h-4 ml-2" /></Button>
                        </div>
                        <div className="bg-orange-100 hidden md:block">
                            {/* Abstract placeholder for infographic */}
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="text-orange-300 font-medium">Infographic Placeholder</div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
