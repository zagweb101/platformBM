import { Suspense } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import LearningPathsSection from "@/components/home/LearningPathsSection";
import FeaturedCoursesSection, {
  FeaturedCoursesLoading,
} from "@/components/home/FeaturedCoursesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import InstructorsSection, {
  InstructorsLoading,
} from "@/components/home/InstructorsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import { getHeroStats } from "@/lib/home-data";

export default async function Home() {
  const heroStats = await getHeroStats();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />

      <main id="main-content" tabIndex={-1}>
        <HeroSection stats={heroStats} />
        <TrustBar />
        <LearningPathsSection />

        <Suspense fallback={<FeaturedCoursesLoading />}>
          <FeaturedCoursesSection />
        </Suspense>

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
