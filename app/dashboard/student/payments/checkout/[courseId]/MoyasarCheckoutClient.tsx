"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Moyasar?: {
      init: (config: Record<string, unknown>) => void;
    };
  }
}

interface MoyasarCheckoutClientProps {
  courseTitle: string;
  amountHalalas: number;
  publishableKey: string;
  callbackUrl: string;
}

export default function MoyasarCheckoutClient({
  courseTitle,
  amountHalalas,
  publishableKey,
  callbackUrl,
}: MoyasarCheckoutClientProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!scriptReady || !window.Moyasar || !formRef.current || initialized.current) {
      return;
    }

    initialized.current = true;
    window.Moyasar.init({
      element: formRef.current,
      amount: amountHalalas,
      currency: "SAR",
      description: courseTitle,
      publishable_api_key: publishableKey,
      callback_url: callbackUrl,
      methods: ["creditcard", "applepay", "stcpay"],
    });
  }, [scriptReady, amountHalalas, courseTitle, publishableKey, callbackUrl]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.0.14/dist/moyasar.min.css"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.0.14/dist/moyasar.umd.min.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={formRef} className="mysr-form min-h-[320px]" />
    </>
  );
}
