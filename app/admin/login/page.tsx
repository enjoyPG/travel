import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminEmail, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminEmail()) redirect("/admin");
  const { error } = await searchParams;
  const ready = isSupabaseConfigured() && Boolean(process.env.ADMIN_EMAILS);
  const googleReady = ready && process.env.GOOGLE_AUTH_ENABLED === "true";
  const errorMessage = error === "account"
    ? "관리자로 등록된 Google 계정으로 로그인해 주세요."
    : error === "google"
      ? "Google 로그인 연결을 완료하지 못했습니다. 다시 시도하거나 이메일 링크를 이용해 주세요."
      : error
        ? "로그인 링크가 만료되었거나 올바르지 않습니다. 다시 요청해 주세요."
        : null;
  return <>
    <SiteHeader />
    <main className="admin-shell page-wrap">
      <Link href="/" className="admin-back">← 여행 목록</Link>
      <div className="admin-intro"><span className="section-index">YOUR TRAVEL DESK</span><h1>여행 기록 관리</h1><p>일정과 메모, 사진을 이곳에서 정리합니다.</p></div>
      {ready ? <div className="admin-panel">
        <h2>관리자 로그인</h2>
        <p>{googleReady ? "등록된 Google 계정으로 간편하게 로그인하세요." : "등록된 이메일로 보내는 링크를 눌러 로그인하세요."}</p>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        {googleReady ? <>
          <Link href="/auth/google" className="google-login-button"><span aria-hidden="true">G</span> Google로 계속하기</Link>
          <details className="admin-login-fallback"><summary>이메일 링크로 로그인</summary><AdminLoginForm /></details>
        </> : <AdminLoginForm />}
      </div> : <div className="admin-panel"><h2>저장소 연결 대기 중</h2><p>Vercel의 Supabase 연동과 관리자 이메일 설정이 완료되면 로그인할 수 있습니다.</p></div>}
    </main>
  </>;
}
