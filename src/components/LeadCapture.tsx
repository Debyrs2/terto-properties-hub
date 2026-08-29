import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { submitLeadFn } from "@/lib/leads.functions";

const DONE_KEY = "terto-lead-done";
const SESSION_KEY = "terto-lead-seen";
const DELAY_MS = 10000;

export function LeadCapture() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const submitLead = useServerFn(submitLeadFn);

  useEffect(() => {
    if (window.localStorage.getItem(DONE_KEY)) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(t("lead.invalid"));
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      await submitLead({ data: { email: value } });
      window.localStorage.setItem(DONE_KEY, "1");
      setStatus("done");
      window.setTimeout(() => setOpen(false), 2200);
    } catch {
      setStatus("idle");
      setError(t("lead.error"));
    }
  };

  return (
    <div
      role="dialog"
      aria-label={t("lead.title")}
      className="animate-in fade-in slide-in-from-bottom-4 bg-card fixed right-4 bottom-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg border p-5 shadow-lg duration-500"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label={t("lead.close")}
        className="text-muted-foreground hover:text-foreground absolute top-3 right-3 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {status === "done" ? (
        <p className="pr-6 text-sm">{t("lead.success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <h2 className="font-display pr-6 text-lg leading-snug font-semibold">
            {t("lead.title")}
          </h2>
          <p className="text-muted-foreground text-sm">{t("lead.subtitle")}</p>
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={255}
            placeholder={t("lead.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label={t("lead.placeholder")}
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <Button type="submit" className="w-full" disabled={status === "sending"}>
            {t("lead.submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
