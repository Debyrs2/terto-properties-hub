import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Media } from "@/lib/property";

export function PropertyGallery({ photos, title }: { photos: Media[]; title: string }) {
  const [zoom, setZoom] = useState<string | null>(null);

  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <>
        <button
          type="button"
          onClick={() => setZoom(photos[0]!.url)}
          className="bg-muted block w-full overflow-hidden rounded-lg"
        >
          <img
            src={photos[0]!.url}
            alt={title}
            loading="lazy"
            className="max-h-[70vh] w-full object-cover"
          />
        </button>
        <Lightbox url={zoom} title={title} onClose={() => setZoom(null)} />
      </>
    );
  }

  return (
    <>
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.id} className="basis-full sm:basis-4/5 lg:basis-2/3">
              <button
                type="button"
                onClick={() => setZoom(photo.url)}
                className="bg-muted block aspect-[4/3] w-full overflow-hidden rounded-lg"
              >
                <img
                  src={photo.url}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <Lightbox url={zoom} title={title} onClose={() => setZoom(null)} />
    </>
  );
}

function Lightbox({
  url,
  title,
  onClose,
}: {
  url: string | null;
  title: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(url)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {url && <img src={url} alt={title} className="max-h-[85vh] w-full rounded-lg object-contain" />}
      </DialogContent>
    </Dialog>
  );
}
