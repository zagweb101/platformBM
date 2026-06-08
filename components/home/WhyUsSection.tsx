import { Camera, GraduationCap, Clock, Headphones } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: Camera,
    title: "تدريب عملي حقيقي",
    description: "مشاريع تطبيقية وتمارين ميدانية تُحاكي سوق العمل الفعلي.",
  },
  {
    icon: GraduationCap,
    title: "مدربون محترفون",
    description: "تعلّم من خبراء التصوير وصناعة الأفلام في المنطقة.",
  },
  {
    icon: Clock,
    title: "مرونة في التعلم",
    description: "ادرس بالوتيرة التي تناسبك — أونلاين وفي أي وقت.",
  },
  {
    icon: Headphones,
    title: "دعم مستمر",
    description: "متابعة مباشرة مع المدرب ومجتمع طلابي نشط.",
  },
] as const;

export default function WhyUsSection() {
  return (
    <section className="section-soft py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="لماذا بيت المصور؟"
          title="تجربة تعليمية مختلفة"
          description="نجمع بين المعرفة النظرية والتطبيق العملي لبناء مهاراتك خطوة بخطوة."
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} variant="default" padding="md" className="h-full">
                <div className="mb-4 inline-flex min-h-12 min-w-12 items-center justify-center rounded-md bg-brand-violet-600/10 text-brand-violet-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-[#151525] font-heading">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary font-body">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
