import { Link } from "@tanstack/react-router";
import { Moon, Sun, Languages } from "lucide-react";

import { ContactDialog } from "@/components/ContactDialog";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type Lang } from "@/lib/i18n";
import type { PropertyWithMedia, SiteSettings } from "@/lib/property";
import { useTheme } from "@/lib/theme";

const langs: { code: Lang; label: string }[] = [
  { code: "pt", label: "Português (BR)" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export function SiteHeader({
  properties,
  settings,
}: {
  properties: PropertyWithMedia[];
  settings: SiteSettings | null;
}) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
        <Link to="/" className="min-w-0">
          <Logo />
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/imoveis"
            className="text-muted-foreground hover:text-foreground hidden px-2 text-sm tracking-wide transition-colors md:inline"
          >
            {t("nav.properties")}
          </Link>
          <Link
            to="/contato"
            className="text-muted-foreground hover:text-foreground hidden px-2 text-sm tracking-wide transition-colors md:inline"
          >
            {t("nav.contact")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("lang.label")}>
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {langs.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={l.code === lang ? "text-accent" : ""}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("theme.toggle")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <ContactDialog properties={properties} whatsapp={settings?.whatsapp_primary}>
            <Button size="sm" className="ml-1 hidden sm:inline-flex">
              {t("nav.talk")}
            </Button>
          </ContactDialog>
        </div>
      </div>
    </header>
  );
}
