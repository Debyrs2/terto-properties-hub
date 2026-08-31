import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";

import { PropertyGallery } from "@/components/PropertyGallery";
import { PropertyVideo } from "@/components/PropertyVideo";
import { SiteLayout } from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { formatPrice, photosOf, videosOf } from "@/lib/property";
import { propertyQuery, settingsQuery } from "@/lib/queries";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/imovel/$id")({
  loader: async ({ context, params }) => {
    const property = await context.queryClient.ensureQueryData(propertyQuery(params.id));
    await context.queryClient.ensureQueryData(settingsQuery());
    return { title: property?.title ?? null, description: property?.description ?? null };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title?.trim() || "Imóvel";
    const description =
      loaderData?.description?.trim() ||
      "Detalhes do imóvel divulgado por Fernando Terto Imóveis (CRECI 23228).";
    return {
      meta: [
        { title: `${title} | Fernando Terto Imóveis` },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: `${title} | Fernando Terto Imóveis` },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">Não foi possível carregar o imóvel.</div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">Imóvel não encontrado.</div>
    </SiteLayout>
  ),
  component: PropertyPage,
});

function PropertyPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { data: property } = useSuspenseQuery(propertyQuery(id));
  const { data: settings } = useSuspenseQuery(settingsQuery());

  if (!property) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">{t("prop.notfound")}</div>
      </SiteLayout>
    );
  }

  const title = property.title?.trim() || t("prop.untitled");
  const photos = photosOf(property.media);
  const videos = videosOf(property.media);
  const price = formatPrice(property.price, lang);
  const sold = property.status === "sold";

  return (
    <SiteLayout>
      <article className="container-page py-10 lg:py-14">
        <Link
          to="/imoveis"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("prop.back")}
        </Link>

        <header className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={sold ? "secondary" : "default"}>
                {sold ? t("status.sold") : t("status.available")}
              </Badge>
              {property.deal_type && (
                <Badge variant="outline">
                  {property.deal_type === "rent" ? t("deal.rent") : t("deal.sale")}
                </Badge>
              )}
              {property.area && <Badge variant="outline">{property.area}</Badge>}
            </div>
            <h1 className="font-display text-[clamp(1.9rem,5vw,3.25rem)] leading-tight font-semibold">
              {title}
            </h1>
            {property.address && (
              <p className="text-muted-foreground max-w-3xl text-base">{property.address}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <span className="text-accent font-display text-3xl font-semibold">
              {price ?? t("price.ask")}
            </span>
            <Button asChild size="lg">
              <a
                href={whatsappLink(settings?.whatsapp_primary, [title], lang)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> {t("nav.talk")}
              </a>
            </Button>
          </div>
        </header>

        {photos.length > 0 && (
          <section className="mx-auto mt-10 w-full md:max-w-[88%] lg:max-w-[80%]">
            <PropertyGallery photos={photos} title={title} />
          </section>
        )}

        {videos.length > 0 && (
          <section className="mx-auto mt-12 w-full space-y-4 md:max-w-[88%] lg:max-w-[80%]">
            <h2 className="text-xs tracking-[0.3em] uppercase">{t("prop.videos")}</h2>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))]">

              {videos.map((video) => (
                <PropertyVideo key={video.id} video={video} title={title} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
          {property.description && (
            <section className="bg-card space-y-3 rounded-lg border p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">{t("prop.about")}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </section>
          )}

          {property.nearby && (
            <section className="bg-card space-y-3 rounded-lg border p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">{t("prop.nearby")}</h2>
              <ul className="flex flex-wrap gap-2">
                {property.nearby
                  .split(/[,;\n]/)
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item) => (
                    <li key={item}>
                      <Badge variant="secondary" className="font-normal">
                        {item}
                      </Badge>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {(property.address || property.maps_url) && (
            <section className="bg-card space-y-3 rounded-lg border p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">{t("prop.address")}</h2>
              {property.address && (
                <p className="text-muted-foreground leading-relaxed">{property.address}</p>
              )}
              {property.maps_url && (
                <Button asChild variant="outline" size="sm">
                  <a href={property.maps_url} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-4 w-4" /> {t("prop.map")}
                  </a>
                </Button>
              )}
            </section>
          )}
        </div>
      </article>
    </SiteLayout>
  );
}
