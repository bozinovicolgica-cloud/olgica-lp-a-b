"use client";

import { useEffect, useRef, useState } from "react";
import type { Variant } from "@/lib/ab";
import { captureUtm, track } from "@/lib/track";
import { CtaLink } from "./CtaLink";

/** Beleži prikaz stranice za A/B rezultate i pamti UTM parametre. */
export function PageTracker({ variant }: { variant: Variant }) {
  useEffect(() => {
    window.__lpVariant = variant;
    document.documentElement.dataset.variant = variant;
    captureUtm();
    track("view", { w: window.innerWidth < 760 ? "mobile" : "desktop" });
  }, [variant]);
  return null;
}

export function VideoBlock({ src, poster }: { src: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-frame">
      <div className="video-box">
        {playing ? (
          <video src={src} controls autoPlay playsInline poster={poster || undefined} />
        ) : (
          <button
            type="button"
            className="video-poster"
            aria-label="Pusti video"
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
            onClick={() => {
              setPlaying(true);
              track("cta_click", { location: "hero_video" });
            }}
          >
            <span className="video-play">
              <svg aria-hidden="true" width="30" height="30" viewBox="0 0 256 256" fill="#3A5139" stroke="#3A5139" strokeWidth="12" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                <path d="M72,40V216a8,8,0,0,0,12,7l144-88a8,8,0,0,0,0-14L84,33A8,8,0,0,0,72,40Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Linija saradnje koja se popunjava dok se skroluje. */
export function Timeline({ steps }: { steps: { title: string; desc: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setP(1);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mobile = window.innerWidth <= 900;
        const span = mobile ? Math.max(300, r.height - 120) : 420;
        const v = Math.max(0, Math.min(1, (window.innerHeight * 0.8 - r.top) / span));
        // Samo napred: kad se korak jednom prikaže, ne skriva se pri skrolu nazad.
        setP((old) => (v > old + 0.01 || (v === 1 && old !== 1) ? v : old));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`tl-wrap ${p >= 1 ? "done" : ""}`}>
      <div ref={ref} className="tl" style={{ ["--tl" as string]: p }}>
        <div className="tl-line" aria-hidden="true" />
        <div className="tl-line tl-line--on" aria-hidden="true" />
        <ol>
          {steps.map((st, i) => {
            const on = p > 0 && p >= i / (steps.length - 1) - 0.001;
            return (
              <li key={st.title} className={`${on ? "on" : ""} ${i === steps.length - 1 ? "last" : ""}`}>
                <span className="tl-dot" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="tl-text">
                  <h3>{st.title}</h3>
                  <p>{st.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <TimelineCta />
    </div>
  );
}

// Dugme ispod linije se pojavljuje kad se linija popuni (kao u dizajnu).
function TimelineCta() {
  return (
    <div className="tl-cta rv">
      <CtaLink location="saradnja">Prijavi se za protokol</CtaLink>
    </div>
  );
}

/** Brojevi koji odbrojavaju kad sekcija uđe u ekran. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;
    setV(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        window.setTimeout(() => {
          const t0 = performance.now();
          const stepFn = (t: number) => {
            const k = Math.min(1, (t - t0) / 1400);
            setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
            if (k < 1) raf = requestAnimationFrame(stepFn);
          };
          raf = requestAnimationFrame(stepFn);
        }, 500);
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number[]>([0]);
  return (
    <div className="faq-list">
      {items.map(([q, a], i) => {
        const on = open.includes(i);
        const toggle = () => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
        return (
          <div key={q} className={`faq-item ${on ? "open" : ""}`} onClick={toggle}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={on}
              aria-controls={`faq-a-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              <span>{q}</span>
              <span className="faq-plus" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="12" strokeLinecap="round">
                  <path d="M40,128H216 M128,40V216" />
                </svg>
              </span>
            </button>
            <div className="faq-a" id={`faq-a-${i}`}>
              <div>
                <p>{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
