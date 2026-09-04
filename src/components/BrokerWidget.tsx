import { X } from "lucide-react";
import { useEffect, useState } from "react";

import brokerPhoto from "@/assets/fernando-terto.png";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/lib/whatsapp";

const FIRST_DELAY_MS = 2000;
const CYCLE_MS = 20000;

const labels = {
  pt: { cta: "Fale comigo!", close: "Fechar", alt: "Foto do corretor Fernando Terto" },
  en: { cta: "Talk to me!", close: "Close", alt: "Photo of broker Fernando Terto" },
  es: { cta: "¡Habla conmigo!", close: "Cerrar", alt: "Foto del corredor Fernando Terto" },
} as const;

export function BrokerWidget({ whatsapp }: { whatsapp: string | null | undefined }) {
  const { lang } = useI18n();
  const [visible, setVisible] = useState(false);
  const l = labels[lang] ?? labels.pt;

  useEffect(() => {
    const first = window.setTimeout(() => setVisible(true), FIRST_DELAY_MS);
    const cycle = window.setInterval(() => setVisible(true), CYCLE_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(cycle);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fixed right-4 bottom-4 z-40 flex items-end gap-2 duration-500">
      <a
        href={whatsappLink(whatsapp, [], lang)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent text-accent-foreground relative rounded-2xl px-3.5 py-2 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5"
      >
        {l.cta}
        <span
          aria-hidden
          className="bg-accent absolute top-1/2 -right-1 h-3 w-3 -translate-y-1/2 rotate-45 rounded-[2px]"
        />
      </a>

      <div className="relative">
        <a
          href={whatsappLink(whatsapp, [], lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="border-accent/40 bg-card block h-16 w-16 overflow-hidden rounded-full border-2 shadow-lg sm:h-20 sm:w-20"
        >
          <img
            src={brokerPhoto.url}
            alt={l.alt}
            loading="lazy"
            className="h-full w-full scale-110 object-cover object-top"
          />
        </a>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label={l.close}
          className="bg-background text-muted-foreground hover:text-foreground absolute -top-1 -right-1 rounded-full border p-1 shadow-sm transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
