import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { InstructorCard } from "@/components/ui/InstructorCard";
import { getApprovedInstructors } from "@/lib/home-data";

export function InstructorsLoading() {
  return (
    <section id="instructors" className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InstructorsSkeleton />
      </div>
    </section>
  );
}

function InstructorsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} variant="card" className="h-[480px]" />
      ))}
    </div>
  );
}

export default async function InstructorsSection() {
  const instructors = await getApprovedInstructors();

  return (
    <section id="instructors" className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="فريق التدريب"
          title="تعلّم من نخبة المدربين"
          description="مدربون معتمدون يجمعون بين الخبرة العملية والشغف بالتعليم."
          className="mb-10 sm:mb-12"
        />

        {instructors.length === 0 ? (
          <p className="text-center text-text-secondary font-body">
            سيتم إضافة المدربين قريباً.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
