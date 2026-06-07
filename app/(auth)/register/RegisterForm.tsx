"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register as registerUser } from "@/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const RegisterSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون ثنائيًا على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const response = await registerUser(values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        // Redirect to login
        setTimeout(() => {
          router.push(`/login${from !== "/" ? `?from=${encodeURIComponent(from)}` : ""}`);
        }, 1500);
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-black text-center text-text-primary mb-2">
        إنشاء حساب جديد
      </h2>
      <p className="text-xs text-center text-text-secondary mb-6">
        ابدأ رحلتك التعليمية في التصوير الفوتوغرافي اليوم
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5">
            الاسم الكامل
          </label>
          <input
            type="text"
            disabled={isPending}
            placeholder="الاسم الثنائي أو الثلاثي"
            className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all text-text-primary"
            {...formRegister("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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
            "إنشاء حساب طالب"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-text-secondary">
        لديك حساب بالفعل؟{" "}
        <Link
          href={`/login${from !== "/" ? `?from=${encodeURIComponent(from)}` : ""}`}
          className="font-bold text-brand-indigo hover:text-brand-fuchsia transition-colors"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
