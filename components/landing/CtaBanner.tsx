"use client";

import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia overflow-hidden z-20 shadow-2xl">
      {/* Decorative Floating Diamonds */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-16 h-16 border border-white rotate-45 animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-[20%] right-[8%] w-24 h-24 border border-white rotate-12 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[50%] right-[25%] w-10 h-10 border border-white rotate-[30deg] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Subtle Light Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8 select-none">
        {/* Title */}
        <h3 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight font-cairo drop-shadow-md">
          ابدأ رحلتك في عالم التصوير اليوم
        </h3>

        {/* Subtext */}
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-tajawal">
          انضم الآن مجاناً وابدأ استكشاف الدروس التجريبية المجانية لجميع الكورسات، وكن جزءاً من أكبر مجتمع للمصورين في المملكة.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-brand-indigo bg-white hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300 font-cairo"
          >
            سجل الآن مجاناً
          </Link>
          <Link
            href="#courses"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white border border-white/30 hover:border-white bg-white/5 hover:bg-white/10 transition-colors transform hover:-translate-y-0.5 duration-300 font-tajawal"
          >
            تعرف على الكورسات
          </Link>
        </div>
      </div>
    </section>
  );
}
