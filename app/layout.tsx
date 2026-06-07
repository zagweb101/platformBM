import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" dir="rtl" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
