"use client";

import { Button } from "~/components/ui/button";
import { Timer, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function BlogComingSoon() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4">
            <div className="relative w-full max-w-2xl text-center space-y-8">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />

                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                    <Timer className="h-8 w-8" />
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Blog is <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Coming Soon</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    We&apos;re crafting deep dives on content strategy, viral hooks, and the future of podcasting. Stay tuned!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <div className="relative group w-full sm:w-auto">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
                        <Button size="lg" className="relative w-full h-12 px-8 font-semibold rounded-xl">
                            <Mail className="mr-2 h-4 w-4" />
                            Notify Me
                        </Button>
                    </div>

                    <Button variant="ghost" size="lg" asChild className="h-12 px-8 font-medium">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t mt-16 text-left">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Case Studies</h3>
                        <p className="text-sm text-muted-foreground">How top podcasters grew 10x using vertical clips.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Product Updates</h3>
                        <p className="text-sm text-muted-foreground">The latest features and improvements to Clipper.ai.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Tutorials</h3>
                        <p className="text-sm text-muted-foreground">Step-by-step guides to mastering social algorithms.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
