#!/usr/bin/env npx tsx
/**
 * Validates required environment variables and reports integration status.
 * Run: npm run env:check
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(name: string) {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.production");

const PRODUCTION_URL = "https://platformbm-production.up.railway.app";

const checks: {
  key: string;
  required: "critical" | "recommended" | "optional";
  label: string;
  validate?: (v: string) => boolean;
}[] = [
  { key: "DATABASE_URL", required: "critical", label: "PostgreSQL" },
  { key: "NEXTAUTH_SECRET", required: "critical", label: "NextAuth secret", validate: (v) => v.length >= 32 },
  {
    key: "NEXTAUTH_URL",
    required: "critical",
    label: "App URL",
    validate: (v) => v.startsWith("http"),
  },
  { key: "UPLOADTHING_SECRET", required: "recommended", label: "UploadThing" },
  { key: "UPLOADTHING_APP_ID", required: "recommended", label: "UploadThing App ID" },
  { key: "RESEND_API_KEY", required: "recommended", label: "Resend email" },
  { key: "EMAIL_FROM", required: "recommended", label: "Sender email" },
  { key: "CONTACT_ADMIN_EMAIL", required: "recommended", label: "Contact inbox" },
  { key: "MOYASAR_SECRET_KEY", required: "optional", label: "Moyasar" },
  { key: "MOYASAR_PUBLISHABLE_KEY", required: "optional", label: "Moyasar public" },
  { key: "TAMARA_API_TOKEN", required: "optional", label: "Tamara" },
  { key: "TABBY_SECRET_KEY", required: "optional", label: "Tabby" },
  { key: "CLOUDFLARE_STREAM_CUSTOMER_CODE", required: "optional", label: "Cloudflare Stream" },
];

console.log("\n=== Environment Check ===\n");

let criticalMissing = 0;
let recommendedMissing = 0;

for (const c of checks) {
  const val = process.env[c.key];
  const ok = val && (!c.validate || c.validate(val));
  const icon = ok ? "✅" : c.required === "critical" ? "❌" : "⚠️";
  console.log(`${icon} ${c.label} (${c.key})${ok ? "" : " — missing or invalid"}`);
  if (!ok) {
    if (c.required === "critical") criticalMissing++;
    if (c.required === "recommended") recommendedMissing++;
  }
}

if (process.env.NEXTAUTH_URL === "http://localhost:3000") {
  console.log("\n⚠️  NEXTAUTH_URL is localhost — set to production URL on Railway:");
  console.log(`   ${PRODUCTION_URL}`);
}

console.log(`\nSummary: ${criticalMissing} critical, ${recommendedMissing} recommended missing\n`);
process.exit(criticalMissing > 0 ? 1 : 0);
