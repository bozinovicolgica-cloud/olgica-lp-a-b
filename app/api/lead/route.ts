import { NextResponse, after, type NextRequest } from "next/server";
import { VARIANT_LABELS } from "@/lib/ab";
import { form } from "@/lib/content";
import { abContext, clip } from "@/lib/server-context";
import { insertRow, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const HAS_LABELS = ["Poslednje analize krvi", "Izveštaj lekara specijaliste", "Spisak terapije", "Nemam ništa od ovoga"];

export async function POST(req: NextRequest) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Neispravan zahtev." }, { status: 400 });
  }

  // Honeypot: pravi korisnici ne vide ovo polje.
  if (typeof b.website === "string" && b.website.trim()) return NextResponse.json({ ok: true });

  const who = b.who === "kid" ? "kid" : b.who === "me" ? "me" : null;
  const allowedSyms = who === "kid" ? form.kid : form.me;
  const symptoms = Array.isArray(b.symptoms) ? b.symptoms.filter((s): s is string => typeof s === "string" && allowedSyms.includes(s)) : [];
  const has = Array.isArray(b.has) ? b.has.filter((i): i is number => Number.isInteger(i) && i >= 0 && i <= 3) : [];
  const name = clip(b.name, 120);
  const phone = clip(b.phone, 40);
  const email = clip(b.email, 200);
  const other = clip(b.other, 500);

  const errors: Record<string, string> = {};
  if (!who) errors.who = "Izaberi za koga je protokol.";
  if (!symptoms.length) errors.symptoms = "Izaberi bar jedan simptom.";
  if (!has.length) errors.has = "Izaberi šta već imaš.";
  if (!name) errors.name = "Upiši ime.";
  if (!phone || !/^\+?[0-9][0-9 /-]{7,}$/.test(phone)) errors.phone = "Upiši broj telefona, na primer +381 64 123 4567.";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Proveri email adresu.";
  if (b.consent !== true) errors.consent = "Potrebna je tvoja saglasnost da bih mogla da napravim protokol.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const ctx = abContext(req);
  const utm = (typeof b.utm === "object" && b.utm) || {};
  const u = utm as Record<string, unknown>;

  const lead = {
    experiment: ctx.experiment,
    variant: ctx.variant,
    visitor_id: ctx.visitorId,
    is_qa: ctx.isQa,
    form_location: clip(b.formLocation, 20),
    who,
    symptoms,
    symptoms_other: other,
    has_documents: has.map((i) => HAS_LABELS[i]),
    name,
    phone,
    email,
    consent: true,
    consent_at: new Date().toISOString(),
    utm_source: clip(u.utm_source, 200),
    utm_medium: clip(u.utm_medium, 200),
    utm_campaign: clip(u.utm_campaign, 200),
    utm_content: clip(u.utm_content, 200),
    utm_term: clip(u.utm_term, 200),
    fbclid: clip(u.fbclid, 300),
    gclid: clip(u.gclid, 300),
    referrer: clip(u.landing_referrer, 300),
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  if (!supabaseConfigured) {
    if (process.env.NODE_ENV === "production") {
      console.error("Prijava NIJE sačuvana: Supabase nije podešen.", { name, phone });
      return NextResponse.json({ ok: false, error: "Trenutno ne možemo da primimo prijavu. Pokušaj ponovo za par minuta." }, { status: 503 });
    }
    console.log("[lead:dev]", lead);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    await insertRow("lp_leads", lead);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Prijava nije poslata. Pokušaj ponovo za par minuta." }, { status: 502 });
  }

  // Posle odgovora korisniku: događaj za A/B rezultate i opcioni webhook.
  // Greška ovde ne sme da obori prijavu.
  after(async () => {
    if (ctx.variant && ctx.visitorId) {
      await insertRow("lp_events", {
        experiment: ctx.experiment,
        variant: ctx.variant,
        visitor_id: ctx.visitorId,
        event: "lead",
        props: { who, form_location: lead.form_location ?? "" },
        is_qa: ctx.isQa,
      }).catch((e) => console.error(e));
    }
    // Npr. n8n webhook koji Olgici šalje obaveštenje na WhatsApp ili Telegram.
    const hook = process.env.LEAD_WEBHOOK_URL;
    if (hook) {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, variant_label: ctx.variant ? VARIANT_LABELS[ctx.variant] : null }),
      }).catch((e) => console.error("Webhook nije uspeo", e));
    }
  });

  return NextResponse.json({ ok: true });
}
