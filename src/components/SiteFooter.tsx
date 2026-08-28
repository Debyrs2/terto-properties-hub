import { Instagram, MessageCircle } from "lucide-react";

import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/property";
import { displayNumber, whatsappLink } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const { t, lang } = useI18n();
  const numbers = [settings?.whatsapp_primary, settings?.whatsapp_secondary].filter(
    (n): n is string => Boolean(n),
  );

  return (
    <footer className="bg-secondary/40 mt-24 border-t">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm">
            {settings?.broker_name ?? "Fernando Terto"} — {t("hero.eyebrow")}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs tracking-[0.3em] uppercase">{t("contact.whatsapp")}</h3>
          <ul className="space-y-2">
            {numbers.map((n) => (
              <li key={n}>
                <a
                  href={whatsappLink(n, [], lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {displayNumber(n)}
                </a>
              </li>
            ))}
          </ul>
          {settings?.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Instagram className="h-4 w-4 shrink-0" />
              {settings.instagram_handle ?? t("contact.instagram")}
            </a>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="text-xs tracking-[0.3em] uppercase">
            {settings?.broker_name ?? "Fernando Terto"}
          </h3>
          <p className="text-muted-foreground">CRECI {settings?.creci ?? "23228"}</p>
          <p className="text-muted-foreground pt-4 text-xs">
            © {new Date().getFullYear()} {settings?.broker_name ?? "Fernando Terto"}.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
