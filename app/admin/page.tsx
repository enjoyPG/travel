import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminTripList } from "@/components/AdminTripList";
import { getAdminEmail } from "@/lib/supabase/server";
import { listAdminTrips } from "@/lib/trip-repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  const trips = await listAdminTrips();
  return <>
    <SiteHeader />
    <main className="admin-shell page-wrap">
      <Link href="/" className="admin-back">← 공개 여행 목록</Link>
      <div className="admin-intro"><span className="section-index">YOUR TRAVEL DESK</span><h1>여행 기록 관리</h1><p>{email} 계정으로 로그인했습니다. 여행을 선택해 일정과 기록을 수정하세요.</p></div>
      <div className="admin-toolbar"><h2>내 여행</h2><div><AdminLogoutButton /><Link href="/admin/trips/new" className="admin-primary-link">+ 새 여행 만들기</Link></div></div>
      <AdminTripList trips={trips} />
    </main>
  </>;
}
