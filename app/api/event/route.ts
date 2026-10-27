import { NextResponse, type NextRequest } from "next/server";
import { EVENT_NAMES, type EventName } from "@/lib/ab";
import { abContext } from "@/lib/server-context";
import { insertRow, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { event?: string; props?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = body.event as EventName;
  if (!EVENT_NAMES.includes(event) || event === "lead") {
    // "lead" upisuje isključivo /api/lead, posle uspešne prijave.
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ctx = abContext(req);
  if (!ctx.variant || !ctx.visitorId) return NextResponse.json({ ok: true, skipped: true });

  const props: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(body.props ?? {}).slice(0, 10)) {
    if (["string", "number", "boolean"].includes(typeof v)) props[k.slice(0, 40)] = typeof v === "string" ? v.slice(0, 120) : (v as number | boolean);
  }

  if (!supabaseConfigured) {
    if (process.env.NODE_ENV !== "production") console.log("[event]", ctx.variant, event, props);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    await insertRow("lp_events", {
      experiment: ctx.experiment,
      variant: ctx.variant,
      visitor_id: ctx.visitorId,
      event,
      props,
      is_qa: ctx.isQa,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ ok: true });
}
