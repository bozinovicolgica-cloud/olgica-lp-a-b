"use client";

import { useEffect, useRef, useState } from "react";
import { form as F, responseTime, site } from "@/lib/content";
import { safeHref } from "@/lib/rv";
import { getUtm, track } from "@/lib/track";
import { ArrowUpRight, CHECK, Ico, WHATSAPP_A, WHATSAPP_B } from "./icons";

type Who = "me" | "kid";
type Size = "hero" | "section";

type State = {
  step: 1 | 2 | 3 | 4 | 5;
  phase: "in" | "out" | "pre";
  dir: 1 | -1;
  who: Who | null;
  syms: string[];
  symsFor: Who | null;
  other: string;
  has: number[];
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  website: string; // honeypot
  tried: boolean;
  submitting: boolean;
  serverError: string;
  serverErrors: Record<string, string>;
};

const initial: State = {
  step: 1, phase: "in", dir: 1, who: null, syms: [], symsFor: null, other: "", has: [],
  name: "", phone: "", email: "", consent: false, website: "", tried: false, submitting: false,
  serverError: "", serverErrors: {},
};

function validate(s: State) {
  const e: Record<string, string> = {};
  if (!s.name.trim()) e.name = "Upiši ime.";
  if (!/^\+?[0-9][0-9 /-]{7,}$/.test(s.phone.trim())) e.phone = "Upiši broj telefona, na primer +381 64 123 4567.";
  if (s.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email.trim())) e.email = "Proveri email adresu.";
  if (!s.consent) e.consent = "Potrebna je tvoja saglasnost da bih mogla da napravim protokol.";
  return e;
}

export function LeadForm({ size }: { size: Size }) {
  const [s, setS] = useState<State>(initial);
  const started = useRef(false);
  const reduced = useRef(false);
  const hero = size === "hero";

  const set = (patch: Partial<State> | ((p: State) => Partial<State>)) =>
    setS((p) => ({ ...p, ...(typeof patch === "function" ? patch(p) : patch) }));

  useEffect(() => {
    reduced.current = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const onPrefill = (e: Event) => {
      const who = (e as CustomEvent<{ who: Who }>).detail?.who;
      if (who) set({ who, step: 1, phase: "in", syms: [], symsFor: who, other: "" });
    };
    window.addEventListener("lp:prefill", onPrefill);
    return () => window.removeEventListener("lp:prefill", onPrefill);
  }, []);

  const markStart = () => {
    if (started.current) return;
    started.current = true;
    track("form_start", { form: size });
  };

  const go = (n: State["step"]) => {
    if (n >= 2 && n <= 4) track("form_step", { step: n, form: size });
    if (reduced.current) return set({ step: n, phase: "in" });
    const dir = n > s.step ? 1 : -1;
    set({ phase: "out", dir });
    window.setTimeout(() => {
      set({ step: n, phase: "pre" });
      requestAnimationFrame(() => requestAnimationFrame(() => set({ phase: "in" })));
    }, 120);
  };

  const kid = s.who === "kid";
  const symList = kid ? F.kid : F.me;
  const hasList = ["Poslednje analize krvi", "Izveštaj lekara specijaliste", kid ? "Spisak terapije koju dete pije" : "Spisak terapije koju pijem", "Nemam ništa od ovoga"];
  const valid = s.step === 1 ? !!s.who : s.step === 2 ? s.syms.length > 0 : s.step === 3 ? s.has.length > 0 : true;
  const errs = s.tried ? { ...validate(s), ...s.serverErrors } : s.serverErrors;

  const submit = async () => {
    const e = validate(s);
    if (Object.keys(e).length) return set({ tried: true });
    set({ submitting: true, serverError: "", serverErrors: {} });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          who: s.who, symptoms: s.syms, other: s.other, has: s.has,
          name: s.name, phone: s.phone, email: s.email, consent: s.consent,
          website: s.website, formLocation: size, utm: getUtm(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        set({ submitting: false });
        track("lead", { form: size });
        go(5);
        return;
      }
      set({
        submitting: false, tried: true,
        serverErrors: data.errors ?? {},
        serverError: data.errors ? "" : data.error || "Prijava nije poslata. Pokušaj ponovo za par minuta.",
      });
    } catch {
      set({ submitting: false, serverError: "Nema konekcije. Proveri internet i pokušaj ponovo." });
    }
  };

  const next = () => {
    if (!valid || s.submitting) return;
    if (s.step === 1) {
      if (s.symsFor !== s.who) set({ syms: [], symsFor: s.who, other: "" });
      return go(2);
    }
    if (s.step < 4) return go((s.step + 1) as State["step"]);
    void submit();
  };

  const field = (k: "name" | "phone" | "email") => ({
    value: s[k],
    "aria-invalid": errs[k] ? true : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      set((p) => ({ [k]: e.target.value, serverErrors: { ...p.serverErrors, [k]: "" } } as Partial<State>)),
  });

  const slideCls = `lf-slide ${s.phase === "out" ? "out" : s.phase === "pre" ? "pre" : ""}`;
  const optIcon = (d: string) => (
    <span className="ico-soft" aria-hidden="true">
      <Ico d={d} size={20} />
    </span>
  );
  const chk = (sz: number) => (
    <span className="chk" aria-hidden="true">
      <Ico d={CHECK} size={sz} sw={20} />
    </span>
  );

  const nameField = (
    <label className="lf-field">
      <span>Ime</span>
      <input type="text" name="name" autoComplete="given-name" {...field("name")} />
      {errs.name && <span className="lf-err">{errs.name}</span>}
    </label>
  );
  const phoneField = (
    <label className="lf-field">
      <span>Broj telefona za WhatsApp</span>
      <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+381 6x xxx xxxx" {...field("phone")} />
      {errs.phone && <span className="lf-err">{errs.phone}</span>}
    </label>
  );

  return (
    <div className={`lf-card lf--${size}`} style={{ ["--dir" as string]: s.dir }}>
      <div className="lf-body">
        <div className={`lf-main ${s.step === 5 ? "hidden" : ""}`}>
          <div className="lf-progress">
            <span>Korak {Math.min(s.step, 4)} od 4</span>
            <div className="lf-bars" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={Math.min(s.step, 4)}>
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={i <= Math.min(s.step, 4) ? "on" : ""}>
                  <span />
                </span>
              ))}
            </div>
          </div>

          <div className="lf-steps">
            <div className={slideCls}>
              <div className="lf-stack">
                {/* Korak 1 */}
                <div className={`lf-view ${s.step === 1 ? "active" : ""}`} aria-hidden={s.step !== 1}>
                  <h3>Za koga je protokol?</h3>
                  <div className="lf-opts">
                    {F.who.map((o) => (
                      <button
                        key={o.key}
                        type="button"
                        className="lf-opt"
                        aria-pressed={s.who === o.key}
                        tabIndex={s.step === 1 ? 0 : -1}
                        onClick={() => {
                          markStart();
                          set({ who: o.key });
                        }}
                      >
                        {optIcon(o.d)}
                        <span className="lf-opt-label">{o.label}</span>
                        {chk(20)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Korak 2 */}
                <div className={`lf-view ${s.step === 2 ? "active" : ""}`} aria-hidden={s.step !== 2}>
                  <h3>{kid ? "Šta muči tvoje dete?" : "Šta te najviše muči?"}</h3>
                  <p className="lf-hint">Možeš da izabereš više.</p>
                  <div className="lf-chips">
                    {symList.map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="lf-chip"
                        aria-pressed={s.syms.includes(label)}
                        tabIndex={s.step === 2 ? 0 : -1}
                        onClick={() => set((p) => ({ syms: p.syms.includes(label) ? p.syms.filter((x) => x !== label) : [...p.syms, label] }))}
                      >
                        <span>{label}</span>
                        {chk(hero ? 14 : 16)}
                      </button>
                    ))}
                  </div>
                  {s.syms.includes("Nešto drugo") && (
                    <label className="lf-field" style={{ marginTop: hero ? 12 : 16 }}>
                      <span>Napiši ukratko</span>
                      <input type="text" value={s.other} tabIndex={s.step === 2 ? 0 : -1} onChange={(e) => set({ other: e.target.value })} />
                    </label>
                  )}
                </div>

                {/* Korak 3 */}
                <div className={`lf-view ${s.step === 3 ? "active" : ""}`} aria-hidden={s.step !== 3}>
                  <h3>Šta već imaš?</h3>
                  <p className="lf-hint">Idealno je da imaš poslednje analize krvi i izveštaj lekara specijaliste.</p>
                  {(() => {
                    const toggle = (i: number) =>
                      set((p) => {
                        if (i === 3) return { has: p.has.includes(3) ? [] : [3] };
                        const h = p.has.filter((x) => x !== 3);
                        return { has: h.includes(i) ? h.filter((x) => x !== i) : [...h, i] };
                      });
                    return hero ? (
                      <div className="lf-chips">
                        {hasList.map((label, i) => (
                          <button key={i} type="button" className="lf-chip" aria-pressed={s.has.includes(i)} tabIndex={s.step === 3 ? 0 : -1} onClick={() => toggle(i)}>
                            <span>{label}</span>
                            {chk(14)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="lf-opts">
                        {hasList.map((label, i) => (
                          <button key={i} type="button" className="lf-opt" aria-pressed={s.has.includes(i)} tabIndex={s.step === 3 ? 0 : -1} onClick={() => toggle(i)}>
                            {optIcon(F.hasIcons[i])}
                            <span className="lf-opt-label">{label}</span>
                            {chk(20)}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Korak 4 */}
                <div className={`lf-view ${s.step === 4 ? "active" : ""}`} aria-hidden={s.step !== 4}>
                  <h3>Gde da ti se javim?</h3>
                  <div className="lf-fields">
                    {hero ? (
                      <div className="lf-row2">
                        {nameField}
                        {phoneField}
                      </div>
                    ) : (
                      <>
                        {nameField}
                        {phoneField}
                      </>
                    )}
                    <label className="lf-field">
                      <span>Email (nije obavezno)</span>
                      <input type="email" name="email" autoComplete="email" {...field("email")} />
                      {errs.email && <span className="lf-err">{errs.email}</span>}
                    </label>
                    <div className="lf-hp" aria-hidden="true">
                      <label>
                        Website
                        <input type="text" tabIndex={-1} autoComplete="off" value={s.website} onChange={(e) => set({ website: e.target.value })} />
                      </label>
                    </div>
                    <div className="lf-consent">
                      <label>
                        <input type="checkbox" checked={s.consent} onChange={(e) => set((p) => ({ consent: e.target.checked, serverErrors: { ...p.serverErrors, consent: "" } }))} />
                        <span>
                          Dajem saglasnost da Olgica Božinović obrađuje moje podatke, uključujući i podatke o zdravlju, radi izrade protokola.{" "}
                          <a href={safeHref(site.links.privacy)} target="_blank" rel="noopener">
                            Politika privatnosti
                          </a>
                        </span>
                      </label>
                      {errs.consent && <span className="lf-err">{errs.consent}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {s.serverError && (
            <p className="lf-server-err" role="alert">
              {s.serverError}
            </p>
          )}

          <div className="lf-foot">
            <div>
              {s.step > 1 && s.step < 5 && (
                <button type="button" className="lf-back" onClick={() => go((s.step - 1) as State["step"])}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="216" y1="128" x2="40" y2="128" />
                    <polyline points="112 56 40 128 112 200" />
                  </svg>
                  <span>Nazad</span>
                </button>
              )}
            </div>
            <button type="button" className="btn btn-primary lf-next" aria-disabled={!valid || s.submitting} onClick={next}>
              <span>{s.step === 4 ? (s.submitting ? "Šaljem..." : "Pošalji prijavu") : "Dalje"}</span>
              <span className="btn-ico">
                <ArrowUpRight />
              </span>
            </button>
          </div>
        </div>

        {s.step === 5 && (
          <div className="lf-done">
            <div className={slideCls}>
              <div role="status">
                <span className="ok" aria-hidden="true">
                  <Ico d={CHECK} size={30} color="#FFFFFF" sw={16} />
                </span>
                <h3>Prijava je stigla</h3>
                <p>
                  Javiću ti se na WhatsApp {responseTime} da dogovorimo online poziv. Do tada pripremi poslednje analize krvi, izveštaj lekara specijaliste i spisak terapije.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!hero && (
        <div className="lf-meta">
          <div>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="128" cy="128" r="96" />
              <polyline points="128 72 128 128 184 128" />
            </svg>
            <span>Traje oko [2] minuta</span>
          </div>
          <div>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
              <line x1="88" y1="64" x2="216" y2="64" />
              <line x1="88" y1="128" x2="216" y2="128" />
              <line x1="88" y1="192" x2="216" y2="192" />
              <circle cx="48" cy="64" r="8" />
              <circle cx="48" cy="128" r="8" />
              <circle cx="48" cy="192" r="8" />
            </svg>
            <span>4 kratka pitanja</span>
          </div>
          <div>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
              <path d={WHATSAPP_A} />
              <path d={WHATSAPP_B} />
            </svg>
            <span>Odgovor dobijaš na WhatsApp-u</span>
          </div>
        </div>
      )}
    </div>
  );
}
