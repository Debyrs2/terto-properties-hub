import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";

import { ContactDialog } from "@/components/ContactDialog";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { propertiesQuery, settingsQuery } from "@/lib/queries";
import { displayNumber, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(propertiesQuery()),
      context.queryClient.ensureQueryData(settingsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Contato | Fernando Terto Imóveis" },
      {
        name: "description",
        content:
          "Fale com o corretor Fernando Terto (CRECI 23228) pelo WhatsApp ou Instagram e tire suas dúvidas sobre os imóveis.",
      },
      { property: "og:title", content: "Contato | Fernando Terto Imóveis" },
      {
        property: "og:description",
        content: "Atendimento direto pelo WhatsApp com o corretor Fernando Terto.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, lang } = useI18n();
  const { data: properties } = useSuspenseQuery(propertiesQuery());
  const { data: settings } = useSuspenseQuery(settingsQuery());

  return (
    <SiteLayout>
      <section className="container-page max-w-3xl py-20">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold">
          {t("contact.title")}
        </h1>
        <p className="text-muted-foreground mt-3">{t("contact.subtitle")}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ContactDialog properties={properties} whatsapp={settings?.whatsapp_primary}>
            <Button size="lg">{t("nav.talk")}</Button>
          </ContactDialog>
          <Button asChild size="lg" variant="outline">
            <a
              href={whatsappLink(settings?.whatsapp_primary, [], lang)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> {t("contact.doubts")}
            </a>
          </Button>
        </div>

        <dl className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="bg-card rounded-lg border p-6">
            <dt className="text-xs tracking-[0.3em] uppercase">{t("contact.whatsapp")}</dt>
            <dd className="mt-3 space-y-1">
              {[settings?.whatsapp_primary, settings?.whatsapp_secondary]
                .filter((n): n is string => Boolean(n))
                .map((n) => (
                  <a
                    key={n}
                    href={whatsappLink(n, [], lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent block transition-colors"
                  >
                    {displayNumber(n)}
                  </a>
                ))}
            </dd>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <dt className="text-xs tracking-[0.3em] uppercase">{t("contact.instagram")}</dt>
            <dd className="mt-3">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent inline-flex items-center gap-2 transition-colors"
                >
                  <Instagram className="h-4 w-4" /> {settings.instagram_handle}
                </a>
              )}
            </dd>
          </div>
        </dl>

        <p className="text-muted-foreground mt-10 text-sm">
          {settings?.broker_name ?? "Fernando Terto"} — CRECI {settings?.creci ?? "23228"}
        </p>
      </section>
    </SiteLayout>
  );
}
