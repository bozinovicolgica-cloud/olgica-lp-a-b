# Protokol ishrane: landing stranica sa A/B testom

Next.js 15 (App Router) + TypeScript. Obe verzije dizajna iz Claude Design-a prebačene su u kod,
sa responsive rasporedom za mobilni. Posetioci se dele 50/50 između dve verzije.

| Varijanta | Gde je forma |
|---|---|
| **A** | Hero bez forme. Forma je dole, u sekciji "Cena", pored kartice sa cenom. |
| **B** | Forma je odmah u hero delu, desno od naslova (na mobilnom ispod naslova). Sekcija "Cena" ima samo cenu i dugme koje vodi gore na formu. |

Sve ostalo (tekst, sekcije, slike, animacije) je isto, da test meri samo poziciju forme.

## Kako radi podela

- `middleware.ts` na Vercel edge-u, pre slanja stranice, nasumično dodeli varijantu (50/50) i zapamti je
  u cookie-ju `lp_ab` 90 dana. Isti čovek uvek vidi istu verziju, nema treptanja.
- Adresa je uvek `/`. Interno se prikazuje `/a` ili `/b`. Direktan ulaz na `/a` ili `/b` se preusmerava na `/`.
- Za proveru: `/?v=a` ili `/?v=b`. Takav posetilac se označava kao QA (`lp_qa` cookie, 7 dana) i ne ulazi u rezultate.
- Udeo i ime eksperimenta su u `lib/ab.ts` (`SPLIT_B`, `EXPERIMENT_ID`). Kad pokrećeš novi test, promeni `EXPERIMENT_ID`.

## Šta se meri

Tabela `lp_events` (po posetiocu i varijanti): `view`, `cta_click` (sa lokacijom dugmeta), `form_start`,
`form_step` (2, 3, 4) i `lead`. Prijave idu u `lp_leads` sa varijantom, UTM parametrima, fbclid itd.
View `lp_ab_results` daje posetioce, započete forme i konverziju po varijanti.

Rezultati sa statističkim testom: **`/ab-rezultati?key=AB_RESULTS_KEY`**.

Ako su podešeni Meta Pixel / GA4, `PageView` i `Lead` nose parametar `ab_variant`, pa se može porediti i u Ads Manageru.

## Puštanje (Vercel)

1. U Supabase SQL Editoru pokreni `supabase/schema.sql`.
2. Napravi projekat na Vercelu iz ovog foldera/repoa.
3. U Vercel > Settings > Environment Variables upiši vrednosti iz `.env.example`
   (obavezno `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AB_RESULTS_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy. Proveri `/?v=a` i `/?v=b`, pošalji probnu prijavu iz obe i proveri da je stigla u `lp_leads`.
5. Obriši probne redove (`delete from lp_leads where is_qa; delete from lp_events where is_qa;`) i pusti reklame na `/`.

Bez Supabase podešavanja, u produkciji forma vraća grešku umesto da tiho izgubi prijavu.
Lokalno (`npm run dev`) prijave i događaji se samo ispisuju u terminal.

## Lokalno

```
npm install
npm run dev
```

## Pre puštanja reklama: popuniti

Placeholderi iz dizajna su u `lib/content.ts` (i jedan u `components/LeadForm.tsx`):

- `[rok]` za odgovor na WhatsApp-u (forma, poruka posle prijave, FAQ "Koliko čekam na protokol?")
- `[Odgovor Olgice]` u FAQ: "Šta ako nemam skorije analize?", "Da li su suplementi i tinkture uključeni u cenu?", "Kada ću osetiti razliku?"
- `[uzrast]` u FAQ "Da li protokol može i za dete?"
- `Traje oko [2] minuta` ispod forme (varijanta A)
- Linkovi u podnožju i u saglasnosti: Blog, Uslovi kupovine, **Politika privatnosti** (obavezno, forma traži saglasnost za zdravstvene podatke)
- Video u hero delu: `NEXT_PUBLIC_HERO_VIDEO_URL` (bez njega video blok se ne prikazuje)

## Koliko dugo da test traje

Bar 2 nedelje (da uđu svi dani u nedelji) i dok svaka varijanta nema bar ~300 posetilaca i ~15 prijava.
Ne menjaj reklame, ciljanje ni sadržaj stranice dok test traje.

## Struktura

```
middleware.ts            podela 50/50 + cookie
lib/ab.ts                podešavanja testa
lib/content.ts           sav tekst stranice
components/Sections.tsx  sve sekcije
components/LeadForm.tsx  forma u 4 koraka (veličina "hero" za B, "section" za A)
app/api/lead             prijem prijave -> Supabase (+ opcioni webhook)
app/api/event            događaji za A/B
app/ab-rezultati         stranica sa rezultatima
supabase/schema.sql      tabele + view sa rezultatima
```
