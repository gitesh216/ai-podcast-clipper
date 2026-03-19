"use client";

import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for new creators experimenting with short-form content.",
        features: [
            "3 high-quality clips/month",
            "Auto-captions (English only)",
            "Standard quality export",
            "Community support",
        ],
        cta: "Start for free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        description: "The essential kit for professional podcasters and agencies.",
        features: [
            "30 high-quality clips/month",
            "Multi-language captions",
            "4K export quality",
            "No watermarks",
            "Priority processing",
            "Priority email support",
        ],
        cta: "Get Started",
        popular: true,
    },
    {
        name: "Growth",
        price: "$79",
        description: "Scale your content production to the next level.",
        features: [
            "Unlimited clips/month",
            "Custom branding kits",
            "Direct social publishing",
            "API access",
            "Dedicated account manager",
            "24/7 support",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Simple, transparent pricing</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your growth stage. Boost your reach without breaking the bank.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular
                                ? "border-primary shadow-xl scale-105 z-10 bg-card"
                                : "border-border bg-card/50"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 text-sm">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className="w-full h-11 font-semibold rounded-xl"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
