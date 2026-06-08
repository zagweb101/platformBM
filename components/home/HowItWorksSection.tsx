import { UserPlus, BookOpen, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    step: "1",
    icon: UserPlus,
    title: "أنشئ حسابك",
    description: "سجّل مجاناً واختر مسارك: طالب للتعلّم، أو قدّم كمدرب إن كنت محترفاً.",
  },
  {
    step: "2",
    icon: BookOpen,
    title: "اختر كورسك أو فعاليتك",
    description: "استكشف الكورسات العملية أو انضم لورش وفعاليات ميدانية مع مراجعة الطلب.",
  },
  {
    step: "3",
    icon: Award,
    title: "تعلّم واحصل على شهادتك",
    description: "تابع الدروس، أكمل المشاريع، واحصل على شهادة إتمام معتمدة من الأكاديمية.",
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-soft py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="كيف يعمل؟"
          title="ثلاث خطوات لبدء رحلتك"
          description="من التسجيل إلى الإتقان — مسار واضح بدون تعقيد."
          className="mb-10 sm:mb-12"
        />

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.step}>
                <Card variant="default" padding="lg" className="relative h-full">
                  <span className="absolute -top-3 start-6 inline-flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <div className="mt-4 inline-flex min-h-12 min-w-12 items-center justify-center rounded-md bg-brand-violet-600/10 text-brand-violet-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#151525] font-heading">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary font-body leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
