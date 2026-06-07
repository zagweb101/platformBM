"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register as registerUser } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const RegisterSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون ثنائيًا على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "يجب الموافقة على سياسة الخصوصية وشروط الاستخدام",
  }),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [from, setFrom] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get("from");
      if (fromParam) {
        setFrom(fromParam);
      }
    }
  }, []);

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
      acceptTerms: false,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const { acceptTerms, ...registerData } = values;
      void acceptTerms;
      const response = await registerUser(registerData);
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

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="acceptTerms"
            disabled={isPending}
            className="mt-1 rounded border-subtle"
            {...formRegister("acceptTerms")}
          />
          <label htmlFor="acceptTerms" className="text-xs text-text-secondary leading-relaxed">
            أوافق على{" "}
            <Link href="/privacy-policy" target="_blank" className="text-brand-indigo hover:underline font-semibold">
              سياسة الخصوصية
            </Link>{" "}
            و{" "}
            <Link href="/terms-of-service" target="_blank" className="text-brand-indigo hover:underline font-semibold">
              شروط الاستخدام
            </Link>
            .
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
        )}

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
