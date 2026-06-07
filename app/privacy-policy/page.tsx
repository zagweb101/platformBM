import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "سياسة الخصوصية | بيت المصور",
  description: "سياسة الخصوصية وحماية البيانات الشخصية وفق نظام حماية البيانات الشخصية (PDPL) في المملكة العربية السعودية.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-right">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-cairo mb-2">
          سياسة الخصوصية
        </h1>
        <p className="text-sm text-gray-500 mb-10 font-tajawal">
          آخر تحديث: يونيو 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed font-tajawal">
          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">1. مقدمة</h2>
            <p>
              منصة «بيت المصور» («نحن»، «المنصة») تلتزم بحماية خصوصيتك وبياناتك الشخصية وفق
              نظام حماية البيانات الشخصية (PDPL) الصادر في المملكة العربية السعودية. توضّح هذه
              السياسة كيفية جمع واستخدام وحفظ ومشاركة بياناتك عند استخدام موقعنا وخدماتنا
              التعليمية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">2. البيانات التي نجمعها</h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>بيانات التسجيل: الاسم، البريد الإلكتروني، كلمة المرور (مشفّرة).</li>
              <li>بيانات الدفع: سجلات المعاملات، طريقة الدفع، إيصالات التحويل (لا نخزّن بيانات بطاقات ائتمانية مباشرة عند استخدام مزودي الدفع الخارجيين).</li>
              <li>بيانات التعلم: تقدمك في الدورات، الدروس المكتملة، الشهادات.</li>
              <li>بيانات التواصل: الرسائل المرسلة عبر نموذج التواصل.</li>
              <li>بيانات تقنية: عنوان IP، نوع المتصفح، ملفات تعريف الارتباط (Cookies) الضرورية للجلسة والأمان.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">3. الغرض من المعالجة</h2>
            <p>نستخدم بياناتك من أجل:</p>
            <ul className="list-disc pr-6 space-y-2 mt-2">
              <li>إنشاء حسابك وإدارة الوصول إلى الدورات.</li>
              <li>معالجة المدفوعات والتسجيل في الدورات.</li>
              <li>إرسال إشعارات مهمة (تأكيد الدفع، إعادة تعيين كلمة المرور).</li>
              <li>الرد على استفساراتك وتحسين تجربة المنصة.</li>
              <li>الامتثال للالتزامات القانونية والتنظيمية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">4. الأساس النظامي للمعالجة</h2>
            <p>
              نعالج بياناتك بناءً على موافقتك (عند التسجيل أو إرسال نموذج التواصل)، وتنفيذ
              العقد (تقديم الدورات المسجّل بها)، والمصلحة المشروعة (أمان المنصة ومنع الاحتيال)،
              والالتزامات القانونية حيث ينطبق ذلك.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">5. مشاركة البيانات</h2>
            <p>قد نشارك بيانات محدودة مع:</p>
            <ul className="list-disc pr-6 space-y-2 mt-2">
              <li>مزودي الدفع (Moyasar، Tamara، Tabby) لإتمام المعاملات.</li>
              <li>مزودي البريد الإلكتروني (Resend) لإرسال الرسائل الت transactional.</li>
              <li>مزودي استضافة الفيديو (Cloudflare Stream، Vimeo) لتشغيل محتوى الدورات المحمي.</li>
              <li>مزودي التخزين السحابي (UploadThing) لرفع الملفات.</li>
            </ul>
            <p className="mt-2">لا نبيع بياناتك الشخصية لأطراف ثالثة.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">6. مدة الاحتفاظ</h2>
            <p>
              نحتفظ ببياناتك طوال مدة نشاط حسابك أو حسب ما تقتضيه المتطلبات القانونية
              (مثل سجلات المدفوعات). يمكنك طلب حذف حسابك وفقاً للقسم 7.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">7. حقوقك</h2>
            <p>بموجب PDPL، يحق لك:</p>
            <ul className="list-disc pr-6 space-y-2 mt-2">
              <li>الاطلاع على بياناتك الشخصية وطلب نسخة منها.</li>
              <li>تصحيح البيانات غير الدقيقة.</li>
              <li>طلب حذف بياناتك (مع مراعاة الالتزامات القانونية).</li>
              <li>سحب الموافقة حيث تكون المعالجة قائمة عليها.</li>
              <li>تقديم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA).</li>
            </ul>
            <p className="mt-2">
              لممارسة حقوقك:{" "}
              <a href="mailto:privacy@baytalmosawer.com" className="text-brand-indigo hover:underline">
                privacy@baytalmosawer.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">8. الأمان</h2>
            <p>
              نطبّق إجراءات تقنية وتنظيمية مناسبة (تشفير كلمات المرور، HTTPS، التحقق من
              الصلاحيات، روابط فيديو موقّعة) لحماية بياناتك من الوصول غير المصرح به.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">9. ملفات تعريف الارتباط</h2>
            <p>
              نستخدم cookies ضرورية لتسجيل الدخول والجلسة. لا نستخدم cookies إعلانية بدون
              موافقتك. يمكنك إدارة التفضيلات من شريط الموافقة في الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">10. التعديلات</h2>
            <p>
              قد نحدّث هذه السياسة periodically. سننشر النسخة المحدّثة على هذه الصفحة مع
              تاريخ التحديث.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white font-cairo mb-3">11. التواصل</h2>
            <p>
              بيت المصور — جدة، المملكة العربية السعودية
              <br />
              البريد:{" "}
              <a href="mailto:info@baytalmosawer.com" className="text-brand-indigo hover:underline">
                info@baytalmosawer.com
              </a>
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-500">
          راجع أيضاً{" "}
          <Link href="/terms-of-service" className="text-brand-indigo hover:underline">
            شروط الاستخدام
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
