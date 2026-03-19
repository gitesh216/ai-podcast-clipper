"use client";

import {
    Zap,
    Smartphone,
    BarChart3,
    Layers,
    Share2,
    Type
} from "lucide-react";

const features = [
    {
        title: "Instant Clipping",
        description: "Our advanced algorithm identifies the most engaging moments in your audio or video automatically.",
        icon: Zap,
    },
    {
        title: "Vertical Ready",
        description: "One-click export to 9:16 format for TikTok, Instagram Reels, and YouTube Shorts.",
        icon: Smartphone,
    },
    {
        title: "Auto-Captions",
        description: "Highly accurate transcription and stylish, animated captions to keep viewers engaged.",
        icon: Type,
    },
    {
        title: "Growth Analytics",
        description: "Track how your clips perform across different platforms and optimize your content strategy.",
        icon: BarChart3,
    },
    {
        title: "Bulk Processing",
        description: "Upload an entire season and let us handle the rest. Save hours of manual work.",
        icon: Layers,
    },
    {
        title: "Direct Publishing",
        description: "Connect your social accounts and schedule posts directly from our dashboard.",
        icon: Share2,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to go viral</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Stop wasting time on tedious editing. Focus on your content while we handle the distribution.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
