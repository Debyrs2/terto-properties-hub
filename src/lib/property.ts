export type PropertyStatus = "available" | "sold";
export type DealType = "sale" | "rent" | null;

export type Media = {
  id: string;
  property_id: string;
  kind: string;
  url: string;
  storage_path: string | null;
  position: number;
};

export type Property = {
  id: string;
  title: string | null;
  status: string;
  deal_type: string | null;
  area: string | null;
  address: string | null;
  maps_url: string | null;
  nearby: string | null;
  description: string | null;
  price: number | null;
  created_at: string;
};

export type PropertyWithMedia = Property & { media: Media[] };

export type SiteSettings = {
  whatsapp_primary: string | null;
  whatsapp_secondary: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  creci: string | null;
  broker_name: string | null;
};

export const formatPrice = (price: number | null, lang: string) => {
  if (price === null || price === undefined) return null;
  const locale = lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
};

export const photosOf = (media: Media[]) =>
  media.filter((m) => m.kind === "photo").sort((a, b) => a.position - b.position);

export const videosOf = (media: Media[]) =>
  media.filter((m) => m.kind === "video").sort((a, b) => a.position - b.position);

export const MAX_PHOTOS = 50;
export const MAX_VIDEOS = 2;
