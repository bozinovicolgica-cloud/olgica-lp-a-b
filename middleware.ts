import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_MAX_AGE,
  COOKIE_QA,
  COOKIE_VARIANT,
  COOKIE_VISITOR,
  EXPERIMENT_ID,
  SPLIT_B,
  isVariant,
  type Variant,
} from "@/lib/ab";

// Podela saobraćaja 50/50 na edge-u, pre nego što se stranica pošalje.
// Posetilac uvek ostaje na adresi "/", a interno dobija /a ili /b.
// Varijanta se pamti u cookie-ju, pa isti čovek uvek vidi istu verziju.
//
// Za proveru: /?v=a ili /?v=b (takav posetilac se označava kao QA i ne ulazi u rezultate).

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Direktan pristup /a ili /b vraćamo na "/" da bi postojala samo jedna javna adresa.
  if (url.pathname === "/a" || url.pathname === "/b") {
    const to = url.clone();
    to.pathname = "/";
    to.searchParams.set("v", url.pathname.slice(1));
    return NextResponse.redirect(to);
  }

  const forced = url.searchParams.get("v");
  const cookieVal = req.cookies.get(COOKIE_VARIANT)?.value ?? "";
  const [cookieExp, cookieVariant] = cookieVal.split(":");

  let variant: Variant;
  let isQa = req.cookies.get(COOKIE_QA)?.value === "1";

  if (isVariant(forced)) {
    variant = forced;
    isQa = true;
  } else if (cookieExp === EXPERIMENT_ID && isVariant(cookieVariant)) {
    variant = cookieVariant;
  } else {
    variant = Math.random() < SPLIT_B ? "b" : "a";
  }

  const rewriteUrl = url.clone();
  rewriteUrl.pathname = `/${variant}`;
  const res = NextResponse.rewrite(rewriteUrl);

  const cookieOpts = {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: url.protocol === "https:",
  };

  res.cookies.set(COOKIE_VARIANT, `${EXPERIMENT_ID}:${variant}`, cookieOpts);
  if (!req.cookies.get(COOKIE_VISITOR)) {
    res.cookies.set(COOKIE_VISITOR, crypto.randomUUID(), cookieOpts);
  }
  if (isQa) res.cookies.set(COOKIE_QA, "1", { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

  // CDN ne sme da kešira odgovor zajedno sa cookie-jem jednog posetioca.
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("x-lp-variant", variant);
  return res;
}

export const config = {
  matcher: ["/", "/a", "/b"],
};
