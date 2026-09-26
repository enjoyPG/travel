import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function connection() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, publicKey, secretKey };
}

export function isSupabaseConfigured() {
  const { url, publicKey, secretKey } = connection();
  return Boolean(url && publicKey && secretKey);
}

export function getSupabaseAdmin() {
  const { url, secretKey } = connection();
  if (!url || !secretKey) throw new Error("Supabase 저장소가 아직 연결되지 않았습니다.");
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function getSupabasePublic() {
  const { url, publicKey } = connection();
  if (!url || !publicKey) throw new Error("Supabase 공개 키가 설정되지 않았습니다.");
  return createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function getSupabaseSessionClient() {
  const { url, publicKey } = connection();
  if (!url || !publicKey) throw new Error("Supabase 인증이 설정되지 않았습니다.");
  const cookieStore = await cookies();
  return createServerClient(url, publicKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(items) {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components cannot write cookies; proxy refreshes them. */ }
      },
    },
  });
}

export async function getAdminEmail() {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!isSupabaseConfigured() || allowed.length === 0) return null;
  const supabase = await getSupabaseSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  const email = data.user.email.toLowerCase();
  return allowed.includes(email) ? email : null;
}
