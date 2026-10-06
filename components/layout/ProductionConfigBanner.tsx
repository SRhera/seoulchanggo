import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * STEP 14 production hardening: every repository in this app quietly falls
 * back to static/mock data when Supabase isn't configured (the dual-mode
 * pattern that made development possible without a live backend since
 * STEP 08). That silence is fine in development, but a production
 * deployment showing a fully-functional-looking storefront backed entirely
 * by fake data — with no way for anyone to tell — is the "조용히 mock
 * 데이터로 돌아가는 구조 금지" failure mode explicitly called out in the
 * STEP 14 spec. This renders one unmissable banner instead of touching the
 * ~15 repository modules that branch on isSupabaseConfigured().
 */
export function ProductionConfigBanner() {
  if (process.env.NODE_ENV !== "production" || isSupabaseConfigured()) return null;

  // TEMP DEBUG — remove once the Vercel env var issue is confirmed fixed.
  // Reports presence/length only, never the actual secret values.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const matchingKeys = Object.keys(process.env)
    .filter((k) => k.includes("SUPABASE"))
    .sort()
    .join(",");
  const debug = [
    `URL:${url ? `set(len ${url.length})` : "MISSING"}`,
    `ANON:${anon ? `set(len ${anon.length})` : "MISSING"}`,
    `SERVICE_ROLE:${serviceRole ? "set" : "MISSING"}`,
    `VERCEL_ENV:${process.env.VERCEL_ENV ?? "n/a"}`,
    `VERCEL_TARGET_ENV:${process.env.VERCEL_TARGET_ENV ?? "n/a"}`,
    `keysSeen:[${matchingKeys || "none"}]`,
  ].join(" ");

  return (
    <div className="w-full bg-red-600 px-4 py-2 text-center text-xs font-bold text-white">
      프로덕션 환경에 Supabase가 연결되지 않았습니다 — 지금 보이는 데이터는 실제 데이터가 아닙니다.
      <br />
      [DEBUG] {debug}
    </div>
  );
}
