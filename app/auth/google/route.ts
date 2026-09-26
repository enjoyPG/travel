import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSessionClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const loginPage = new URL("/admin/login", request.url);
  if (!isSupabaseConfigured() || process.env.GOOGLE_AUTH_ENABLED !== "true") {
    loginPage.searchParams.set("error", "google");
    return NextResponse.redirect(loginPage);
  }

  const supabase = await getSupabaseSessionClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL("/auth/callback", request.url).toString(),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    loginPage.searchParams.set("error", "google");
    return NextResponse.redirect(loginPage);
  }
  return NextResponse.redirect(data.url);
}
