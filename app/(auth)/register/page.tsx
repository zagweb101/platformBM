import RegisterForm from "./RegisterForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary text-sm">
        <Loader2 className="w-8 h-8 animate-spin text-brand-indigo mb-2" />
        جاري تحميل صفحة إنشاء الحساب...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
