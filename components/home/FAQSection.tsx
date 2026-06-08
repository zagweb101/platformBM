"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "كيف أبدأ الاشتراك؟",
    answer:
      "أنشئ حساباً مجانياً، اختر الكورس المناسب، ثم أكمل عملية الدفع. بعد التفعيل ستجد الكورس في لوحة الطالب.",
  },
  {
    question: "هل الكورسات حضورية أم أونلاين؟",
    answer:
      "معظم كورساتنا أونلاين مع محتوى مسجّل يمكنك مشاهدته في أي وقت. بعض البرامج قد تتضمن جلسات مباشرة حسب الكورس.",
  },
  {
    question: "هل أحصل على شهادة؟",
    answer:
      "نعم، عند إكمال جميع دروس الكورس والمتطلبات تحصل على شهادة إتمام رقمية من بيت المصور.",
  },
  {
    question: "ما طرق الدفع المتاحة؟",
    answer:
      "ندعم الدفع الإلكتروني عبر بوابات متعددة، بالإضافة إلى خيارات التقسيط حسب توفر الخدمة في منطقتك.",
  },
  {
    question: "هل يمكنني الوصول للمحتوى بعد انتهاء الكورس؟",
    answer:
      "نعم، بعد التسجيل تحصل على وصول مدى الحياة لمحتوى الكورس ما لم يُذكر خلاف ذلك في صفحة الكورس.",
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-light py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-violet-600 font-body">
            أسئلة شائعة
          </p>
          <h2 className="mt-2 text-section font-heading font-bold text-[#151525]">
            كل ما تحتاج معرفته
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-lg border border-border-default bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet-600"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="font-semibold text-[#151525] font-body">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen ? (
                  <div
                    id={panelId}
                    className="border-t border-border-soft px-5 pb-4 pt-2 text-sm leading-relaxed text-text-secondary font-body"
                  >
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
