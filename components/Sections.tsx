import {
  about, bento, bentoHighlight, comparison, faqs, finalCta, fit, flowInputs, footer, hero, messageRows,
  nav, parents, pricing, proof, responseTime, site, steps, symptoms, testimonials,
} from "@/lib/content";
import { rv, safeHref } from "@/lib/rv";
import { CountUp, Faq, Timeline, VideoBlock } from "./client-bits";
import { CtaLink } from "./CtaLink";
import { CHECK, CROSS, Ico, LEAF, WhatsAppIcon } from "./icons";
import { LeadForm } from "./LeadForm";
import { Reveal } from "./Reveal";

/* ---------------- Header ---------------- */
export function Header() {
  return (
    <header className="site-header">
      <a href="#" className="brand" aria-label="Olgica Božinović, početna">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-text">
          <span className="brand-name">{site.name}</span>
          <span className="brand-role">{site.role}</span>
        </span>
      </a>
      <nav className="site-nav" aria-label="Glavna navigacija">
        {nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <CtaLink location="header">Prijavi se</CtaLink>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function HeroTitle() {
  return (
    <>
      <p className="eyebrow fade-up" style={{ animationDelay: "150ms" }}>
        {hero.eyebrow}
      </p>
      <h1 className="fade-up" style={{ animationDelay: "230ms" }}>
        Protokol ishrane
        <br />
        napravljen <em>za tebe</em>
      </h1>
      <p className="lead fade-up" style={{ animationDelay: "310ms" }}>
        {hero.lead}
      </p>
    </>
  );
}

function HeroButtons() {
  return (
    <div className="hero-ctas fade-up" style={{ animationDelay: "390ms" }}>
      <CtaLink location="hero">Prijavi se za protokol</CtaLink>
      <a href="#kako-funkcionise" className="btn btn-outline">
        Pogledaj kako funkcioniše
      </a>
    </div>
  );
}

function HeroVideo({ top }: { top: number }) {
  if (!site.videoSrc) return null;
  return (
    <div className="hero-video-wrap fade-up" style={{ marginTop: top, animationDelay: "470ms", animationDuration: "700ms" }}>
      <VideoBlock src={site.videoSrc} poster={site.videoPoster} />
    </div>
  );
}

/** Varijanta A: centriran hero, forma je dole pored cene. */
export function HeroA() {
  return (
    <section className="hero hero--a">
      <div aria-hidden="true" className="hero-blob" style={{ width: 560, height: 560, left: "calc(50% - 460px)", top: 140, background: "#DFE8DC", opacity: 0.45 }} />
      <div aria-hidden="true" className="hero-blob" style={{ width: 520, height: 520, left: "calc(50% - 40px)", top: 180, background: "#F3E6D6", opacity: 0.5 }} />
      <div className="container hero-inner">
        <HeroTitle />
        <HeroButtons />
        <HeroVideo top={40} />
      </div>
    </section>
  );
}

/** Varijanta B: forma je odmah u hero delu, desno od naslova. */
export function HeroB() {
  return (
    <section className="hero hero--b">
      <div aria-hidden="true" className="hero-blob" style={{ width: 560, height: 560, left: "calc(50% - 640px)", top: 160, background: "#DFE8DC", opacity: 0.45 }} />
      <div aria-hidden="true" className="hero-blob" style={{ width: 520, height: 520, left: "calc(50% - 280px)", top: 240, background: "#F3E6D6", opacity: 0.5 }} />
      <div className="container hero-inner">
        <div className="hero-grid">
          <div className="hero-copy">
            <HeroTitle />
            <HeroButtons />
          </div>
          <div id="prijava" className="hero-form fade-up" style={{ animationDelay: "390ms", animationDuration: "700ms" }}>
            <LeadForm size="hero" />
          </div>
        </div>
        <HeroVideo top={64} />
      </div>
    </section>
  );
}

/* ---------------- Iskustvo ---------------- */
const BRANCH =
  "M150,560 Q161,530 160,500 C199.5,504.1 242.2,471 258.3,431.2 C215.4,432.7 169.7,461.5 160,500 Q160,470 148,440 C135.5,402.7 88.2,378.4 45.8,381 C64.8,419 109.5,447.8 148,440 Q162,407.5 164,375 C200.2,381.8 242.7,354.5 261,319 C221.1,317.1 176.2,340.2 164,375 Q163,345 150,315 C139.8,280.3 97.3,256.6 58.4,257.8 C74.4,293.3 114.4,321 150,315 Q164,285 166,255 C199,259.3 235.1,232.3 248.9,199.1 C213,199.4 174.4,222.8 166,255 Q167,226.5 156,198 C148.3,167.4 112,145.5 78.1,145.4 C90.9,176.9 124.8,202.3 156,198 Q170,171.5 172,145 C200.3,146.1 228,120.3 236.3,91 C206.1,94.1 175.9,116.9 172,145 Q175,121.5 166,98 C164,73.3 138.8,52.9 112.5,49.8 C118.3,75.6 141.2,98.6 166,98 Q179,78 180,58 C199.4,52.4 211.2,29.1 209,7.8 C189.4,16.5 175.1,38.4 180,58 Q188,36 196,12";
const SPRIG = "M20,120 Q40,100 52,84 C77,82.2 95.9,56.9 97,30.4 C71.1,36.1 49.5,59 52,84 C57,66.7 44.6,47.8 27,40.7 C24.4,59.5 34.5,79.7 52,84";

export function Proof() {
  return (
    <Reveal as="section" className="section bg-sand proof">
      <svg aria-hidden="true" className="proof-branch" width="420" height="560" viewBox="0 0 420 560">
        <path d={BRANCH} pathLength={1} className="draw" style={{ ["--draw-dur" as string]: "4200ms", ["--draw-delay" as string]: "200ms" }} fill="none" stroke="#9DB799" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="container proof-grid">
        <div className="proof-card-col">
          <svg aria-hidden="true" className="proof-leaf" width="140" height="140" viewBox="0 0 140 140">
            <path d={SPRIG} pathLength={1} className="draw" style={{ ["--draw-dur" as string]: "2400ms", ["--draw-delay" as string]: "900ms" }} fill="none" stroke="#9DB799" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <figure className="proof-card rv" style={rv(0, 24, 800)}>
            <div className="proof-src">
              <Ico d="M45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216a8,8,0,0,1,8,8V192a8,8,0,0,1-8,8H80Z" size={20} />
              <span>{proof.source}</span>
            </div>
            <blockquote>{proof.quote}</blockquote>
          </figure>
        </div>
        <div className="proof-stat">
          <div className="rv" style={rv(200)}>
            <span className="proof-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="84" cy="108" r="52" />
                <path d="M10.23,200a88,88,0,0,1,147.54,0" />
                <path d="M172,160a87.93,87.93,0,0,1,73.77,40" />
                <path d="M152.69,59.7A52,52,0,1,1,172,160" />
              </svg>
            </span>
          </div>
          <div className="proof-num rv" style={rv(300, 16, 900)}>
            {proof.number}
          </div>
          <p className="rv" style={rv(420)}>
            {proof.numberText}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Simptomi ---------------- */
function Ring() {
  return (
    <svg width="560" height="560" viewBox="0 0 560 560">
      <circle cx="280" cy="280" r="280" fill="none" stroke="#C2D3BE" strokeWidth="1.5" />
      <g className="heads">
        {[-60, 0, 60, 120, 180, 240].map((a) => (
          <g key={a} transform={`rotate(${a + 90} 280 280)`}>
            <polyline points="273,-7 281,0 273,7" fill="none" stroke="#B8895A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Symptoms() {
  return (
    <Reveal as="section" id="simptomi" className="section bg-cream">
      <div className="container">
        <h2 className="h2 center rv">Da li ti ovo zvuči poznato?</h2>
        <div className="sym-stage">
          <div className="sym-ring rv" style={rv(160, 0, 900)} aria-hidden="true">
            <Ring />
          </div>
          <div className="sym-center">
            <div className="rv" style={{ ...rv(760), display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p>Jedan simptom vuče drugi.</p>
              <CtaLink location="simptomi">Prijavi se za protokol</CtaLink>
            </div>
          </div>
          {symptoms.map((s, i) => (
            <div key={s.title} className={`sym-node n${i}`}>
              <div className="sym-node-inner rv" style={rv(240 + i * 80)}>
                <span className="sym-ico" aria-hidden="true">
                  <Ico d={s.d} size={28} color="#FFFFFF" />
                </span>
                <span className="sym-txt">
                  <span className="sym-title">{s.title}</span>
                  <span className="sym-desc">{s.desc}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="sym-note rv" style={rv(840)}>
          <span className="sym-note-ico" aria-hidden="true">
            <Ico d="M168,40h32a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H88 M88,72V64a40,40,0,0,1,80,0v8Z M96,152h64 M96,120h64" size={28} />
          </span>
          <span className="sym-note-txt">
            <strong>Imaš nalaze i terapiju, a nemaš plan ishrane</strong>
            <span>Lekar ti je dao terapiju, a ostalo je pitanje šta da jedeš uz nju.</span>
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Poređenje ---------------- */
export function Comparison() {
  return (
    <section className="section bg-sand">
      <div className="container">
        <Reveal className="center">
          <h2 className="h2 rv">Zašto opšti saveti često ne pomognu</h2>
          <p className="lead rv" style={{ ...rv(80), marginTop: 24 }}>
            Svako telo je drugačije, pa i plan mora da bude.
          </p>
          <div className="cmp-head rv" style={rv(120)}>
            <div style={{ color: "#7A6D5E" }}>
              <Ico d={CROSS} size={16} color="#B4483C" sw={20} />
              <span>Opšti saveti</span>
            </div>
            <div style={{ gridColumn: 3, color: "#3A5139" }}>
              <Ico d={CHECK} size={18} sw={20} />
              <span>Protokol ishrane</span>
            </div>
          </div>
        </Reveal>
        <div className="cmp-list" role="list">
          {comparison.map(([label, gen, pro]) => (
            <Reveal key={label} className="cmp-row" role="listitem">
              <div className="cmp-gen">
                <span className="cmp-label">{label}</span>
                <span className="cmp-gen-txt">
                  <Ico d={CROSS} size={16} color="#B4483C" sw={20} />
                  <span>{gen}</span>
                </span>
              </div>
              <div className="cmp-mid">
                <span className="cmp-arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 256 256" fill="none" stroke="#3A5139" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="40" y1="128" x2="216" y2="128" />
                    <polyline points="144 56 216 128 144 200" />
                  </svg>
                </span>
              </div>
              <div className="cmp-pro">
                <span className="cmp-pro-txt">
                  <span className="check-dot" aria-hidden="true">
                    <Ico d={CHECK} size={14} sw={20} />
                  </span>
                  <span>{pro}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="cmp-cta">
          <div className="rv" style={rv(200)}>
            <CtaLink location="poredjenje">Prijavi se za protokol</CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Kako nastaje protokol ---------------- */
function FlowSvg() {
  const ys = [92, 204, 316, 428];
  const paths = ys.map((y) => `M0,${y} C70,${y} 80,260 150,260`);
  const st = { fill: "none", stroke: "#9DB799", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="228" height="520" viewBox="0 0 228 520" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength={1} className="draw" style={{ ...st, ["--draw-dur" as string]: "900ms", ["--draw-delay" as string]: `${520 + i * 60}ms` }} />
      ))}
      <path d="M150,260 L220,260" pathLength={1} className="draw" style={{ ...st, ["--draw-dur" as string]: "400ms", ["--draw-delay" as string]: "1300ms" }} />
      <polyline className="tip" points="212,253 220,260 212,267" style={st} />
      <g className="dots">
        {paths.map((d, i) => (
          <circle key={`d${i}`} r="3" fill="#3A5139" opacity="0">
            <animateMotion path={`${d} L220,260`} dur="5s" begin={`${1.8 + i * 1.1}s`} repeatCount="indefinite" />
            <set attributeName="opacity" to="1" begin={`${1.8 + i * 1.1}s`} />
          </circle>
        ))}
      </g>
    </svg>
  );
}

export function Flow() {
  return (
    <section id="protokol" className="section bg-cream">
      <div className="container">
        <Reveal className="flow-head">
          <div className="rv">
            <p className="eyebrow">Personalizovano</p>
            <h2 className="h2">Kako nastaje tvoj protokol</h2>
            <p className="lead">Pre nego što napišem prvi obrok, gledam četiri stvari o tebi. Iz njih nastaje plan napravljen za tvoje telo.</p>
          </div>
        </Reveal>
        <Reveal className="flow">
          <div className="flow-in">
            {flowInputs.map((c, i) => (
              <div key={c.title} className="flow-card rv" style={rv(i * 120)}>
                <span className="ico-soft" aria-hidden="true">
                  <Ico d={c.d} size={24} />
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span className="card-title">{c.title}</span>
                  <span className="card-desc">{c.desc}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="flow-svg">
            <FlowSvg />
          </div>
          <div className="flow-out">
            <span className="ico-white" aria-hidden="true">
              <Ico d={LEAF} size={28} />
            </span>
            <h3>Tvoj protokol ishrane</h3>
            <p>Plan napravljen samo za tvoje telo. Namirnice koje ne podnosiš ili ne voliš izbacujem iz jelovnika.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Više od jelovnika ---------------- */
export function Bento() {
  return (
    <Reveal as="section" className="section bg-green">
      <div className="container">
        <div className="center rv">
          <h2 className="h2 on-dark">Više od jelovnika</h2>
          <p className="lead" style={{ marginTop: 24, color: "#DFE8DC" }}>
            Protokol je sveobuhvatan i zdravlju pristupa celovito.
          </p>
        </div>
        <div className="bento">
          {bento.map((b, i) => (
            <div key={b.n} className="bento-cell">
              <div className="rv" style={rv(160 + i * 80, 0)}>
                <div className="bento-num" aria-hidden="true">
                  <div className="rv" style={rv(160 + i * 80, 16, 800)}>
                    {b.n}
                  </div>
                </div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
          <div className="bento-cell bento-hl-wrap">
            <div className="rv" style={{ ...rv(560, 24, 800), height: "100%" }}>
              <div className="bento-hl">
                <div className="bento-num" aria-hidden="true">
                  <div>{bentoHighlight.n}</div>
                </div>
                <h3>{bentoHighlight.title}</h3>
                <p>{bentoHighlight.desc}</p>
                <span className="wa" aria-hidden="true">
                  <WhatsAppIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rv" style={{ ...rv(760), marginTop: 64, display: "flex", justifyContent: "center" }}>
          <CtaLink tone="light" location="bento">
            Prijavi se za protokol
          </CtaLink>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Iskustva ---------------- */
export function Testimonials() {
  return (
    <section id="iskustva" className="section bg-sand" style={{ overflow: "hidden" }}>
      <div className="container">
        <Reveal>
          <h2 className="h2 rv" style={{ maxWidth: 800 }}>
            Šta kažu ljudi sa kojima sam radila
          </h2>
        </Reveal>
        <Reveal className="testi">
          <figure className="testi-l rv" style={rv(0)}>
            <blockquote>{testimonials.left}</blockquote>
          </figure>
          <figure className="testi-r rv" style={rv(120)}>
            <blockquote>{testimonials.right}</blockquote>
          </figure>
        </Reveal>
      </div>
      <div className="marquees">
        {messageRows.map((row, r) => (
          <div key={r} className={`marquee ${r === 1 ? "marquee--rev" : ""}`}>
            <div className="marquee-track">
              {[...row, ...row].map((m, i) => (
                <div key={i} className="msg" aria-hidden={i >= row.length ? true : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={i < row.length ? "Poruka klijenta" : ""} loading="lazy" decoding="async" width={m.w} height={376} style={{ width: m.w }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Saradnja ---------------- */
export function HowItWorks() {
  return (
    <section id="kako-funkcionise" className="section bg-cream">
      <div className="container">
        <Reveal>
          <h2 className="h2 rv">Kako izgleda saradnja</h2>
        </Reveal>
        <Timeline steps={steps.map(({ title, desc }) => ({ title, desc }))} />
      </div>
    </section>
  );
}

/* ---------------- Za roditelje ---------------- */
export function Parents() {
  return (
    <section id="za-roditelje" className="section bg-sand">
      <div className="container">
        <Reveal className="par-panel rv" style={rv(0, 24, 800)}>
          <div className="par-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/olgica-beleske.webp" alt="Olgica Božinović čita beleške" loading="lazy" decoding="async" width={1333} height={2000} />
          </div>
          <div className="par-copy">
            <p className="eyebrow">{parents.eyebrow}</p>
            <h2 className="h2">{parents.title}</h2>
            <p className="lead">{parents.text}</p>
            <ul className="par-list">
              {parents.bullets.map((b, i) => (
                <li key={b} className="rv" style={rv(400 + i * 80, 8, 500)}>
                  <span className="check-dot check-dot--green" aria-hidden="true">
                    <Ico d={CHECK} size={14} color="#FFFFFF" sw={20} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex" }}>
              <CtaLink location="roditelji" prefillKid>
                Prijavi dete za protokol
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- O meni ---------------- */
export function About() {
  return (
    <Reveal as="section" id="o-meni" className="section bg-cream">
      <div className="container">
        <div className="center rv">
          <p className="eyebrow">O meni</p>
          <h2 className="about-title">
            Zdravo, ja sam <em>Olgica</em>
          </h2>
        </div>
        <div className="about-panel rv" style={rv(120, 32, 900)}>
          <div className="about-left">
            <div>
              <p className="about-role">{about.role}</p>
              <div className="about-rule" />
              <p className="about-story">{about.story}</p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-num">
                  <CountUp to={about.stats.years} />
                </span>
                <span className="stat-label">godina rada</span>
              </div>
              <div className="stat">
                <span className="stat-num">
                  <CountUp to={about.stats.schools} />
                </span>
                <span className="stat-label">škole i edukacije</span>
              </div>
            </div>
          </div>
          <div className="about-photo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/olgica-portret.webp" alt="" loading="lazy" decoding="async" width={1333} height={2000} />
          </div>
          <div className="about-right">
            <div>
              <div className="edu-head">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="#B8895A" strokeWidth="12" strokeLinejoin="round">
                  <path d="M128,24C138,96,160,118,232,128C160,138,138,160,128,232C118,160,96,138,24,128C96,118,118,96,128,24Z" />
                </svg>
                <span>Obrazovanje</span>
              </div>
              <div className="edu-rule" />
              <p className="edu-degree">{about.degree}</p>
              <p className="edu-school">{about.school}</p>
              <div className="edu-list">
                {about.education.map((e) => (
                  <span key={e}>{e}</span>
                ))}
              </div>
            </div>
            <div className="stat">
              <span className="stat-num">
                <CountUp to={about.stats.clients} suffix="+" />
              </span>
              <span className="stat-label">klijenata</span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Za koga je ---------------- */
export function Fit() {
  return (
    <Reveal as="section" id="za-koga" className="section bg-sand">
      <div className="container fit-wrap">
        <h2 className="h2 center rv">Da li je protokol za tebe?</h2>
        <div className="fit-tags-wrap">
          <p className="fit-tags-label rv" style={rv(80, 8, 500)}>
            U radu sam se susrela sa:
          </p>
          <ul className="fit-tags">
            {fit.tags.map((t, i) => (
              <li key={t} className="rv" style={rv(160 + i * 40, 8, 500)}>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="fit-yes rv" style={rv(640, 24, 800)}>
          <h3>Ovo je za tebe ako:</h3>
          <ul>
            {fit.yes.map((t, i) => (
              <li key={t} className="rv" style={rv(800 + i * 80)}>
                <span className="yes-ico" aria-hidden="true" style={{ ["--rv-delay" as string]: `${900 + i * 80}ms` }}>
                  <Ico d={CHECK} size={16} color="#FFFFFF" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="fit-no rv" style={rv(1100, 0, 800)}>
          <h3>Ovo nije za tebe ako:</h3>
          <ul>
            {fit.no.map((t) => (
              <li key={t}>
                <span className="no-ico" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="none" stroke="#B4483C" strokeWidth="12" strokeLinecap="round">
                    <path d="M64,64L192,192 M192,64L64,192" />
                  </svg>
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <small>Protokol ne zamenjuje lečenje ni savet lekara.</small>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Cena ---------------- */
function PriceCard({ withCta }: { withCta: boolean }) {
  return (
    <div className="price-card">
      <span className="price-ico" aria-hidden="true">
        <Ico d={LEAF} size={20} color="#FFFFFF" />
      </span>
      <h3>Protokol ishrane</h3>
      <p className="price-sub">Antiupalni i antivirusni protokol, napravljen za tebe.</p>
      <p className="eyebrow">Šta dobijaš</p>
      <ul className="price-rows">
        {pricing.rows.map(([item, val], i) => (
          <li key={item} className="rv" style={rv(520 + i * 60, 8, 500)}>
            <span className="item">
              <Ico d={CHECK} size={16} color="#FFFFFF" />
              <span>{item}</span>
            </span>
            <span className="val">{val}</span>
          </li>
        ))}
      </ul>
      <div className="price-total rv" style={rv(900)}>
        <span>Ukupna vrednost</span>
        <s>{pricing.total}</s>
      </div>
      <div className="price-box rv" style={rv(980, 16, 700)}>
        <p className="eyebrow">Tvoja cena</p>
        <div className="price-amount">
          <span className="num">{pricing.price}</span>
          <span className="cur">EUR</span>
          <span className="price-badge">{pricing.saving}</span>
        </div>
      </div>
      {withCta && (
        <div className="price-cta rv" style={rv(1100)}>
          <CtaLink tone="light" location="cena">
            Prijavi se za protokol
          </CtaLink>
        </div>
      )}
    </div>
  );
}

/** A: cena + forma jedna pored druge. B: samo cena, dugme vodi na formu u hero delu. */
export function Pricing({ withForm }: { withForm: boolean }) {
  return (
    <Reveal as="section" id="cena" className="section bg-cream">
      <div className="container">
        <div className="center rv">
          <h2 className="h2">Prijavi se za protokol</h2>
          <p className="lead" style={{ margin: "24px auto 0", maxWidth: 720 }}>
            {withForm
              ? `Odgovori na četiri kratka pitanja. Javiću ti se na WhatsApp ${responseTime} da dogovorimo online poziv.`
              : "Cena i sve što je uključeno, na jednom mestu."}
          </p>
        </div>
        <div className={withForm ? "price-layout" : "price-layout price-layout--single"}>
          <div className="rv" style={rv(240, 24, 800)}>
            <PriceCard withCta={!withForm} />
          </div>
          {withForm && (
            <div id="prijava" className="rv" style={rv(120, 24, 800)}>
              <LeadForm size="section" />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- FAQ ---------------- */
export function FaqSection() {
  return (
    <section id="pitanja" className="section bg-sand">
      <div className="container faq-grid">
        <div className="faq-side">
          <h2 className="h2">Česta pitanja</h2>
          <p>
            Ne vidiš svoje pitanje? <a href="#prijava">Prijavi se</a> i pitaj me na online pozivu.
          </p>
        </div>
        <Faq items={faqs} />
      </div>
    </section>
  );
}

/* ---------------- Završna poruka ---------------- */
export function Final() {
  return (
    <Reveal as="section" className="section bg-green final">
      <div className="final-photo rv" style={rv(0, 24, 800)} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/olgica-zavrsna.webp" alt="" loading="lazy" decoding="async" width={1333} height={2000} />
      </div>
      <div className="container final-grid">
        <div className="final-copy">
          <p className="eyebrow rv" style={rv(100)}>
            {finalCta.eyebrow}
          </p>
          <h2 className="h2 rv" style={rv(180)}>
            {finalCta.title}
          </h2>
          <p className="lead rv" style={rv(260)}>
            {finalCta.text}
          </p>
          <p className="final-sig">{finalCta.signature}</p>
          <div className="rv" style={rv(700)}>
            <div className="final-buy">
              <span>{site.price} EUR</span>
              <CtaLink tone="light" location="zavrsna">
                Prijavi se za protokol
              </CtaLink>
            </div>
            <a href="#za-koga" className="final-link">
              Proveri da li je protokol za tebe
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a href="#" className="brand" aria-label="Olgica Božinović, početna">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-text">
              <span className="brand-name">{site.name}</span>
              <span className="brand-role">{site.role}</span>
            </span>
          </a>
          <nav className="footer-nav" aria-label="Linkovi u podnožju">
            <a href="#o-meni">O meni</a>
            <a href={safeHref(site.links.blog)}>Blog</a>
            <a href={safeHref(site.links.terms)}>Uslovi kupovine</a>
            <a href={safeHref(site.links.privacy)}>Politika privatnosti</a>
          </nav>
        </div>
        <div className="footer-text">
          <p>{footer.disclaimer}</p>
          <p>{footer.note}</p>
          <p className="copy">© {new Date().getFullYear()} Olgica Božinović. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
}
