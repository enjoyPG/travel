import { NextRequest } from "next/server";
import { getSupabasePublic, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !process.env.ADMIN_EMAILS) {
    return Response.json({ error: "관리자 로그인이 아직 연결되지 않았습니다." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const allowed = process.env.ADMIN_EMAILS.split(",").map((item) => item.trim().toLowerCase());
  if (!email || !allowed.includes(email)) {
    return Response.json({ message: "허용된 계정이라면 로그인 링크를 보냈습니다." });
  }
  const { error } = await getSupabasePublic().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: new URL("/auth/callback", process.env.SITE_URL ?? request.nextUrl.origin).toString(),
      shouldCreateUser: true,
    },
  });
  if (error) return Response.json({ error: "로그인 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  return Response.json({ message: "로그인 링크를 보냈습니다. 메일함을 확인해 주세요." });
}
