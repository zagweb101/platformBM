export function isVimeoConfigured() {
  return Boolean(process.env.VIMEO_ACCESS_TOKEN);
}

interface VimeoPlayResponse {
  play?: {
    hls?: { link?: string };
    progressive?: Array<{ link?: string; quality?: string }>;
  };
}

export async function getVimeoSignedPlayUrl(
  videoId: string,
  privacyHash?: string | null
) {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  if (!token) return null;

  const response = await fetch(
    `https://api.vimeo.com/videos/${videoId}?fields=play`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Vimeo API error:", await response.text());
    return null;
  }

  const data = (await response.json()) as VimeoPlayResponse;
  const progressive = data.play?.progressive?.find((item) => item.link)?.link;
  const hls = data.play?.hls?.link;

  if (progressive) return progressive;
  if (hls) return hls;

  if (privacyHash) {
    return `https://player.vimeo.com/progressive_redirect/playback/${videoId}/rendition/720p/file.mp4?h=${privacyHash}`;
  }

  return null;
}

export function getVimeoEmbedUrl(videoId: string, privacyHash?: string | null) {
  const params = new URLSearchParams({
    badge: "0",
    autopause: "0",
    player_id: "0",
    app_id: "58479",
    dnt: "1",
  });

  if (privacyHash) {
    params.set("h", privacyHash);
  }

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

export function extractVimeoIdFromUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}
