import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ProjectStorySection from "@/components/home/ProjectStorySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ForWhoSection from "@/components/home/ForWhoSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CTASection from "@/components/home/CTASection";
import StatsBar from "@/components/landing/StatsBar";
import { getPlatformStats, formatStatsForDisplay } from "@/lib/platform-stats";

export const metadata = {
  title: "عن الأكاديمية | بيت المصور",
  description: "تعرّف على رؤية أكاديمية بيت المصور ورسالتها في تعليم التصوير وصناعة الأفلام.",
};

export default async function AboutPage() {
  const platformStats = await getPlatformStats();
  const stats = formatStatsForDisplay(platformStats);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-20">
        <ProjectStorySection />
        <HowItWorksSection />
        <ForWhoSection />
        <WhyUsSection />
        <StatsBar stats={stats} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
