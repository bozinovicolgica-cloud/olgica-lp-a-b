import type { NextRequest } from "next/server";
import { COOKIE_QA, COOKIE_VARIANT, COOKIE_VISITOR, EXPERIMENT_ID, isVariant, type Variant } from "@/lib/ab";

/** Varijantu čitamo iz cookie-ja koji je postavio middleware, ne iz tela zahteva. */
export function abContext(req: NextRequest): {
  variant: Variant | null;
  visitorId: string | null;
  isQa: boolean;
  experiment: string;
} {
  const raw = req.cookies.get(COOKIE_VARIANT)?.value ?? "";
  const [exp, v] = raw.split(":");
  const vid = req.cookies.get(COOKIE_VISITOR)?.value ?? null;
  return {
    variant: exp === EXPERIMENT_ID && isVariant(v) ? v : null,
    visitorId: vid && /^[0-9a-f-]{36}$/i.test(vid) ? vid : null,
    isQa: req.cookies.get(COOKIE_QA)?.value === "1",
    experiment: EXPERIMENT_ID,
  };
}

export function clip(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}
