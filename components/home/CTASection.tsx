import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="gradient-brand py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading
          title="ابدأ رحلتك في عالم التصوير اليوم"
          description="انضم إلى مئات الطلاب الذين حوّلوا شغفهم إلى مهارة احترافية."
          align="center"
          className="mx-auto mb-8 [&_h2]:text-white [&_p]:text-white/85"
        />

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href="/register"
            variant="secondary"
            size="lg"
            className="w-full bg-white text-[#151525] hover:bg-white/90 sm:w-auto"
          >
            أنشئ حساباً مجاناً
          </Button>
          <Button
            href="/#courses"
            variant="outline"
            size="lg"
            className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
          >
            استعرض الكورسات
          </Button>
        </div>
      </div>
    </section>
  );
}
