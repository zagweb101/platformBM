import Header from "@/components/landing/Header";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col selection:bg-brand-indigo/30 selection:text-white">
      {/* Sticky Header */}
      <Header />
      
      {/* Spacer to offset sticky header */}
      <div className="h-20" />
      
      {/* Contact Form & Information Details */}
      <ContactSection />
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}
