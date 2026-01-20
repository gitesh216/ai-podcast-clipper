"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
                        <span className="text-primary mr-2">New:</span>
                        <span>Multi-platform support is here</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </div>

                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl">
                        Turn your long podcasts into <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">viral clips</span> in seconds
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl">
                        The ultimate SaaS tool for podcast creators. Grow your audience on TikTok, Reels, and Shorts without spending hours in editing software.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
                            <Link href="/signup">Start Clipping for Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                            <Link href="#how-it-works">
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Watch Demo
                            </Link>
                        </Button>
                    </div>

                    <div className="relative mt-16 w-full max-w-5xl group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative rounded-2xl border bg-card overflow-hidden shadow-2xl">
                            <Image
                                src="/hero.png"
                                alt="AI Podcast Clipper Dashboard"
                                width={1200}
                                height={675}
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
