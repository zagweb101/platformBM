"use client";

import Link from "next/link";
import { Play, ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] pt-24 px-4 sm:px-6 lg:px-8">
      {/* SVG Grain Noise Filter */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Animated Gradient Mesh Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1: Indigo */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-brand-indigo/15 blur-[120px] animate-blob" style={{ animationDelay: "0s", animationDuration: "25s" }} />
        {/* Blob 2: Fuchsia */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-brand-fuchsia/10 blur-[130px] animate-blob" style={{ animationDelay: "4s", animationDuration: "30s" }} />
        {/* Blob 3: Violet */}
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-brand-violet/10 blur-[110px] animate-blob" style={{ animationDelay: "8s", animationDuration: "28s" }} />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating Diamond Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-8 h-8 border border-brand-indigo/10 rotate-45 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[30%] right-[15%] w-12 h-12 border border-brand-fuchsia/5 rotate-12 animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[60%] right-[5%] w-6 h-6 border border-brand-violet/15 rotate-[60deg] animate-float" style={{ animationDelay: "5s" }} />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center relative z-20 flex flex-col items-center select-none">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-indigo/10 to-brand-fuchsia/10 border border-brand-indigo/25 text-brand-indigo text-xs font-semibold mb-8 shadow-[0_0_15px_rgba(79,70,229,0.1)] hover:border-brand-fuchsia/45 transition-colors duration-300 font-tajawal">
          <span className="text-brand-fuchsia text-sm">✦</span>
          الأكاديمية الأولى للتصوير وصناعة الأفلام في المملكة
        </div>

        {/* H1 Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8.5xl font-black tracking-tight text-white mb-6 leading-[1.15] font-cairo">
          احترف فن التصوير
          <br />
          <span className="bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia bg-clip-text text-fill-transparent webkit-text-fill-transparent filter drop-shadow-[0_2px_10px_rgba(79,70,229,0.2)]">
            وصناعة الأفلام
          </span>
        </h1>

        {/* Description Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-tajawal">
          ابدأ رحلتك الإبداعية مع نخبة من كبار المصورين وصنّاع الأفلام في المملكة. دروس تفاعلية، تطبيقات عملية، ودعم مباشر خطوة بخطوة للوصول إلى الاحتراف العالمي.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto px-4">
          <Link
            href="#courses"
            className="flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia hover:shadow-[0_0_30px_rgba(79,70,229,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 font-cairo"
          >
            استكشف الكورسات
          </Link>
          <Link
            href="#about"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 font-tajawal"
          >
            <Play className="w-4.5 h-4.5 text-brand-fuchsia" />
            شاهد النموذج
          </Link>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-tajawal">اسحب للأسفل</span>
        <div className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-800 bg-[#0a0a0f]">
          <ArrowDown className="w-4 h-4 text-brand-indigo animate-bounce" />
        </div>
      </div>
    </section>
  );
}
