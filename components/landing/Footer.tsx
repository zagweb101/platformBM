"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function FooterAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `footer-panel-${title.replace(/\s+/g, "-")}`;

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-h-12 items-center justify-between py-3 text-start md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600 rounded-md"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="text-sm font-bold text-white font-heading">{title}</span>
        <ChevronDown
          className={cx(
            "h-5 w-5 text-[#C6C5D5] transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <h4 className="hidden md:block text-sm font-bold text-white mb-5 font-heading">
        {title}
      </h4>

      <div
        id={panelId}
        className={cx("md:block", open ? "block pb-4" : "hidden md:block")}
      >
        {children}
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#C6C5D5] transition-colors hover:border-brand-violet-600/40 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-brand-navy-950 text-[#C6C5D5]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-brand-indigo via-brand-violet-600 to-brand-magenta" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* عمود الشعار */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand p-[1.5px] transition-transform group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-brand-navy-950">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-brand-magenta"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L2 12L12 22L22 12L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white font-heading">بيت المصور</span>
            </Link>

            <p className="text-sm leading-relaxed font-body max-w-sm">
              أكاديمية عربية متخصصة في التصوير الفوتوغرافي وصناعة الأفلام — تعلّم
              عملياً من خبراء المجال.
            </p>

            <div className="flex flex-wrap gap-3">
              {/* TODO: ضع روابط التواصل الاجتماعي الحقيقية */}
              <SocialIcon href="#" label="إنستغرام">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="تويتر">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="يوتيوب">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* روابط سريعة — Accordion على الجوال */}
          <FooterAccordion title="روابط سريعة">
            <ul className="space-y-3 font-body text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">الكورسات</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">الفعاليات</Link></li>
              <li><Link href="/#paths" className="hover:text-white transition-colors">المسارات التعليمية</Link></li>
              <li><Link href="/#instructors" className="hover:text-white transition-colors">المدربون</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">عن الأكاديمية</Link></li>
            </ul>
          </FooterAccordion>

          {/* الدعم — Accordion على الجوال */}
          <FooterAccordion title="الدعم">
            <ul className="space-y-3 font-body text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">سياسة الاسترجاع</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
            </ul>
          </FooterAccordion>

          {/* تواصل معنا — دائماً ظاهر */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-heading">تواصل معنا</h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-11 items-center gap-3 hover:text-white transition-colors"
                  aria-label="واتساب"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true" />
                  {/* TODO: ضع رقم الواتساب الحقيقي هنا */}
                  <span>واتساب — يُحدَّث قريباً</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@baytalmosawer.com"
                  className="inline-flex min-h-11 items-center gap-3 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0 text-brand-violet-500" aria-hidden="true" />
                  <span>info@baytalmosawer.com</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-11 items-center gap-3 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0 text-brand-violet-500" aria-hidden="true" />
                  {/* TODO: ضع رقم الهاتف الحقيقي هنا */}
                  <span>الهاتف — يُحدَّث قريباً</span>
                </a>
              </li>
            </ul>

            <Button
              href="#"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
            >
              {/* TODO: ضع رابط واتساب الحقيقي */}
              تواصل عبر واتساب
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[#C6C5D5] font-body text-center sm:text-start">
            © 2026 بيت المصور. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-body">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="text-white/20" aria-hidden="true">|</span>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
