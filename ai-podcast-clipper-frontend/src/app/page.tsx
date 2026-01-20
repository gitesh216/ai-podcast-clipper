import { SiteHeader } from "~/components/landing/site-header";
import { Hero } from "~/components/landing/hero";
import { Features } from "~/components/landing/features";
import { Pricing } from "~/components/landing/pricing";
import { Footer } from "~/components/landing/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
