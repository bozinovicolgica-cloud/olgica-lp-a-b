import type { CSSProperties } from "react";

/** Stil za element koji se pojavljuje kad njegova Reveal grupa uđe u ekran. */
export function rv(delay = 0, dist = 16, dur = 600): CSSProperties {
  return {
    ["--rv-delay" as string]: `${delay}ms`,
    ["--rv-dist" as string]: `${dist}px`,
    ["--rv-dur" as string]: `${dur}ms`,
  } as CSSProperties;
}

/** Placeholder linkovi iz dizajna ("[link]") ne smeju da postanu prave adrese. */
export function safeHref(href: string) {
  return href.startsWith("[") ? "#" : href;
}
