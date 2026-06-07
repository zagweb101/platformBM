"use client";

interface SecureVideoPlayerProps {
  embed:
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
  title: string;
  poster?: string;
}

export default function SecureVideoPlayer({
  embed,
  title,
  poster,
}: SecureVideoPlayerProps) {
  if (embed.type === "none") {
    return (
      <div className="text-center text-text-muted space-y-2 p-8">
        <p className="text-sm font-semibold">الفيديو غير متاح أو محمي.</p>
        <p className="text-xs text-text-muted">
          تواصل مع الدعم إذا استمرت المشكلة.
        </p>
      </div>
    );
  }

  if (embed.type === "iframe") {
    return (
      <iframe
        src={embed.src}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      key={embed.src}
      src={embed.src}
      controls
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full object-contain"
      poster={poster}
      playsInline
    />
  );
}
