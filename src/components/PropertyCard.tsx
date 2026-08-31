import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageIcon, Ruler } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { formatPrice, photosOf, type PropertyWithMedia } from "@/lib/property";

function CardCarousel({ photos, alt }: { photos: { id: string; url: string }[]; alt: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const go = useCallback(
    (event: React.MouseEvent, dir: -1 | 1) => {
      event.preventDefault();
      event.stopPropagation();
      if (!embla) return;
      if (dir === -1) embla.scrollPrev();
      else embla.scrollNext();
    },
    [embla],
  );

  return (
    <>
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {photos.map((photo) => (
            <div key={photo.id} className="h-full min-w-0 flex-[0_0_100%]">
              <img
                src={photo.url}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => go(e, -1)}
            className="absolute top-1/2 left-2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            onClick={(e) => go(e, 1)}
            className="absolute top-1/2 right-2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur">
            {photos.slice(0, 8).map((photo, index) => (
              <span
                key={photo.id}
                className={`block h-1.5 rounded-full transition-all ${
                  index === selected % 8 && index === selected
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
            {photos.length > 8 && (
              <span className="ml-1 text-[10px] leading-none text-white/90">
                {selected + 1}/{photos.length}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}

export function PropertyCard({ property }: { property: PropertyWithMedia }) {
  const { t, lang } = useI18n();
  const photos = photosOf(property.media);
  const price = formatPrice(property.price, lang);
  const sold = property.status === "sold";
  const title = property.title?.trim() || t("prop.untitled");

  return (
    <div className="group bg-card focus-within:ring-ring relative flex flex-col overflow-hidden rounded-lg border transition-all hover:-translate-y-1 hover:shadow-lg focus-within:ring-2">
      <Link
        to="/imovel/$id"
        params={{ id: property.id }}
        aria-label={title}
        className="absolute inset-0 z-10 focus:outline-none"
      />

      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        {photos.length > 0 ? (
          <CardCarousel photos={photos} alt={title} />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <div className="pointer-events-none absolute top-3 left-3 z-20 flex gap-2">
          <Badge variant={sold ? "secondary" : "default"}>
            {sold ? t("status.sold") : t("status.available")}
          </Badge>
          {property.deal_type && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              {property.deal_type === "rent" ? t("deal.rent") : t("deal.sale")}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl leading-snug font-semibold">{title}</h3>
        {property.address && (
          <p className="text-muted-foreground line-clamp-2 text-sm">{property.address}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          {property.area && (
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
              <Ruler className="h-3.5 w-3.5" />
              {property.area}
            </span>
          )}
          <span className="text-accent ml-auto font-medium">{price ?? t("price.ask")}</span>
        </div>
      </div>
    </div>
  );
}
