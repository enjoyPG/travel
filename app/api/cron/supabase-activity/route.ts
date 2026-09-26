import "server-only";
import { getSupabasePublic, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = getSupabasePublic();
  for (let requestNumber = 0; requestNumber < 3; requestNumber += 1) {
    const { error } = await supabase.from("trips").select("slug", { count: "exact", head: true });
    if (error) {
      return Response.json({ ok: false, error: "Database read failed" }, { status: 503 });
    }
  }

  return Response.json({ ok: true, reads: 3 }, { headers: { "Cache-Control": "no-store" } });
}
