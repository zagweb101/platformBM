"use client";

import Image from "next/image";
import { Camera, Film, Brush } from "lucide-react";

export default function InstructorsSection() {
  const instructors = [
    {
      name: "أحمد المالكي",
      role: "مؤسس الأكاديمية & مصور تجاري",
      specialty: "التصوير الاحترافي وتوزيع الإضاءة",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      icon: Camera,
      bio: "خبرة أكثر من 12 عاماً في التصوير التجاري والتعامل مع كبرى العلامات التجارية في المملكة.",
    },
    {
      name: "سارة الغامدي",
      role: "مخرجة وصانعة أفلام وثائقية",
      specialty: "الإخراج السينمائي والمونتاج",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      icon: Film,
      bio: "أخرجت العديد من الأفلام الوثائقية القصيرة الحائزة على جوائز في مهرجانات محلية وإقليمية.",
    },
    {
      name: "خالد الحربي",
      role: "مصور فوتوغرافي وخبير دمج رقمي",
      specialty: "المعالجة الرقمية والألوان",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      icon: Brush,
      bio: "متخصص في برامج Lightroom و Photoshop وصناعة هوية بصرية فريدة للصور الفنية والمناظر الطبيعية.",
    },
  ];

  return (
    <section id="instructors" className="relative w-full py-24 bg-[#0a0a0f] border-b border-gray-900 overflow-hidden">
      {/* Background Soft radial gradient */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-fuchsia/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ أصحاب الخبرة</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo">
            نخبة المدربين
          </h3>
          <p className="text-gray-400 mt-4 text-base sm:text-lg font-tajawal">
            صنّاع محتوى محترفون وخبراء يشاركونك تجاربهم المهنية الحقيقية لتختصر طريقك نحو الاحتراف.
          </p>
        </div>

        {/* Instructors Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {instructors.map((inst, idx) => {
            const IconComponent = inst.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-[#0f0f1a]/40 backdrop-blur-md border border-gray-900/60 hover:border-brand-violet/20 hover:-translate-y-1.5 transition-all duration-300 shadow-2xl"
              >
                {/* Avatar with gradient border */}
                <div className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-brand-indigo to-brand-fuchsia shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-900">
                    <Image
                      src={inst.image}
                      alt={inst.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  {/* Floating Specialty Icon */}
                  <div className="absolute -bottom-1 -left-1 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-fuchsia text-white shadow-md">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Name */}
                <h4 className="text-xl font-bold text-white mb-1.5 font-cairo group-hover:text-brand-indigo transition-colors duration-300">
                  {inst.name}
                </h4>

                {/* Role/Subtitle */}
                <span className="text-xs text-brand-fuchsia font-bold tracking-wide mb-3 font-tajawal">
                  {inst.role}
                </span>

                {/* Specialty */}
                <span className="text-sm font-semibold text-gray-300 mb-4 font-tajawal">
                  {inst.specialty}
                </span>

                {/* Bio */}
                <p className="text-gray-400 text-xs leading-relaxed font-tajawal max-w-xs">
                  {inst.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
