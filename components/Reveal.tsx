"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Grupa koja dobija klasu "in" kad uđe u ekran. Elementi unutra sa klasom "rv"
 * se pojavljuju sa svojim kašnjenjem (vidi rv() ispod i .rv u globals.css).
 */
export function Reveal({
  as: Tag = "div",
  className = "",
  threshold = 0.18,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  threshold?: number;
  children: ReactNode;
  id?: string;
  style?: CSSProperties;
  role?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={`rg ${inView ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
