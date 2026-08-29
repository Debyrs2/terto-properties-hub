import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { LeadCapture } from "@/components/LeadCapture";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { propertiesQuery, settingsQuery } from "@/lib/queries";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { data: properties } = useSuspenseQuery(propertiesQuery());
  const { data: settings } = useSuspenseQuery(settingsQuery());

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader properties={properties} settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <LeadCapture />
    </div>
  );
}
