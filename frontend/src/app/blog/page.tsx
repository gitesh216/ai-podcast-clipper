import BlogComingSoon from "~/components/landing/blog";
import { SiteHeader } from "~/components/landing/site-header";
import { Footer } from "~/components/landing/footer";

export default function BlogPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <BlogComingSoon />
            </main>
            <Footer />
        </div>
    );
}
