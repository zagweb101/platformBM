"use client";

import { Printer } from "lucide-react";

export default function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
    >
      <Printer className="w-4 h-4" />
      طباعة / حفظ PDF
    </button>
  );
}
