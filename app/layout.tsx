import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import SkipLink from "@/components/SkipLink";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: "بيت المصور | Bayt Al-Mosawer",
  description: "أكاديمية ونظام إدارة علاقات العملاء (CRM) متكامل لمحترفي وهواة التصوير الفوتوغرافي وصناعة الأفلام.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <SkipLink />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
