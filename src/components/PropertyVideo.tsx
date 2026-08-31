import { Play } from "lucide-react";
import { useState } from "react";

import type { Media } from "@/lib/property";

export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return match?.[1] ?? null;
}

export function PropertyVideo({ video, title }: { video: Media; title: string }) {
  const [playing, setPlaying] = useState(false);
  const ytId = youtubeId(video.url);

  if (ytId) {
    if (!playing) {
      return (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={title}
          className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg"
        >
          <img
            src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="bg-background/70 absolute inset-0 grid place-items-center transition-colors group-hover:bg-transparent">
            <span className="bg-accent text-accent-foreground grid h-14 w-14 place-items-center rounded-full">
              <Play className="h-6 w-6" />
            </span>
          </span>
        </button>
      );
    }
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-lg border-0"
      />
    );
  }

  return (
    <video
      key={video.url}
      ref={(el) => {
        if (el) el.muted = true;
      }}
      src={video.url}
      controls
      muted
      preload="none"
      playsInline
      className="bg-muted aspect-video w-full rounded-lg object-cover"
    />
  );
}
