"use client";

import { Award, Users, ShieldCheck, Compass, RefreshCw, MessageSquare } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: "كورسات احترافية معتمدة",
      description: "مناهج تعليمية شاملة ومصممة بأعلى معايير الجودة لتأهيلك لسوق العمل باحترافية تامة.",
    },
    {
      icon: Users,
      title: "مدربون من نخبة المصورين",
      description: "تعلّم مباشرة من رواد صناعة الأفلام والتصوير الفوتوغرافي الحاصلين على جوائز عالمية.",
    },
    {
      icon: ShieldCheck,
      title: "شهادات معترف بها",
      description: "احصل على شهادة إتمام معتمدة من الأكاديمية تدعم ملفك المهني ومستقبلك الإبداعي.",
    },
    {
      icon: Compass,
      title: "متابعة فردية لكل طالب",
      description: "جلسات مراجعة وتقييم دورية لأعمالك الفنية لمساعدتك على تطوير أسلوبك الخاص.",
    },
    {
      icon: RefreshCw,
      title: "محتوى محدث باستمرار",
      description: "مواكبة دائمة لأحدث التقنيات والمعدات وبرامج التحرير في عالم التصوير وصناعة الأفلام.",
    },
    {
      icon: MessageSquare,
      title: "مجتمع مصورين نشط",
      description: "انضم إلى شبكة تواصل حصرية تجمعك مع زملائك والمدربين لتبادل الخبرات والفرص المهنية.",
    },
  ];

  return (
    <section id="features" className="relative w-full py-24 bg-[#0a0a0f] border-b border-gray-900 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-violet/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ قيمنا ومميزاتنا</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo leading-tight">
            لماذا بيت المصور؟
          </h3>
          <p className="text-gray-400 mt-4 text-base sm:text-lg font-tajawal">
            نقدم لك بيئة تعليمية متكاملة تضمن تحولك من هاوٍ شغوف إلى مصور وصانع أفلام محترف.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-[#0f0f1a]/60 border border-gray-900/60 hover:border-brand-indigo/30 p-8 hover:-translate-y-1.5 transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-indigo/10 to-transparent blur-md rounded-tr-2xl pointer-events-none group-hover:from-brand-fuchsia/20 transition-all duration-300" />
                
                {/* Icon wrapper with glow */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-brand-indigo/10 to-brand-fuchsia/10 text-brand-indigo group-hover:text-brand-fuchsia transition-all duration-300 mb-6 shadow-md border border-brand-indigo/15">
                  <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Feature Title */}
                <h4 className="text-lg sm:text-xl font-bold text-white mb-3 font-cairo transition-colors duration-300 group-hover:text-brand-indigo">
                  {feature.title}
                </h4>

                {/* Feature Description */}
                <p className="text-gray-400 text-sm leading-relaxed font-tajawal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
