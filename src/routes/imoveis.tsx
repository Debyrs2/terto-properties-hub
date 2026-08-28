import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PropertyCard } from "@/components/PropertyCard";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { propertiesQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/imoveis")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(propertiesQuery()),
      context.queryClient.ensureQueryData(settingsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Imóveis disponíveis | Fernando Terto Imóveis" },
      {
        name: "description",
        content:
          "Veja todos os imóveis à venda e para locação divulgados pelo corretor Fernando Terto em Pernambuco.",
      },
      { property: "og:title", content: "Imóveis disponíveis | Fernando Terto Imóveis" },
      {
        property: "og:description",
        content: "Lista completa de imóveis com fotos, vídeos e detalhes.",
      },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { t } = useI18n();
  const { data: properties } = useSuspenseQuery(propertiesQuery());
  const [status, setStatus] = useState<string>("all");
  const [deal, setDeal] = useState<string>("all");

  const filtered = properties.filter(
    (p) =>
      (status === "all" || p.status === status) && (deal === "all" || p.deal_type === deal),
  );

  const chip = (active: boolean) => (active ? "default" : "outline");

  return (
    <SiteLayout>
      <section className="container-page py-14">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold">
          {t("list.title")}
        </h1>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {t("filter.status")}
            </span>
            <Button size="sm" variant={chip(status === "all")} onClick={() => setStatus("all")}>
              {t("filter.all")}
            </Button>
            <Button
              size="sm"
              variant={chip(status === "available")}
              onClick={() => setStatus("available")}
            >
              {t("status.available")}
            </Button>
            <Button size="sm" variant={chip(status === "sold")} onClick={() => setStatus("sold")}>
              {t("status.sold")}
            </Button>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {t("filter.deal")}
            </span>
            <Button size="sm" variant={chip(deal === "all")} onClick={() => setDeal("all")}>
              {t("filter.all")}
            </Button>
            <Button size="sm" variant={chip(deal === "sale")} onClick={() => setDeal("sale")}>
              {t("deal.sale")}
            </Button>
            <Button size="sm" variant={chip(deal === "rent")} onClick={() => setDeal("rent")}>
              {t("deal.rent")}
            </Button>
          </div>
        </div>

        <div className="mt-10">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">{t("list.empty")}</p>
          ) : (
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr))]">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
