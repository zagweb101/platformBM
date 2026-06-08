"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import {
  buildAuthQuery,
  useAuthRedirectParam,
} from "@/components/auth/useAuthRedirectParam";

const LoginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const redirectTo = useAuthRedirectParam("/");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      const response = await login({
        email: values.email,
        password: values.password,
      });
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success(response?.success || "تم تسجيل الدخول بنجاح!");
        router.refresh();
        setTimeout(() => {
          router.push(redirectTo);
        }, 150);
      }
    });
  };

  const authQuery = buildAuthQuery(redirectTo);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          مرحباً بعودتك
        </h1>
        <p className="mt-2 text-sm text-text-secondary font-body">
          سجّل دخولك لمتابعة تعلمك
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

        <PasswordInput
          label="كلمة المرور"
          autoComplete="current-password"
          disabled={isPending}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-body">
            <input
              type="checkbox"
              disabled={isPending}
              className="h-4 w-4 rounded border-border-default text-brand-violet-600 focus:ring-brand-violet-600"
              {...register("rememberMe")}
            />
            <span className="text-[#151525]">تذكرني</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-brand-violet-600 hover:underline font-body"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          تسجيل الدخول
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary font-body">
        ليس لديك حساب؟{" "}
        <Link
          href={`/register${authQuery}`}
          className="font-semibold text-brand-violet-600 hover:underline"
        >
          أنشئ حساباً
        </Link>
      </p>
    </div>
  );
}
