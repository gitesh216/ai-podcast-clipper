"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Mic2 } from "lucide-react";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <Mic2 className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">Clipper.ai</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/signup">Sign up</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
