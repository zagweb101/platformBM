"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "bm_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="موافقة ملفات تعريف الارتباط"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-gray-800 bg-[#0a0a0f]/95 backdrop-blur-md shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-right">
        <p className="flex-1 text-xs sm:text-sm text-gray-400 font-tajawal leading-relaxed">
          نستخدم ملفات تعريف الارتباط (Cookies) الضرورية لتسجيل الدخول وتحسين تجربتك.
          بمتابعة التصفح، فإنك توافق على{" "}
          <Link href="/privacy-policy" className="text-brand-indigo hover:underline">
            سياسة الخصوصية
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-indigo hover:bg-brand-violet transition-colors font-cairo"
        >
          موافق
        </button>
      </div>
    </div>
  );
}
