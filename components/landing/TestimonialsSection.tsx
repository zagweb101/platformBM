"use client";

import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "فيصل الحربي",
      city: "جدة",
      stars: 5,
      quote: "انضمامي لمنصة بيت المصور كان نقطة تحول حقيقية في مسيرتي. تعلمت كيفية التحكم بالضوء وتكوين المشهد بشكل سينمائي لم أكن لأجده في أي مكان آخر.",
    },
    {
      name: "لينا العتيبي",
      city: "الرياض",
      stars: 5,
      quote: "كورس صناعة الأفلام بالهاتف كان مدهشاً! لم أكن أعلم أن هاتفي يحمل كل هذه الإمكانات. الشرح عملي وواضح والمدربة تتابع معنا تفاصيل التطبيقات بدقة.",
    },
    {
      name: "سلمان الدوسري",
      city: "الدمام",
      stars: 5,
      quote: "برامج التعديل لطالما كانت معقدة بالنسبة لي، لكن كورس Lightroom و Photoshop بسط لي الأمور تماماً وأصبح لدي أسلوب ألوان خاص بي يميز أعمالي.",
    },
  ];

  return (
    <section id="testimonials" className="relative w-full py-24 bg-[#0f0f1a]/50 border-b border-gray-900 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-indigo/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ شركاء النجاح</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo">
            ماذا يقول طلابنا؟
          </h3>
          <p className="text-gray-400 mt-4 text-base sm:text-lg font-tajawal">
            قصص نجاح حقيقية لطلاب انطلقوا معنا من الصفر وبنوا أعمالهم وسيرتهم المهنية الخاصة.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-3xl bg-[#0a0a0f] border border-gray-900/80 hover:border-brand-indigo/20 hover:-translate-y-1.5 transition-all duration-300 shadow-2xl overflow-hidden"
            >
              {/* Giant Background Quote Icon */}
              <Quote className="absolute -bottom-2 -left-2 w-32 h-32 text-brand-indigo/[0.03] transform rotate-180 pointer-events-none transition-transform duration-500 group-hover:scale-105" />

              {/* Star Rating */}
              <div className="flex gap-1 mb-6 text-brand-gold">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-brand-gold text-brand-gold filter drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-tajawal relative z-10">
                «{rev.quote}»
              </p>

              {/* Divider */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-brand-indigo to-brand-fuchsia mb-4" />

              {/* Student Info */}
              <div className="flex flex-col">
                <span className="font-bold text-white text-base font-cairo">{rev.name}</span>
                <span className="text-xs text-gray-500 font-tajawal">{rev.city}، المملكة العربية السعودية</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
