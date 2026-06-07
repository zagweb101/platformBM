import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { LogIn, UserPlus, Camera, Film, Users, ShieldAlert, Award } from "lucide-react";
import { logout } from "@/actions/auth.actions";

export default async function Home() {
  const session = await auth();
  
  // Get all published courses
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      instructor: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-subtle bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary hidden md:inline">
                  مرحباً، <strong className="text-text-primary">{session.user.name}</strong>
                </span>
                
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/dashboard/admin"
                    className="text-xs bg-brand-violet/10 text-brand-violet border border-brand-violet/20 hover:bg-brand-violet hover:text-white px-3.5 py-2 rounded-xl transition-all font-semibold"
                  >
                    لوحة المدير
                  </Link>
                )}
                
                {session.user.role === "INSTRUCTOR" && (
                  <Link
                    href="/dashboard/instructor"
                    className="text-xs bg-brand-fuchsia/10 text-brand-fuchsia border border-brand-fuchsia/20 hover:bg-brand-fuchsia hover:text-white px-3.5 py-2 rounded-xl transition-all font-semibold"
                  >
                    لوحة المدرب
                  </Link>
                )}
                
                {session.user.role === "STUDENT" && (
                  <Link
                    href="/dashboard/student"
                    className="text-xs bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 hover:bg-brand-indigo hover:text-white px-3.5 py-2 rounded-xl transition-all font-semibold"
                  >
                    دوراتي الدراسية
                  </Link>
                )}

                <form action={logout}>
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3.5 py-2 rounded-xl transition-colors font-medium border border-red-500/10"
                  >
                    تسجيل الخروج
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-brand-indigo px-3.5 py-2 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  دخول
                </Link>
                <Link
                  href="/register"
                  className="btn-primary flex items-center gap-1.5 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-subtle">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-fuchsia/10 border border-brand-fuchsia/20 text-brand-fuchsia text-xs font-semibold mb-6 animate-pulse">
            <Award className="w-4 h-4" />
            أكاديمية التصوير الرقمي الأولى في الوطن العربي
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight mb-6 leading-tight">
            احترف فن التصوير وصناعة الأفلام مع{" "}
            <span className="bg-gradient-brand bg-clip-text text-fill-transparent webkit-text-fill-transparent">
              بيت المصور
            </span>
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mb-8 leading-relaxed font-normal">
            دورات تدريبية متخصصة من الصفر حتى الاحتراف يقدمها نخبة من ألمع المصورين وصناع الأفلام المحترفين، مع لوحة تحكم متكاملة لمتابعة تقدمك العملي والدراسي.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#courses" className="btn-primary text-base px-8 py-3">
              استكشف الدورات المتاحة
            </Link>
            {!session && (
              <Link
                href="/register"
                className="bg-card hover:bg-gray-100 dark:hover:bg-dark-elevated border border-subtle text-text-primary font-semibold px-8 py-3 rounded-xl transition-all shadow-sm"
              >
                انضم كمدرب أو طالب
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat-card flex flex-col items-center justify-center text-center">
              <Camera className="w-8 h-8 text-brand-indigo mb-2" />
              <div className="stat-number">3+</div>
              <div className="text-xs text-text-secondary mt-1">دورات احترافية</div>
            </div>
            
            <div className="stat-card flex flex-col items-center justify-center text-center">
              <Users className="w-8 h-8 text-brand-violet mb-2" />
              <div className="stat-number">100+</div>
              <div className="text-xs text-text-secondary mt-1">طلاب شغوفين</div>
            </div>

            <div className="stat-card flex flex-col items-center justify-center text-center">
              <Film className="w-8 h-8 text-brand-fuchsia mb-2" />
              <div className="stat-number">50+</div>
              <div className="text-xs text-text-secondary mt-1">دروس فيديو عالية الدقة</div>
            </div>

            <div className="stat-card flex flex-col items-center justify-center text-center">
              <Award className="w-8 h-8 text-amber-500 mb-2" />
              <div className="stat-number">100%</div>
              <div className="text-xs text-text-secondary mt-1">تطبيق ومتابعة عملية</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="text-right mb-12">
          <h2 className="text-3xl font-black text-text-primary mb-3">الدورات التدريبية المتاحة</h2>
          <p className="text-text-secondary max-w-xl">
            اختر دورتك المفضلة، وارفع إيصال الدفع للبدء في التعلم مباشرة ومتابعة تقدمك مع معلمك.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 card-brand p-8">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-text-secondary font-medium">لا توجد دورات منشورة حالياً. يرجى زيارة الموقع لاحقاً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="card-brand flex flex-col overflow-hidden">
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-900">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-brand-indigo text-white text-xs font-bold px-3 py-1 rounded-full shadow-md font-almarai">
                    {course.price} ر.س
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-2 min-h-[50px] line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-3 mb-6">
                      {course.description}
                    </p>
                  </div>

                  <div className="border-t border-subtle pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-violet/20">
                        {course.instructor.user.image ? (
                          <Image
                            src={course.instructor.user.image}
                            alt={course.instructor.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-brand-violet/10 flex items-center justify-center text-brand-violet font-bold text-xs">
                            {course.instructor.user.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="text-xs">
                        <p className="text-text-muted">المدرب</p>
                        <p className="font-semibold text-text-primary">{course.instructor.user.name}</p>
                      </div>
                    </div>

                    <Link
                      href={session ? "/dashboard/student/payments" : "/login"}
                      className="btn-primary text-xs py-2 px-4 shadow-sm"
                    >
                      اشترك الآن
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle bg-card py-8 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo showText={false} />
          <p>© {new Date().getFullYear()} بيت المصور. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline">بوابة الطلاب</Link>
            <Link href="/dashboard/instructor/onboarding" className="hover:underline">انضم كمدرب</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
