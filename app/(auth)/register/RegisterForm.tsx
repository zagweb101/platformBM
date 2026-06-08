"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register as registerUser } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import {
  buildAuthQuery,
  useAuthRedirectParam,
} from "@/components/auth/useAuthRedirectParam";

const RegisterSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون ثنائيًا على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const redirectTo = useAuthRedirectParam("/");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const { acceptTerms, confirmPassword, ...registerData } = values;
      void acceptTerms;
      void confirmPassword;
      const response = await registerUser(registerData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        setTimeout(() => {
          router.push(`/login${buildAuthQuery(redirectTo)}`);
        }, 1500);
      }
    });
  };

  const authQuery = buildAuthQuery(redirectTo);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          أنشئ حسابك
        </h1>
        <p className="mt-2 text-sm text-text-secondary font-body">
          ابدأ رحلتك في عالم التصوير وصناعة الأفلام
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="الاسم الكامل"
          type="text"
          autoComplete="name"
          disabled={isPending}
          error={errors.name?.message}
          icon={<User className="h-5 w-5" aria-hidden="true" />}
          {...register("name")}
        />

        <Input
          label="البريد الإلكتروني"
          type="email"
          inputMode="email"
          autoComplete="email"
          disabled={isPending}
          error={errors.email?.message}
          icon={<Mail className="h-5 w-5" aria-hidden="true" />}
          {...register("email")}
        />

        <div>
          <PasswordInput
            label="كلمة المرور"
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

        <div className="space-y-2">
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm font-body">
            <input
              type="checkbox"
              disabled={isPending}
              className="mt-1 h-4 w-4 rounded border-border-default text-brand-violet-600 focus:ring-brand-violet-600"
              {...register("acceptTerms")}
            />
            <span className="leading-relaxed text-text-secondary">
              أوافق على{" "}
              <Link
                href="/terms-of-service"
                target="_blank"
                className="font-semibold text-brand-violet-600 hover:underline"
              >
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="font-semibold text-brand-violet-600 hover:underline"
              >
                سياسة الخصوصية
              </Link>
            </span>
          </label>
          {errors.acceptTerms ? (
            <p className="text-sm text-[#DC2626] font-body" role="alert">
              {errors.acceptTerms.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full">
          إنشاء حساب
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary font-body">
        لديك حساب بالفعل؟{" "}
        <Link
          href={`/login${authQuery}`}
          className="font-semibold text-brand-violet-600 hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
