"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="card-brand p-8 bg-card max-w-md w-full space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-text-primary">حدث خطأ غير متوقع!</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          عذراً، حدث خطأ ما أثناء تحميل هذه الصفحة في لوحة التحكم. يمكنك محاولة إعادة المحاولة أو الرجوع للرئيسية.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary flex items-center gap-1.5 text-xs py-2 px-5"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="px-5 py-2 rounded-xl border border-subtle bg-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated text-xs font-semibold transition-colors"
          >
            الرجوع للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
