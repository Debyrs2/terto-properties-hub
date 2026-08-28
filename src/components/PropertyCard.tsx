import { Link } from "@tanstack/react-router";
import { ImageIcon, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { formatPrice, photosOf, type PropertyWithMedia } from "@/lib/property";

export function PropertyCard({ property }: { property: PropertyWithMedia }) {
  const { t, lang } = useI18n();
  const cover = photosOf(property.media)[0];
  const price = formatPrice(property.price, lang);
  const sold = property.status === "sold";

  return (
    <Link
      to="/imovel/$id"
      params={{ id: property.id }}
      className="group bg-card focus-visible:ring-ring flex flex-col overflow-hidden rounded-lg border transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        {cover ? (
          <img
            src={cover.url}
            alt={property.title ?? t("prop.untitled")}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
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
        <h3 className="font-display text-xl leading-snug font-semibold">
          {property.title?.trim() || t("prop.untitled")}
        </h3>
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
    </Link>
  );
}
