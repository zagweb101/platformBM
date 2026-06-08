"use client";

import Image from "next/image";

export default function AboutSection() {
  const milestones = [
    {
      year: "2021",
      title: "تأسيس الفكرة",
      desc: "انطلاقة فكرة الأكاديمية وتقديم أول ورشة عمل حضورية بمدينة جدة بمشاركة 50 هاوياً.",
    },
    {
      year: "2023",
      title: "إطلاق المنصة الرقمية",
      desc: "التوسع للتدريب عن بُعد وتدشين المنصة الإلكترونية التي خدمت أكثر من 300 طالب وطالبة.",
    },
    {
      year: "2026",
      title: "التطوير والريادة",
      desc: "إطلاق النظام السحابي المطور وتوسيع شراكاتنا لدعم المصورين الموهوبين في قطاع الإنتاج.",
    },
  ];

  return (
    <section id="about" className="relative w-full py-24 bg-[#0a0a0f] border-b border-gray-900 overflow-hidden">
      <div className="absolute top-1/2 end-1/4 w-[500px] h-[500px] bg-brand-indigo/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Visual Column (Left on Desktop) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl p-[1.5px] bg-gradient-to-br from-brand-indigo via-brand-violet to-brand-fuchsia shadow-2xl group">
              <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-br from-brand-indigo to-brand-fuchsia opacity-25 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-gray-900">
                <Image
                  src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=600&auto=format&fit=crop"
                  alt="قصة أكاديمية بيت المصور في التدريب"
                  fill
                  sizes="(max-w-768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Visual Glassmorphic overlay */}
                <div className="absolute bottom-6 inset-x-6 p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-start">
                  <span className="text-[10px] font-bold text-brand-fuchsia tracking-wider uppercase font-tajawal">من قلب جدة</span>
                  <p className="text-sm font-bold text-white font-cairo mt-1">تنمية جيل من المبدعين البصريين</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column (Right on Desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-start">
            <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ من نحن</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo mb-6 leading-tight">
              أكاديمية بيت المصور
            </h3>
            
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 font-tajawal">
              تأسست الأكاديمية في مدينة جدة لتكون المرجع الأول والشريك الإبداعي لكل شغوف بالتصوير الفوتوغرافي وصناعة الأفلام بالمملكة. نسعى لتمكين المواهب المحلية وربطهم بالخبرات العملية وسوق العمل عبر مناهج تعليمية متكاملة ولوحة تحكم ذكية لتطوير ومراقبة التقدم الفني.
            </p>

            {/* Milestones Vertical List */}
            <div className="space-y-6 relative border-s border-gray-900/80 ps-4 ms-2">
              {milestones.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Floating timeline dot */}
                  <div className="absolute top-1.5 -start-[21px] w-2.5 h-2.5 rounded-full bg-brand-indigo group-hover:bg-brand-fuchsia transition-colors duration-300 border-2 border-[#0a0a0f] shadow-md" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <span className="text-lg font-black text-brand-fuchsia font-almarai leading-none group-hover:scale-105 transition-transform duration-300">
                      {item.year}
                    </span>
                    <div>
                      <h4 className="text-md font-bold text-white font-cairo mb-1 group-hover:text-brand-indigo transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-tajawal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
