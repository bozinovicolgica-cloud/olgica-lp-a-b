import type { CSSProperties } from "react";

// Ikonice iz dizajna (Phosphor stil, viewBox 256).

export function Ico({
  d,
  size = 24,
  color = "#3A5139",
  sw = 12,
  fill = "none",
  style,
}: {
  d: string;
  size?: number;
  color?: string;
  sw?: number;
  fill?: string;
  style?: CSSProperties;
}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 256 256" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

export const CHECK = "M40,144l56,56L224,72";
export const CROSS = "M200,56L56,200 M200,200L56,56";
export const LEAF = "M64,208C40,96,152,48,216,40c-8,64-56,176-152,168 M40,232l112-112";
export const WHATSAPP_A = "M72,104a32,32,0,0,1,32-32l16,32-12.32,18.47a48.19,48.19,0,0,0,25.85,25.85L152,136l32,16a32,32,0,0,1-32,32A80,80,0,0,1,72,104Z";
export const WHATSAPP_B = "M79.93,211.11a96,96,0,1,0-35-35h0L32.42,213.46a6,6,0,0,0,7.59,7.59L77.32,208.6Z";

export function ArrowUpRight({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
      <line x1="64" y1="192" x2="192" y2="64" />
      <polyline points="88 64 192 64 192 168" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 24, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
      <path d={WHATSAPP_A} />
      <path d={WHATSAPP_B} />
    </svg>
  );
}
