import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface HeroStats {
  courses: number;
  students: number;
  lessons: number;
}

interface HeroSectionProps {
  stats?: HeroStats;
}

const DEFAULT_STATS: HeroStats = {
  courses: 3,
  students: 100,
  lessons: 50,
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

export default function HeroSection({ stats = DEFAULT_STATS }: HeroSectionProps) {
  const displayStats = [
    { value: `${stats.courses}+`, label: "كورس" },
    { value: `${stats.students}+`, label: "طالب" },
    { value: `${stats.lessons}+`, label: "درس" },
    { value: "100%", label: "تطبيق عملي" },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-navy-950">
      {/* شبكة خلفية خفيفة */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #101A55 1px, transparent 0)
          `,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-navy-950/20 via-transparent to-brand-navy-950"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-col gap-10 px-4 pb-10 pt-20 sm:px-6 lg:min-h-screen lg:justify-center lg:gap-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* العمود الأيمن — النص (أولاً في DOM لـ RTL) */}
          <div className="order-1 flex flex-col items-start text-start">
            <Badge
              variant="brand"
              size="md"
              className="mb-5 bg-brand-violet-600/15 text-brand-violet-500 border border-brand-violet-600/25 shadow-none"
            >
              أكاديمية التصوير الرقمي الأولى
            </Badge>

            <h1
              className="font-heading font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              حوّل شغفك بالتصوير إلى مهارة{" "}
              <span className="gradient-text">احترافية</span>
            </h1>

            <p className="mt-5 max-w-xl text-body text-[#C6C5D5] font-body">
              تعلّم التصوير، الإضاءة وصناعة الأفلام من خبراء المجال، من خلال
              كورسات عملية ومشاريع حقيقية ومتابعة مباشرة.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/#courses" variant="primary" size="lg" className="w-full sm:w-auto">
                استعرض الكورسات
              </Button>
              <Button
                href="/#courses"
                variant="outline"
                size="lg"
                className="w-full border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                شاهد درسًا مجانيًا
              </Button>
            </div>

            <dl className="mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {displayStats.map((item) => (
                <div key={item.label} className="text-start">
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="text-2xl font-bold text-white font-heading sm:text-3xl">
                    {item.value}
                  </dd>
                  <dd className="mt-1 text-sm text-[#9794A7] font-body">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* العمود الأيسر — الصورة */}
          <div className="order-2 relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-brand-navy-800 shadow-brand">
              <Image
                src={HERO_IMAGE}
                alt="تعلّم التصوير الفوتوغرافي في بيت المصور"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy-950/40 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="absolute -bottom-4 start-4 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-brand-navy-900/90 px-4 py-2.5 text-sm font-semibold text-emerald-400 shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              تدريب عملي ✓
            </div>
            <div className="absolute -top-3 end-4 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-brand-navy-900/90 px-4 py-2.5 text-sm font-semibold text-emerald-400 shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              شهادة إتمام ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
