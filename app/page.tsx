import { db } from "@/lib/db";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CoursesSection from "@/components/landing/CoursesSection";
import InstructorsSection from "@/components/landing/InstructorsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaBanner from "@/components/landing/CtaBanner";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import { serializeCoursePrice } from "@/lib/serialize-client";
import { getPlatformStats, formatStatsForDisplay } from "@/lib/platform-stats";

export default async function Home() {
  const [coursesRaw, platformStats] = await Promise.all([
    db.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        instructor: {
          include: {
            user: true,
          },
        },
      },
    }),
    getPlatformStats(),
  ]);

  const courses = coursesRaw.map(serializeCoursePrice);

  const stats = formatStatsForDisplay(platformStats);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-brand-indigo/30 selection:text-white">
      {/* 1. Header (Sticky & Glassmorphism) */}
      <Header />
      
      {/* 2. Hero Section (Fullscreen & Cinematic) */}
      <HeroSection />
      
      {/* 3. Stats Bar (Scroll animation counter) */}
      <StatsBar stats={stats} />
      
      {/* 4. Why Us / Features */}
      <FeaturesSection />
      
      {/* 5. Courses Section */}
      <CoursesSection courses={courses} />
      
      {/* 6. About Section */}
      <AboutSection />
      
      {/* 7. Instructors Section */}
      <InstructorsSection />
      
      {/* 8. Testimonials Section */}
      <TestimonialsSection />
      
      {/* 9. CTA Banner */}
      <CtaBanner />
      
      {/* 10. Contact Section */}
      <ContactSection />
      
      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
