"use client";

import type { EventName, Variant } from "@/lib/ab";

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
    __lpVariant?: Variant;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
const UTM_STORE = "lp_utm";

/** Pamti UTM parametre sa prvog ulaska, da bi išli uz prijavu i kad korisnik skroluje/klikće. */
export function captureUtm(): Record<string, string> {
  let saved: Record<string, string> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(UTM_STORE) || "{}");
  } catch {
    saved = {};
  }
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) {
      saved[k] = v.slice(0, 200);
      changed = true;
    }
  }
  if (!saved.landing_referrer && document.referrer) {
    saved.landing_referrer = document.referrer.slice(0, 300);
    changed = true;
  }
  if (changed) {
    try {
      sessionStorage.setItem(UTM_STORE, JSON.stringify(saved));
    } catch {
      /* private mode */
    }
  }
  return saved;
}

export function getUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORE) || "{}");
  } catch {
    return {};
  }
}

/** Šalje događaj u našu bazu (i Meta Pixel / GA4 ako su podešeni). Nikad ne baca grešku. */
export function track(event: EventName, props: Record<string, string | number | boolean> = {}) {
  const variant = window.__lpVariant;
  // "lead" u bazu upisuje server posle uspešne prijave; ovde ide samo u Pixel/GA4.
  if (event !== "lead") try {
    const body = JSON.stringify({ event, props, path: window.location.pathname });
    const ok = navigator.sendBeacon?.("/api/event", new Blob([body], { type: "application/json" }));
    if (!ok) {
      void fetch("/api/event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* ignore */
  }

  try {
    if (window.fbq) {
      if (event === "lead") window.fbq("track", "Lead", { ab_variant: variant, content_name: "Protokol ishrane" });
      else if (event === "form_start") window.fbq("trackCustom", "FormStart", { ab_variant: variant });
    }
    if (window.gtag) {
      const name = event === "lead" ? "generate_lead" : event === "view" ? "lp_view" : event;
      window.gtag("event", name, { ab_variant: variant, ...props });
    }
  } catch {
    /* ignore */
  }
}
