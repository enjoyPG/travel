import { NextRequest } from "next/server";
import { getSupabaseSessionClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!isSupabaseConfigured()) return Response.json({ error: "로그인 연결이 준비되지 않았습니다." }, { status: 503 });
  const supabase = await getSupabaseSessionClient();
  await supabase.auth.signOut();
  return Response.json({ ok: true });
}
