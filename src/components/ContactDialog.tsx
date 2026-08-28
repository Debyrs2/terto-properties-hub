import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/lib/i18n";
import type { PropertyWithMedia } from "@/lib/property";
import { whatsappLink } from "@/lib/whatsapp";

export function ContactDialog({
  properties,
  whatsapp,
  children,
}: {
  properties: PropertyWithMedia[];
  whatsapp: string | null | undefined;
  children: ReactNode;
}) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const titles = properties
    .filter((p) => selected.includes(p.id))
    .map((p) => p.title?.trim() || t("prop.untitled"));

  const openWhats = () => {
    window.open(whatsappLink(whatsapp, titles, lang), "_blank", "noopener,noreferrer");
    setOpen(false);
    setSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("contact.choose")}</DialogTitle>
          <DialogDescription>{t("contact.chooseHint")}</DialogDescription>
        </DialogHeader>

        {properties.length > 0 && (
          <ScrollArea className="max-h-64 pr-3">
            <ul className="space-y-1">
              {properties.map((p) => {
                const label = p.title?.trim() || t("prop.untitled");
                return (
                  <li key={p.id}>
                    <label className="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm transition-colors">
                      <Checkbox
                        checked={selected.includes(p.id)}
                        onCheckedChange={(checked) =>
                          setSelected((prev) =>
                            checked ? [...prev, p.id] : prev.filter((id) => id !== p.id),
                          )
                        }
                      />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={openWhats} className="flex-1" disabled={selected.length === 0}>
            {t("contact.send")}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSelected([]);
              window.open(whatsappLink(whatsapp, [], lang), "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
          >
            {t("contact.doubts")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
