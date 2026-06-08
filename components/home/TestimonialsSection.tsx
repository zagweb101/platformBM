import Image from "next/image";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

/* TODO: استبدل بآراء حقيقية من قاعدة البيانات */
const TESTIMONIALS = [
  {
    id: "1",
    quote:
      "الكورس غيّر طريقة تصويري بالكامل. التطبيق العملي والمتابعة مع المدرب كانوا ممتازين.",
    name: "TODO: اسم الطالب",
    course: "أساسيات التصوير",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "محتوى منظم وواضح، واستفدت كثيراً من مشاريع نهاية كل وحدة. أنصح به بشدة.",
    name: "TODO: اسم الطالب",
    course: "صناعة الأفلام",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "أفضل استثمار في تطوير مهاراتي. الدعم المستمر والمجتمع الطلابي يفرقان كثيراً.",
    name: "TODO: اسم الطالب",
    course: "المونتاج والمعالجة",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section className="section-dark py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="آراء الطلاب"
          title="ماذا يقول متعلمونا؟"
          description="تجارب حقيقية من طلاب أكملوا مساراتنا التعليمية."
          className="mb-10 sm:mb-12 [&_h2]:text-white [&_p]:text-[#C6C5D5] [&_.text-brand-violet-600]:text-brand-violet-500"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card
              key={item.id}
              variant="bordered"
              padding="md"
              className="border-white/10 bg-brand-navy-900/50"
            >
              <div className="mb-3 flex gap-0.5" aria-label={`${item.rating} نجوم`}>
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-[#C6C5D5] font-body">
                «{item.quote}»
              </blockquote>
              <footer className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white font-heading">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#9794A7] font-body">{item.course}</p>
                </div>
              </footer>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
