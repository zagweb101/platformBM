import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PATHS = [
  {
    id: "basics",
    title: "أساسيات التصوير",
    level: "المبتدئون",
    description: "ابنِ أساساً قوياً في التعريض والتكوين والإضاءة.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "lighting",
    title: "الإضاءة والبورتريه",
    level: "متوسط",
    description: "أتقن إضاءة الاستوديو والتصوير الشخصي الاحترافي.",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "filmmaking",
    title: "صناعة الأفلام",
    level: "متقدم",
    description: "من الفكرة إلى المونتاج — صناعة أفلام قصيرة احترافية.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "editing",
    title: "المونتاج والمعالجة",
    level: "متوسط",
    description: "تعلّم Lightroom وPremiere لإخراج محتوى بصري متميز.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "mobile",
    title: "المحتوى بالجوال",
    level: "المبتدئون",
    description: "اصنع محتوى بصرياً جذاباً بكاميرا هاتفك فقط.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
  },
] as const;

function levelVariant(level: string) {
  if (level.includes("مبتد")) return "info" as const;
  if (level.includes("متقد")) return "brand" as const;
  return "warning" as const;
}

export default function LearningPathsSection() {
  return (
    <section id="paths" className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="مسارات تعليمية"
          title="اختر مسارك التعليمي"
          description="مسارات مصممة لتناسب مستواك وأهدافك — من الأساسيات إلى الاحتراف."
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PATHS.map((path) => (
            <Card key={path.id} variant="default" padding="sm" className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={path.image}
                  alt={path.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-card font-heading font-bold text-[#151525]">
                    {path.title}
                  </h3>
                  <Badge variant={levelVariant(path.level)} size="sm">
                    {path.level}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted font-body line-clamp-2">
                  {path.description}
                </p>
                <Button href="/#courses" variant="outline" size="sm">
                  استكشف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
