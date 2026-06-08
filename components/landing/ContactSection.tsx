"use client";

import { useState, useTransition } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { submitContactForm } from "@/actions/contact.actions";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "استفسار عام",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    startTransition(async () => {
      const result = await submitContactForm(form);
      if (result.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
        setForm({ name: "", email: "", subject: "استفسار عام", message: "" });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isSending = status === "sending" || isPending;

  return (
    <section id="contact" className="relative w-full py-24 bg-[#0f0f1a]/50 border-b border-gray-900 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-fuchsia/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between text-right">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase mb-3 font-tajawal">✦ تواصل معنا</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-cairo mb-6">
                يسعدنا سماع صوتك
              </h3>
              <p className="text-gray-400 text-base font-tajawal mb-10">
                لديك استفسار عن الكورسات، الشهادات أو ترغب في التعاون معنا؟ فريقنا متواجد دائماً لمساعدتك في أي وقت.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0f] border border-gray-900 shadow-md">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-indigo/10 text-brand-indigo shrink-0 border border-brand-indigo/15">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-cairo mb-1">الموقع</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-tajawal">جدة، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0f] border border-gray-900 shadow-md">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-violet/10 text-brand-violet shrink-0 border border-brand-violet/15">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-cairo mb-1">الهاتف</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-almarai" dir="ltr">+966 50 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0f] border border-gray-900 shadow-md">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-fuchsia/10 text-brand-fuchsia shrink-0 border border-brand-fuchsia/15">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-cairo mb-1">البريد الإلكتروني</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-tajawal">info@baytalmosawer.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-0">
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-[#25D366] bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366]/10 transition-colors font-tajawal"
              >
                <MessageCircle className="w-5 h-5" />
                تحدث معنا مباشرة عبر الواتساب
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0a0a0f]/60 backdrop-blur-md border border-gray-900/80 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2 text-right">
                  <label htmlFor="name" className="text-xs font-bold text-gray-400 font-cairo">الاسم الكريم</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="مثال: فيصل الحربي"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0f0f1a]/80 border border-gray-900 focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo/35 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-tajawal text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2 text-right">
                  <label htmlFor="email" className="text-xs font-bold text-gray-400 font-cairo">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="faisal@example.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0f0f1a]/80 border border-gray-900 focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo/35 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-tajawal text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2 text-right">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-400 font-cairo">الموضوع</label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0f0f1a]/80 border border-gray-900 focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo/35 text-white focus:outline-none transition-all duration-300 font-tajawal text-sm"
                  >
                    <option className="bg-[#0a0a0f]" value="استفسار عام">استفسار عام</option>
                    <option className="bg-[#0a0a0f]" value="الدعم الفني">الدعم الفني والمنصة</option>
                    <option className="bg-[#0a0a0f]" value="التحاق كمدرب">الالتحاق كمدرب بالأكاديمية</option>
                    <option className="bg-[#0a0a0f]" value="الرعايات والشراكات">الرعايات والشراكات</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 text-right">
                  <label htmlFor="message" className="text-xs font-bold text-gray-400 font-cairo">رسالتك</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="اكتب تفاصيل رسالتك هنا..."
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0f0f1a]/80 border border-gray-900 focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo/35 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-tajawal text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia hover:shadow-[0_0_20px_rgba(79,70,229,0.25)] transition-all duration-300 disabled:opacity-55 font-cairo"
                >
                  {isSending ? (
                    <span>جاري الإرسال...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 transform rotate-180" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>

                {status === "success" && (
                  <div className="text-center p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold font-tajawal">
                    تم إرسال رسالتك بنجاح! وسيتواصل معك فريقنا في أقرب وقت.
                  </div>
                )}
                {status === "error" && errorMessage && (
                  <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold font-tajawal">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/966500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-40 flex min-h-14 min-w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        aria-label="تواصل معنا عبر واتساب"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.218h.004c5.506 0 9.989-4.478 9.99-9.984A9.998 9.998 0 0012.012 2zm5.835 14.127c-.244.688-1.22 1.259-1.68 1.306-.459.047-.905.088-2.887-.696-2.536-1.002-4.14-3.566-4.267-3.736-.127-.17-1.026-1.365-1.026-2.603 0-1.239.646-1.849.877-2.098.231-.248.508-.311.678-.311h.482c.152 0 .382-.057.593.453.212.51.722 1.758.786 1.886.064.127.106.276.021.446-.085.17-.127.276-.254.425-.127.149-.269.333-.383.446-.128.127-.262.266-.113.521.149.255.661 1.083 1.417 1.754.975.867 1.794 1.135 2.049 1.263.255.127.404.106.553-.064.149-.17.637-.743.807-1.02.17-.276.339-.234.573-.149.234.085 1.485.701 1.74 1.829.255 1.127.255 1.637.011 2.325z" />
        </svg>
      </a>
    </section>
  );
}
