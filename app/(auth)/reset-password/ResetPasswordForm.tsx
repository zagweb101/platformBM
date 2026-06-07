"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPassword } from "@/actions/password.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";

const ResetSchema = z
  .object({
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof ResetSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetValues) => {
    startTransition(async () => {
      const res = await resetPassword({
        token,
        password: values.password,
      });
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم تحديث كلمة المرور.");
        router.push("/login");
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-center text-text-primary mb-2">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-xs text-center text-text-secondary mb-6">
        أدخل كلمة المرور الجديدة لحسابك
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary pl-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            تأكيد كلمة المرور
          </label>
          <input
            type={showPassword ? "text" : "password"}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
              <Lock className="w-4 h-4" />
              حفظ كلمة المرور الجديدة
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
