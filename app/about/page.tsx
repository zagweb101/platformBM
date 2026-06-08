import Header from "@/components/landing/Header";
import AboutSection from "@/components/landing/AboutSection";
import StatsBar from "@/components/landing/StatsBar";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import { getPlatformStats, formatStatsForDisplay } from "@/lib/platform-stats";

export default async function AboutPage() {
  const platformStats = await getPlatformStats();
  const stats = formatStatsForDisplay(platformStats);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-brand-indigo/30 selection:text-white">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="h-20" />
        <AboutSection />
        <StatsBar stats={stats} />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
