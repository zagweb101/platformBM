import Header from "@/components/landing/Header";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-brand-indigo/30 selection:text-white">
      {/* Sticky Header */}
      <Header />
      
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="h-20" />
        <ContactSection />
      </main>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}
