"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { requestPasswordReset } from "@/actions/password.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ForgotSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

type ForgotValues = z.infer<typeof ForgotSchema>;

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotValues) => {
    startTransition(async () => {
      const res = await requestPasswordReset(values);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم إرسال رابط إعادة التعيين.");
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          نسيت كلمة المرور؟
        </h1>
        <p className="mt-2 text-sm text-text-secondary font-body">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="البريد الإلكتروني"
          type="email"
          autoComplete="email"
          disabled={isPending}
          error={errors.email?.message}
          icon={<Mail className="h-5 w-5" aria-hidden="true" />}
          {...register("email")}
        />

        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          إرسال رابط إعادة التعيين
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary font-body">
        <Link href="/login" className="font-semibold text-brand-violet-600 hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
