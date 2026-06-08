/**
 * Resolves the public app URL for emails, callbacks, and BNPL redirects.
 * Railway injects RAILWAY_PUBLIC_DOMAIN automatically at runtime.
 */
export function getAppUrl(): string {
  const explicit =
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (railwayDomain) {
    return `https://${railwayDomain.replace(/^https?:\/\//, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
