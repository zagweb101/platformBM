import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
