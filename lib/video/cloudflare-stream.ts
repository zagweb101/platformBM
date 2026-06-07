import { SignJWT, importPKCS8 } from "jose";

export function isCloudflareStreamConfigured() {
  return Boolean(
    process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE &&
      process.env.CLOUDFLARE_STREAM_KEY_ID &&
      process.env.CLOUDFLARE_STREAM_SIGNING_KEY
  );
}

function normalizePemKey(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.includes("BEGIN")) {
    return trimmed.replace(/\\n/g, "\n");
  }
  return `-----BEGIN PRIVATE KEY-----\n${trimmed}\n-----END PRIVATE KEY-----`;
}

export async function createCloudflareStreamToken(videoUid: string) {
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;
  const signingKey = process.env.CLOUDFLARE_STREAM_SIGNING_KEY;

  if (!keyId || !signingKey) {
    throw new Error("Cloudflare Stream signing is not configured");
  }

  const privateKey = await importPKCS8(normalizePemKey(signingKey), "RS256");
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;

  return new SignJWT({
    sub: videoUid,
    kid: keyId,
    exp: expiresAt,
    accessRules: [
      {
        type: "any",
        action: "allow",
      },
    ],
  })
    .setProtectedHeader({ alg: "RS256", kid: keyId })
    .setExpirationTime(expiresAt)
    .sign(privateKey);
}

export async function getCloudflareStreamEmbedUrl(videoUid: string) {
  const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE;
  if (!customerCode) {
    throw new Error("CLOUDFLARE_STREAM_CUSTOMER_CODE is not configured");
  }

  const token = await createCloudflareStreamToken(videoUid);
  return `https://customer-${customerCode}.cloudflarestream.com/${videoUid}/iframe?token=${token}`;
}
