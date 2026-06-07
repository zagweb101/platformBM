"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      const response = await login(values);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success(response?.success || "تم تسجيل الدخول بنجاح!");
        
        // NextAuth router refresh to fetch session
        router.refresh();
        
        // Wait briefly for middleware session refresh, then redirect
        setTimeout(() => {
          router.push(from);
        }, 150);
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-center text-text-primary mb-2">
        تسجيل الدخول
      </h2>
      <p className="text-xs text-center text-text-secondary mb-6">
        أهلاً بك مجدداً في بيت المصور
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
            {...formRegister("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={isPending}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary pl-10"
              {...formRegister("password")}
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

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-6"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-text-secondary">
        ليس لديك حساب؟{" "}
        <Link
          href={`/register${from !== "/" ? `?from=${encodeURIComponent(from)}` : ""}`}
          className="font-bold text-brand-indigo hover:text-brand-fuchsia transition-colors"
        >
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}
