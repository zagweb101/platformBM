"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface CourseWithInstructor {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  instructor: {
    id: string;
    user: {
      name: string;
      image: string | null;
    };
  };
}

interface CoursesSectionProps {
  courses?: CourseWithInstructor[];
}

export default function CoursesSection({ courses = [] }: CoursesSectionProps) {
  const { data: session } = useSession();

  // Premium mock fallback courses to display if no published courses are found in DB
  const mockCourses: CourseWithInstructor[] = [
    {
      id: "mock-1",
      title: "أساسيات التصوير الفوتوغرافي الاحترافي",
      description: "رحلة متكاملة لتعلم مبادئ الإضاءة، مثلث التعريض، وقواعد التكوين الفني لإنتاج صور مذهلة بأي كاميرا.",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
      price: 299,
      instructor: {
        id: "inst-1",
        user: {
          name: "أحمد المالكي",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        },
      },
    },
    {
      id: "mock-2",
      title: "صناعة الأفلام السينمائية بالهاتف",
      description: "اكتشف أسرار الإخراج وتوزيع الإضاءة والمونتاج السينمائي باستخدام هاتفك الذكي فقط لصناعة محتوى مبهر.",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop",
      price: 349,
      instructor: {
        id: "inst-2",
        user: {
          name: "سارة الغامدي",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        },
      },
    },
    {
      id: "mock-3",
      title: "تحرير وتعديل الصور الرقمية: Lightroom & Photoshop",
      description: "احترف تصحيح الألوان (Color Grading) والمعالجة الرقمية لإبراز تفاصيل الصور وتحويلها للوحات فنية ساحرة.",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      price: 199,
      instructor: {
        id: "inst-3",
        user: {
          name: "خالد الحربي",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
        },
      },
    },
  ];

  const displayCourses = courses.length > 0 ? courses.slice(0, 3) : mockCourses;

  const getCategoryBadge = (title: string) => {
    if (title.includes("تحرير") || title.includes("Lightroom")) return "تحرير رقمي";
    if (title.includes("أفلام") || title.includes("سينمائية")) return "صناعة أفلام";
    return "تصوير فوتوغرافي";
  };

  return (
    <section id="courses" className="relative w-full py-24 bg-[#0f0f1a]/50 border-b border-gray-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-indigo/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-right">
            <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ استكشف مهاراتك</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo">
              الكورسات المتاحة
            </h3>
            <p className="text-gray-400 mt-3 text-base sm:text-lg font-tajawal max-w-xl">
              ابدأ التعلم الآن مع نخبة من الخبراء وتابع تقدمك الأكاديمي مباشرة من لوحتك الخاصة.
            </p>
          </div>
          <Link
            href="#all-courses"
            className="group flex items-center gap-1 text-sm font-bold text-brand-indigo hover:text-brand-fuchsia transition-colors duration-300 font-tajawal"
          >
            استعرض جميع الكورسات
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCourses.map((course) => {
            const category = getCategoryBadge(course.title);
            return (
              <div
                key={course.id}
                className="group flex flex-col bg-[#0a0a0f] border border-gray-900 rounded-2xl overflow-hidden hover:border-brand-indigo/20 hover:-translate-y-2 transition-all duration-300 shadow-2xl"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}

                  {/* Top-Right Category Badge */}
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-[#0a0a0f]/80 backdrop-blur-md border border-gray-800 px-3 py-1.5 rounded-full font-tajawal">
                    {category}
                  </span>

                  {/* Dark overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                {/* Content Container */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Course Title */}
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug font-cairo group-hover:text-brand-indigo transition-colors duration-300 line-clamp-2 min-h-[56px]">
                      {course.title}
                    </h4>

                    {/* Course Description */}
                    <p className="text-gray-400 text-sm leading-relaxed font-tajawal mb-6 line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Instructor & Price Row */}
                  <div className="border-t border-gray-900 pt-5 flex items-center justify-between">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-violet/20 bg-gray-900">
                        {course.instructor?.user?.image ? (
                          <Image
                            src={course.instructor.user.image}
                            alt={course.instructor.user.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-brand-violet/10 flex items-center justify-center text-brand-violet font-bold text-xs">
                            {course.instructor?.user?.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 font-tajawal">المدرب</span>
                        <span className="block text-xs font-semibold text-white font-tajawal">
                          {course.instructor?.user?.name}
                        </span>
                      </div>
                    </div>

                    {/* Price and Action Button */}
                    <div className="text-left">
                      <span className="block text-sm font-black text-brand-gold font-almarai">
                        {course.price} ر.س
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={session ? "/dashboard/student/payments" : "/login"}
                    className="mt-6 flex items-center justify-center w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-indigo/10 to-brand-fuchsia/10 border border-brand-indigo/20 hover:border-brand-fuchsia/40 hover:from-brand-indigo hover:to-brand-fuchsia transition-all duration-300 font-cairo"
                  >
                    الالتحاق بالكورس
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
