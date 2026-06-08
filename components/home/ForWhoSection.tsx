import { Camera, Clapperboard, GraduationCap, Briefcase } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const AUDIENCES = [
  {
    icon: Camera,
    title: "هواة التصوير",
    description: "تريد أساسيات قوية قبل الاستثمار في معدات باهظة؟ ابدأ من الصفر بمشاريع عملية.",
  },
  {
    icon: Clapperboard,
    title: "صنّاع المحتوى والأفلام",
    description: "تعلّم الإضاءة، التصوير السينمائي، والمونتاج لرفع جودة إنتاجك.",
  },
  {
    icon: GraduationCap,
    title: "الطلاب والخريجون",
    description: "مسارات منظّمة، متابعة تقدم، وشهادات تثبت إنجازك أمام العملاء أو أصحاب العمل.",
  },
  {
    icon: Briefcase,
    title: "المصورون المحترفون",
    description: "انضم كمدرب، أنشئ دوراتك، وتابع أرباحك من لوحة تحكم مخصصة للمدربين.",
  },
] as const;

export default function ForWhoSection() {
  return (
    <section id="for-who" className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="لمن المنصة؟"
          title="صُمّمت لكل مرحلة في رحلتك البصرية"
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} variant="bordered" padding="md" className="h-full">
                <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md bg-brand-violet-600/10 text-brand-violet-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-bold text-[#151525] font-heading">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary font-body leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
