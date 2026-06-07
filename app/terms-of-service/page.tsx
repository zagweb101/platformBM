import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "شروط الاستخدام | بيت المصور",
  description: "شروط وأحكام استخدام منصة بيت المصور للتعليم في التصوير الفوتوغرافي.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-right">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-cairo mb-2">
          شروط الاستخدام
        </h1>
        <p className="text-sm text-gray-500 mb-10 font-tajawal">
          آخر تحديث: يونيو 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed font-tajawal">
          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">1. القبول</h2>
            <p>
              باستخدامك منصة «بيت المصور»، فإنك توافق على هذه الشروط وسياسة الخصوصية. إذا
              لم توافق، يرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">2. الحسابات</h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>يجب أن تكون بيانات التسجيل صحيحة ومحدّثة.</li>
              <li>أنت مسؤول عن سرية كلمة المرور وجميع الأنشطة على حسابك.</li>
              <li>يحق للمنصة تعليق أو إنهاء الحساب عند مخالفة هذه الشروط.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">3. الدورات والمحتوى</h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>محتوى الدورات (فيديو، نصوص، مواد) محمي بحقوق الملكية الفكرية.</li>
              <li>يُمنع نسخ أو توزيع أو إعادة بيع المحتوى أو مشاركة حسابك مع الغير.</li>
              <li>الوصول إلى الدورات يقتصر على المسجّلين والمدفوع لهم وفق سياسة كل دورة.</li>
              <li>محتوى الفيديو محمي بتقنيات توقيع (Cloudflare Stream / Vimeo) ويُحظر تسجيله أو تنزيله بغير إذن.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">4. المدفوعات والاسترداد</h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>الأسعار معروضة بالريال السعودي وتشمل ضريبة القيمة المضافة حيث ينطبق.</li>
              <li>طرق الدفع تشمل التحويل البنكي، Moyasar، Tamara، وTabby حسب التوفر.</li>
              <li>سياسة الاسترداد: يمكن طلب استرداد خلال 7 أيام من الشراء إذا لم تتجاوز مشاهدة 20% من محتوى الدورة، ما لم ينص عرض خاص على غير ذلك.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">5. المدربون</h2>
            <p>
              المدربون المعتمدون مسؤولون عن دقة محتواهم. تحتفظ المنصة بحق مراجعة الدورات
              ورفض نشرها أو إزالتها إذا خالفت المعايير أو القوانين.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">6. إخلاء المسؤولية</h2>
            <p>
              تُقدَّم المنصة «كما هي». لا نضمن خلو الخدمة من الانقطاعات. النتائج التعليمية
              تعتمد على جهد المتعلم ولا تُعد ضماناً مهنياً.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">7. تحديد المسؤولية</h2>
            <p>
              في الحدود التي يسمح بها النظام، لا تتحمل «بيت المصور» مسؤولية عن أضرار غير
              مباشرة أو خسارة أرباح ناتجة عن استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">8. القانون الحاكم</h2>
            <p>
              تخضع هذه الشروط لأنظمة المملكة العربية السعودية. أي نزاع يُحال إلى الجهات
              القضائية المختصة في المملكة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">9. التواصل</h2>
            <p>
              للاستفسارات القانونية:{" "}
              <a href="mailto:legal@baytalmosawer.com" className="text-brand-indigo hover:underline">
                legal@baytalmosawer.com
              </a>
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-500">
          راجع أيضاً{" "}
          <Link href="/privacy-policy" className="text-brand-indigo hover:underline">
            سياسة الخصوصية
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
