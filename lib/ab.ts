// Podešavanja A/B testa. Deli se između middleware-a (edge), API ruta i klijenta.

export type Variant = "a" | "b";

export const VARIANTS: Variant[] = ["a", "b"];

/** Opis varijanti, ide i u bazu (lp_events.variant / lp_leads.variant). */
export const VARIANT_LABELS: Record<Variant, string> = {
  a: "A: forma dole, pored cene",
  b: "B: forma u hero delu",
};

/** Udeo saobraćaja koji ide na varijantu B (0.5 = 50/50). */
export const SPLIT_B = 0.5;

/** Promeni ovo kad pokrećeš novi test, da stari posetioci dobiju novu, nezavisnu podelu. */
export const EXPERIMENT_ID = "lp-forma-2026-10";

export const COOKIE_VARIANT = "lp_ab";
export const COOKIE_VISITOR = "lp_vid";
export const COOKIE_QA = "lp_qa";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 dana

export function isVariant(v: unknown): v is Variant {
  return v === "a" || v === "b";
}

export const EVENT_NAMES = ["view", "cta_click", "form_start", "form_step", "lead"] as const;
export type EventName = (typeof EVENT_NAMES)[number];
