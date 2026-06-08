import { Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ProjectStorySection() {
  return (
    <section id="about-project" className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="ما هو بيت المصور؟"
            title="أكاديمية رقمية لصناعة المبدعين البصريين"
            description="بيت المصور منصة عربية متكاملة تجمع بين التعليم العملي في التصوير وصناعة الأفلام، وإدارة رحلة المتعلم من التسجيل حتى الشهادة — في تجربة واحدة واضحة ومحفّزة."
            align="right"
          />

          <div className="space-y-4 rounded-xl border border-border-default bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md bg-brand-violet-600/10 text-brand-violet-600">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-body text-text-secondary font-body leading-relaxed">
              بدأت الفكرة من حاجة حقيقية: كثير من الشغوفين بالتصوير يتعلّمون من فيديوهات متفرقة
              بلا متابعة ولا مشاريع حقيقية. بيت المصور يقدّم كورسات منظّمة، مدربين معتمدين،
              منصة تعلم تفاعلية، ولوحة تحكم ذكية للطلاب والمدربين والإدارة.
            </p>
            <p className="text-body text-text-secondary font-body leading-relaxed">
              الهدف ليس فقط «مشاهدة دروس» — بل بناء مهارة قابلة للسوق: إضاءة، تركيب، مونتاج،
              وصناعة محتوى بصري يليق بمحترف.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
