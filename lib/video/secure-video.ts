import {
  getCloudflareStreamEmbedUrl,
  isCloudflareStreamConfigured,
} from "@/lib/video/cloudflare-stream";
import {
  extractVimeoIdFromUrl,
  getVimeoEmbedUrl,
  getVimeoSignedPlayUrl,
  isVimeoConfigured,
} from "@/lib/video/vimeo";
import type { VideoProvider } from "@prisma/client";

export type SecureVideoEmbed =
  | {
      type: "iframe";
      src: string;
      provider: "cloudflare" | "vimeo";
    }
  | {
      type: "native";
      src: string;
      provider: "direct" | "vimeo";
    }
  | {
      type: "none";
    };

interface LessonVideoInput {
  videoUrl: string | null;
  videoProvider: VideoProvider;
  videoId: string | null;
  videoPrivacyHash: string | null;
}

export async function resolveSecureVideo(
  lesson: LessonVideoInput
): Promise<SecureVideoEmbed> {
  const provider = lesson.videoProvider;
  const videoId = lesson.videoId;

  if (provider === "CLOUDFLARE_STREAM" && videoId) {
    if (!isCloudflareStreamConfigured()) {
      return { type: "none" };
    }

    try {
      const src = await getCloudflareStreamEmbedUrl(videoId);
      return { type: "iframe", src, provider: "cloudflare" };
    } catch (error) {
      console.error("Cloudflare Stream signing failed:", error);
      return { type: "none" };
    }
  }

  if (provider === "VIMEO") {
    const vimeoId = videoId || (lesson.videoUrl ? extractVimeoIdFromUrl(lesson.videoUrl) : null);
    if (!vimeoId) return { type: "none" };

    if (isVimeoConfigured()) {
      const signedUrl = await getVimeoSignedPlayUrl(vimeoId, lesson.videoPrivacyHash);
      if (signedUrl) {
        return { type: "native", src: signedUrl, provider: "vimeo" };
      }
    }

    return {
      type: "iframe",
      src: getVimeoEmbedUrl(vimeoId, lesson.videoPrivacyHash),
      provider: "vimeo",
    };
  }

  if (lesson.videoUrl) {
    const premiumConfigured =
      isCloudflareStreamConfigured() || isVimeoConfigured();

    // Block raw MP4 in production only when signed providers are configured.
    // Otherwise allow direct URLs so courses work before Cloudflare/Vimeo setup.
    if (
      process.env.NODE_ENV === "production" &&
      premiumConfigured &&
      !process.env.ALLOW_DIRECT_VIDEO_URLS
    ) {
      return { type: "none" };
    }

    return { type: "native", src: lesson.videoUrl, provider: "direct" };
  }

  return { type: "none" };
}

export function parseVideoProviderFromInput(
  videoUrl: string,
  explicitProvider?: VideoProvider
): Pick<LessonVideoInput, "videoProvider" | "videoId" | "videoPrivacyHash"> {
  if (explicitProvider && explicitProvider !== "DIRECT") {
    return {
      videoProvider: explicitProvider,
      videoId: videoUrl,
      videoPrivacyHash: null,
    };
  }

  if (videoUrl.startsWith("cfstream:")) {
    return {
      videoProvider: "CLOUDFLARE_STREAM",
      videoId: videoUrl.replace("cfstream:", ""),
      videoPrivacyHash: null,
    };
  }

  const vimeoId = extractVimeoIdFromUrl(videoUrl);
  if (vimeoId) {
    const hashMatch = videoUrl.match(/[?&]h=([a-zA-Z0-9]+)/);
    return {
      videoProvider: "VIMEO",
      videoId: vimeoId,
      videoPrivacyHash: hashMatch?.[1] ?? null,
    };
  }

  return {
    videoProvider: "DIRECT",
    videoId: null,
    videoPrivacyHash: null,
  };
}
