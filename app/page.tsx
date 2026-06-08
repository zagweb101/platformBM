import { Suspense } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProjectStorySection from "@/components/home/ProjectStorySection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ForWhoSection from "@/components/home/ForWhoSection";
import TrustBar from "@/components/home/TrustBar";
import LearningPathsSection from "@/components/home/LearningPathsSection";
import FeaturedCoursesSection, {
  FeaturedCoursesLoading,
} from "@/components/home/FeaturedCoursesSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import InstructorsSection, {
  InstructorsLoading,
} from "@/components/home/InstructorsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import { getHeroStats } from "@/lib/home-data";
import { getPublishedEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroStats, upcomingEvents] = await Promise.all([
    getHeroStats(),
    getPublishedEvents(3),
  ]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />

      <main id="main-content" tabIndex={-1}>
        <HeroSection stats={heroStats} />
        <ProjectStorySection />
        <HowItWorksSection />
        <ForWhoSection />
        <TrustBar />
        <LearningPathsSection />

        <Suspense fallback={<FeaturedCoursesLoading />}>
          <FeaturedCoursesSection />
        </Suspense>

        <UpcomingEventsSection events={upcomingEvents} />
        <WhyUsSection />

        <Suspense fallback={<InstructorsLoading />}>
          <InstructorsSection />
        </Suspense>

        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
