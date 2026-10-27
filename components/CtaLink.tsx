"use client";

import type { CSSProperties, ReactNode } from "react";
import { track } from "@/lib/track";
import { ArrowUpRight } from "./icons";

/**
 * Dugme koje vodi na formu (#prijava). Beleži klik po lokaciji, a za
 * "Prijavi dete" unapred popunjava formu.
 */
export function CtaLink({
  href = "#prijava",
  tone = "primary",
  location,
  prefillKid = false,
  className = "",
  style,
  children,
}: {
  href?: string;
  tone?: "primary" | "light";
  location: string;
  prefillKid?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`btn btn-${tone} ${className}`.trim()}
      style={style}
      onClick={() => {
        track("cta_click", { location });
        if (prefillKid) window.dispatchEvent(new CustomEvent("lp:prefill", { detail: { who: "kid" } }));
        if (href === "#prijava") {
          // Fokus na prvo pitanje kad skrol stigne do forme (pristupačnost + jasnoća).
          window.setTimeout(() => {
            const b = document.querySelector<HTMLButtonElement>("#prijava .lf-view.active button");
            b?.focus({ preventScroll: true });
          }, 650);
        }
      }}
    >
      <span>{children}</span>
      <span className="btn-ico">
        <ArrowUpRight color={tone === "light" ? "#3A5139" : "#FFFFFF"} />
      </span>
    </a>
  );
}
