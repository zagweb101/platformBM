"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { requestPasswordReset } from "@/actions/password.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

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
      <h2 className="text-2xl font-black text-center text-text-primary mb-2">
        نسيت كلمة المرور؟
      </h2>
      <p className="text-xs text-center text-text-secondary mb-6">
        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            disabled={isPending}
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-6"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4" />
              إرسال رابط إعادة التعيين
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-text-secondary">
        <Link
          href="/login"
          className="font-bold text-brand-indigo hover:text-brand-fuchsia transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
