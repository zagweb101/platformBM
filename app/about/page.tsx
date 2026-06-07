import Header from "@/components/landing/Header";
import AboutSection from "@/components/landing/AboutSection";
import StatsBar from "@/components/landing/StatsBar";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-brand-indigo/30 selection:text-white">
      {/* Sticky Header */}
      <Header />
      
      {/* Spacer to offset sticky header */}
      <div className="h-20" />
      
      {/* About Main Narrative */}
      <AboutSection />
      
      {/* Stats Counter Bar */}
      <StatsBar />
      
      {/* Call to Action Banner */}
      <CtaBanner />
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}
