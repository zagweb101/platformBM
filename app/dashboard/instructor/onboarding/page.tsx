"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { applyAsInstructor } from "@/actions/instructor.actions";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const OnboardingSchema = z.object({
  bio: z.string().min(20, "يرجى كتابة سيرة ذاتية مفصلة لا تقل عن 20 حرفًا لتوضيح خبراتك."),
});

type OnboardingValues = z.infer<typeof OnboardingSchema>;

export default function InstructorOnboardingPage() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      bio: "",
    },
  });

  // Fetch current bio if exists (mock/local check is fine since page will refresh, but let's query bio inside page if we want, or user can just type)
  const onSubmit = (values: OnboardingValues) => {
    startTransition(async () => {
      const res = await applyAsInstructor(values);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم تقديم الطلب!");
        setIsSubmitted(true);
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="card-brand p-8 text-center bg-card">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">طلبك قيد المراجعة الآن</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            شكراً لتأكيد سيرتك الذاتية ورغبتك في الانضمام. يرجى الانتظار لحين مراجعة المسؤولين لطلبك وسيتم إشعارك فور اعتماد حسابك كمعلم.
          </p>
          <Link
            href="/dashboard/instructor"
            className="btn-primary inline-block text-sm"
          >
            الذهاب للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-text-primary mb-1">التقديم لتدريس التصوير</h2>
        <p className="text-sm text-text-secondary">
          اكتب نبذة مختصرة عن خبراتك المهنية والعملية في التصوير الفوتوغرافي أو المونتاج أو الإخراج وسنقوم بمراجعتها لاعتماد حسابك كمعلم بالمنصة.
        </p>
      </div>

      <div className="card-brand bg-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              السيرة الذاتية والخبرات المهنية
            </label>
            <textarea
              rows={8}
              disabled={isPending}
              placeholder="اكتب هنا خبراتك المهنية، المعارض التي شاركت بها، مجالات تخصصك (تصوير بورتريه، طبيعة، تعديل ألوان، تصوير سينمائي)، والدورات التي ترغب في تقديمها..."
              className="w-full px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary leading-relaxed"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-subtle">
            <span className="text-xs text-text-muted">
              * بمجرد إرسال طلبك، سيتم مراجعته وتدقيقه في غضون 24 ساعة.
            </span>
            
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال الطلب للمراجعة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
