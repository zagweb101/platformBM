"use client";

import Link from "next/link";
// Inline SVGs used for social links to ensure compile compatibility

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0a0a0f] border-t border-gray-900/60 z-20">
      {/* Brand Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-right">
          
          {/* Column 1: Logo & Description (4/12 width on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-start md:items-end justify-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-fuchsia p-[1.5px] transition-transform duration-300 group-hover:rotate-12">
                <div className="w-full h-full bg-[#0a0a0f] rounded-[7px] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-fuchsia">
                    <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia bg-clip-text text-fill-transparent webkit-text-fill-transparent font-cairo">
                بيت المصور
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-tajawal">
              الأكاديمية الأولى في المملكة العربية السعودية لتعليم وتطوير مهارات التصوير الفوتوغرافي والفيديو السينمائي وصناعة الأفلام والمونتاج من الصفر للاحتراف المتقدم.
            </p>
          </div>

          {/* Column 2: Quick Links (2/12 width) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-cairo">
              روابط سريعة
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/#courses" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  الكورسات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  عن الأكاديمية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (2/12 width) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-cairo">
              أحدث الكورسات
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/#courses" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  أساسيات التصوير
                </Link>
              </li>
              <li>
                <Link href="/#courses" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  صناعة أفلام الهاتف
                </Link>
              </li>
              <li>
                <Link href="/#courses" className="text-sm text-gray-400 hover:text-white transition-colors font-tajawal">
                  تحرير Lightroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social (3/12 width) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-cairo">
              تواصل معنا
            </h4>
            <p className="text-sm text-gray-400 mb-6 font-tajawal leading-relaxed">
              جدة، حي الروضة
              <br />
              info@baytalmosawer.com
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 items-center justify-start lg:justify-start">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-indigo transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-violet transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-fuchsia transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/5 hover:border-[#25D366]/30 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Terms */}
      <div className="bg-[#07070b] py-6 border-t border-gray-900/40 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-tajawal">
            © {new Date().getFullYear()} بيت المصور. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 font-tajawal">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
