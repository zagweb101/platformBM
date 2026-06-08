import { CheckCircle2 } from "lucide-react";

const TRUST_ITEMS = [
  "كورسات عملية من الصفر",
  "متابعة مباشرة مع المدرب",
  "شهادة إتمام من بيت المصور",
  "مجتمع طلاب نشط",
] as const;

export default function TrustBar() {
  return (
    <section className="w-full bg-surface-section border-y border-border-soft">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-6">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#151525] font-body lg:justify-start"
            >
              <CheckCircle2
                className="h-5 w-5 shrink-0 text-brand-violet-600"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
