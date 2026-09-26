import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSessionClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await getSupabaseSessionClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase());
      const email = data.user?.email?.toLowerCase();
      if (email && allowed.includes(email)) return NextResponse.redirect(new URL("/admin", request.url));
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login?error=account", request.url));
    }
  }
  return NextResponse.redirect(new URL("/admin/login?error=link", request.url));
}
