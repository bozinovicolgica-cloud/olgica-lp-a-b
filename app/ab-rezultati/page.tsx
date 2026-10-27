import type { Metadata } from "next";
import { EXPERIMENT_ID, VARIANT_LABELS, type Variant } from "@/lib/ab";
import { selectRows, supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "A/B rezultati", robots: { index: false, follow: false } };

type Row = {
  variant: Variant;
  posetioci: number;
  zapoceli_formu: number;
  stigli_do_kontakta: number;
  prijave: number;
  konverzija_pct: number | null;
  zapoceli_pct: number | null;
};

// Normalna raspodela (Abramowitz-Stegun aproksimacija), za p-vrednost.
function normCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

function zTest(a: Row, b: Row) {
  const n1 = a.posetioci, n2 = b.posetioci;
  if (!n1 || !n2) return null;
  const p1 = a.prijave / n1, p2 = b.prijave / n2;
  const p = (a.prijave + b.prijave) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  if (!se) return null;
  const z = (p2 - p1) / se;
  return { z, pValue: 2 * (1 - normCdf(Math.abs(z))), lift: p1 ? (p2 - p1) / p1 : null };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const wrap = (children: React.ReactNode) => (
    <main className="container" style={{ padding: "64px 0", fontFamily: "var(--sans)", color: "var(--ink)" }}>
      <h1 className="h2">A/B test: gde stoji forma</h1>
      <p style={{ marginTop: 8, color: "var(--text)" }}>Eksperiment: {EXPERIMENT_ID}</p>
      {children}
    </main>
  );

  if (!process.env.AB_RESULTS_KEY || key !== process.env.AB_RESULTS_KEY) return wrap(<p style={{ marginTop: 32 }}>Nemaš pristup. Dodaj ?key=... u adresu.</p>);
  if (!supabaseConfigured) return wrap(<p style={{ marginTop: 32 }}>Supabase nije podešen.</p>);

  const rows = await selectRows<Row>(`lp_ab_results?experiment=eq.${encodeURIComponent(EXPERIMENT_ID)}&select=*`);
  const a = rows.find((r) => r.variant === "a");
  const b = rows.find((r) => r.variant === "b");
  const test = a && b ? zTest(a, b) : null;
  const total = rows.reduce((s, r) => s + (r.prijave || 0), 0);

  let verdict = "Još nema podataka.";
  if (test) {
    const winner = test.z > 0 ? "B" : "A";
    if (total < 30 || (a!.posetioci < 300 || b!.posetioci < 300)) {
      verdict = "Prerano za zaključak. Sačekaj bar ~300 posetilaca i ~15 prijava po varijanti.";
    } else if (test.pValue < 0.05) {
      verdict = `Varijanta ${winner} je bolja i razlika je statistički značajna (p = ${test.pValue.toFixed(3)}).`;
    } else {
      verdict = `Za sada nema jasnog pobednika (p = ${test.pValue.toFixed(3)}). Pusti test da radi duže.`;
    }
  }

  const th: React.CSSProperties = { textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--line)", fontWeight: 600, fontSize: 14, color: "var(--text)" };
  const td: React.CSSProperties = { padding: "12px 16px", borderBottom: "1px solid var(--line)", fontSize: 16 };

  return wrap(
    <>
      <div style={{ marginTop: 32, padding: 24, borderRadius: 24, background: "var(--mint-bg)", border: "1px solid var(--sage-light)", fontSize: 18, fontWeight: 600 }}>
        {verdict}
        {test?.lift != null && <div style={{ marginTop: 8, fontWeight: 400, fontSize: 16 }}>Razlika u konverziji B u odnosu na A: {(test.lift * 100).toFixed(1)}%</div>}
      </div>
      <div style={{ marginTop: 32, overflowX: "auto", background: "#fff", borderRadius: 24, border: "1px solid var(--line)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr>
              <th style={th}>Varijanta</th>
              <th style={th}>Posetioci</th>
              <th style={th}>Započeli formu</th>
              <th style={th}>Stigli do kontakta</th>
              <th style={th}>Prijave</th>
              <th style={th}>Konverzija</th>
            </tr>
          </thead>
          <tbody>
            {(["a", "b"] as Variant[]).map((v) => {
              const r = rows.find((x) => x.variant === v);
              return (
                <tr key={v}>
                  <td style={td}>{VARIANT_LABELS[v]}</td>
                  <td style={td}>{r?.posetioci ?? 0}</td>
                  <td style={td}>{r?.zapoceli_formu ?? 0} {r?.zapoceli_pct != null && <span style={{ color: "var(--muted)" }}>({r.zapoceli_pct}%)</span>}</td>
                  <td style={td}>{r?.stigli_do_kontakta ?? 0}</td>
                  <td style={td}>{r?.prijave ?? 0}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r?.konverzija_pct ?? 0}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 16, fontSize: 14, color: "var(--muted)" }}>Ne računaju se posete sa ?v=a / ?v=b (QA) ni botovi. Posetilac = jedinstveni cookie.</p>
    </>
  );
}
