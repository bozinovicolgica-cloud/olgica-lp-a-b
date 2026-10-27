import Script from "next/script";
import type { Variant } from "@/lib/ab";
import { PageTracker } from "./client-bits";
import {
  About, Bento, Comparison, FaqSection, Final, Fit, Flow, Footer, Header, HeroA, HeroB,
  HowItWorks, Parents, Pricing, Proof, Symptoms, Testimonials,
} from "./Sections";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

/**
 * Cela stranica. Jedina razlika između varijanti:
 *  A: hero bez forme, forma u sekciji "Cena" pored kartice sa cenom
 *  B: forma u hero delu, sekcija "Cena" ima samo cenu i dugme koje vodi gore na formu
 */
export function LandingPage({ variant }: { variant: Variant }) {
  return (
    <>
      <PageTracker variant={variant} />
      <Header />
      <main>
        {variant === "a" ? <HeroA /> : <HeroB />}
        <Proof />
        <Symptoms />
        <Comparison />
        <Flow />
        <Bento />
        <Testimonials />
        <HowItWorks />
        <Parents />
        <About />
        <Fit />
        <Pricing withForm={variant === "a"} />
        <FaqSection />
        <Final />
      </main>
      <Footer />

      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView',{ab_variant:'${variant}'});`}
        </Script>
      )}
      {GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}',{ab_variant:'${variant}'});gtag('set','user_properties',{ab_variant:'${variant}'});`}
          </Script>
        </>
      )}
    </>
  );
}
