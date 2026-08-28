import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Media, Property, PropertyWithMedia, SiteSettings } from "./property";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const PROPERTY_COLUMNS =
  "id, title, status, deal_type, area, address, maps_url, nearby, description, price, created_at";

export const listPropertiesFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [{ data: properties }, { data: media }] = await Promise.all([
    supabase.from("properties").select(PROPERTY_COLUMNS).order("created_at", { ascending: false }),
    supabase.from("property_media").select("*").order("position", { ascending: true }),
  ]);
  const rows = (properties ?? []) as unknown as Property[];
  const allMedia = (media ?? []) as unknown as Media[];
  return rows.map<PropertyWithMedia>((p) => ({
    ...p,
    media: allMedia.filter((m) => m.property_id === p.id),
  }));
});

export const getPropertyFn = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: property } = await supabase
      .from("properties")
      .select(PROPERTY_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (!property) return null;
    const { data: media } = await supabase
      .from("property_media")
      .select("*")
      .eq("property_id", data.id)
      .order("position", { ascending: true });
    return {
      ...(property as unknown as Property),
      media: (media ?? []) as unknown as Media[],
    } satisfies PropertyWithMedia;
  });

export const getSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("site_settings")
    .select(
      "whatsapp_primary, whatsapp_secondary, instagram_url, instagram_handle, creci, broker_name",
    )
    .maybeSingle();
  return (data ?? null) as SiteSettings | null;
});
