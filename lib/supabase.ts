// Minimalan Supabase REST klijent za server (bez dodatnih paketa).
// Koristi service role ključ, zato se poziva SAMO iz API ruta, nikad iz browsera.

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && key);

function headers(extra: Record<string, string> = {}) {
  return {
    apikey: key as string,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  if (!supabaseConfigured) throw new Error("Supabase nije podešen (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase insert u ${table} nije uspeo: ${res.status} ${text.slice(0, 300)}`);
  }
}

export async function selectRows<T>(pathAndQuery: string): Promise<T[]> {
  if (!supabaseConfigured) throw new Error("Supabase nije podešen.");
  const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`Supabase select nije uspeo: ${res.status} ${await res.text().catch(() => "")}`);
  return (await res.json()) as T[];
}
