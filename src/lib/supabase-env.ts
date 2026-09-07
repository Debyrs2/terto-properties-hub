// Centralized Supabase public config resolution.
// Works in both environments: Lovable Cloud (VITE_* injected at build time)
// and external hosting such as Vercel (non-prefixed vars in process.env).
// The values below are publishable (client-safe) and act as a last-resort fallback.

const FALLBACK_URL = "https://jrhljwtqaqunbwvvjpfd.supabase.co";
const FALLBACK_KEY = "sb_publishable_7kzru5iV5PkzWRsLRZOKfw_PQgZb8Rk";

function fromImportMeta(name: string): string | undefined {
  try {
    return (import.meta.env as Record<string, string | undefined>)[name] || undefined;
  } catch {
    return undefined;
  }
}

function fromProcess(name: string): string | undefined {
  try {
    return typeof process !== "undefined" ? process.env?.[name] || undefined : undefined;
  } catch {
    return undefined;
  }
}

export function getSupabaseUrl(): string {
  return (
    fromImportMeta("VITE_SUPABASE_URL") ??
    fromProcess("SUPABASE_URL") ??
    fromProcess("VITE_SUPABASE_URL") ??
    FALLBACK_URL
  );
}

export function getSupabasePublishableKey(): string {
  return (
    fromImportMeta("VITE_SUPABASE_PUBLISHABLE_KEY") ??
    fromProcess("SUPABASE_PUBLISHABLE_KEY") ??
    fromProcess("VITE_SUPABASE_PUBLISHABLE_KEY") ??
    FALLBACK_KEY
  );
}
