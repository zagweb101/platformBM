import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop";

const FEATURES = [
  "كورسات عملية من الصفر",
  "متابعة مباشرة مع المدرب",
  "شهادة إتمام معتمدة",
] as const;

export default function AuthVisualPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-brand-navy-950 lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #101A55 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-8 p-10 xl:p-14">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>

        <div className="relative aspect-[16/10] w-full max-w-lg overflow-hidden rounded-xl border border-white/10 shadow-brand">
          <Image
            src={AUTH_IMAGE}
            alt="تعلّم التصوير في بيت المصور"
            fill
            sizes="(max-width: 1280px) 50vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-transparent to-transparent" />
        </div>

        <blockquote className="max-w-md space-y-4">
          <p className="text-lg leading-relaxed text-[#C6C5D5] font-body">
            «بيت المصور غيّر طريقة تعلّمي للتصوير — محتوى عملي ومدربون يتابعون معك خطوة
            بخطوة.»
          </p>
          <footer className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="صورة خريج أكاديمية بيت المصور"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white font-heading">خالد العتيبي</p>
              <p className="text-xs text-[#9794A7] font-body">خريج كورس أساسيات التصوير</p>
            </div>
          </footer>
        </blockquote>

        <ul className="space-y-3">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-[#C6C5D5] font-body"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AuthMobileVisual() {
  return (
    <div className="mb-8 lg:hidden">
      <Link href="/" className="mb-4 inline-flex">
        <Logo />
      </Link>
      <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border-default">
        <Image
          src={AUTH_IMAGE}
          alt="بيت المصور"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy-950/40" />
      </div>
    </div>
  );
}
