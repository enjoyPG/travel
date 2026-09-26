import type { NextRequest } from "next/server";
import { getAdminEmail } from "@/lib/supabase/server";

export async function authorizeAdminRequest(request: NextRequest): Promise<Response | null> {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdminEmail())) return Response.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  return null;
}
