// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: inside a Lovable build the preset is pinned by LOVABLE_NITRO_PRESET.
// Outside it (e.g. building on Vercel), pin the "vercel" Nitro preset explicitly so the
// output is Vercel Serverless/SSR instead of the implicit cloudflare-module default.
const isVercel = Boolean(process.env['VERCEL'] || process.env['VERCEL_ENV']);

// Publishable (client-safe) Supabase config. Guarantees the browser bundle always
// has a value even if VITE_* vars are not present in a given build environment.
const supabaseUrl =
  process.env["VITE_SUPABASE_URL"] ||
  process.env["SUPABASE_URL"] ||
  "https://jrhljwtqaqunbwvvjpfd.supabase.co";
const supabaseKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["SUPABASE_PUBLISHABLE_KEY"] ||
  "sb_publishable_7kzru5iV5PkzWRsLRZOKfw_PQgZb8Rk";

export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseKey),
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
