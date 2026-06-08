"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPassword } from "@/actions/password.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          إعادة تعيين كلمة المرور
        </h1>
        <p className="mt-2 text-sm text-text-secondary font-body">
          أدخل كلمة المرور الجديدة لحسابك
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <PasswordInput
            label="كلمة المرور الجديدة"
            autoComplete="new-password"
            disabled={isPending}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthIndicator password={passwordValue} />
        </div>

        <PasswordInput
          label="تأكيد كلمة المرور"
          autoComplete="new-password"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          حفظ كلمة المرور الجديدة
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
