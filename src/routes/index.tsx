import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ContactDialog } from "@/components/ContactDialog";
import { PropertyCard } from "@/components/PropertyCard";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { propertiesQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(propertiesQuery()),
      context.queryClient.ensureQueryData(settingsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Fernando Terto Imóveis | Imóveis em Pernambuco" },
      {
        name: "description",
        content:
          "Imóveis à venda e para locação em Jaboatão dos Guararapes e região, com atendimento direto do corretor Fernando Terto (CRECI 23228).",
      },
      { property: "og:title", content: "Fernando Terto Imóveis" },
      {
        property: "og:description",
        content: "Conectando pessoas aos melhores imóveis em Pernambuco.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { data: properties } = useSuspenseQuery(propertiesQuery());
  const { data: settings } = useSuspenseQuery(settingsQuery());
  const highlights = properties.slice(0, 6);

  return (
    <SiteLayout>
      <section className="border-b">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div className="min-w-0 space-y-6">
            <p className="text-accent text-xs tracking-[0.32em] uppercase">{t("hero.eyebrow")}</p>
            <h1 className="font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] font-semibold">
              {t("hero.title")}
            </h1>
            <p className="text-muted-foreground max-w-xl text-[clamp(1rem,1.6vw,1.125rem)]">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/imoveis">
                  {t("hero.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <ContactDialog properties={properties} whatsapp={settings?.whatsapp_primary}>
                <Button size="lg" variant="outline">
                  {t("nav.talk")}
                </Button>
              </ContactDialog>
            </div>
          </div>
          <div className="from-accent/25 via-accent/5 relative hidden aspect-[4/3] rounded-lg bg-gradient-to-br to-transparent lg:block">
            <div className="border-accent/30 absolute inset-6 rounded-lg border" />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t("list.title")}</h2>
          <Link to="/imoveis" className="text-accent text-sm hover:underline">
            {t("hero.cta")}
          </Link>
        </div>
        {highlights.length === 0 ? (
          <p className="text-muted-foreground">{t("list.empty")}</p>
        ) : (
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr))]">
            {highlights.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
