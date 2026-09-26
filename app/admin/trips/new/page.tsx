import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { NewTripForm } from "@/components/NewTripForm";
import { getAdminEmail } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");
  return <>
    <SiteHeader />
    <main className="admin-shell page-wrap">
      <Link href="/admin" className="admin-back">← 여행 관리</Link>
      <div className="admin-intro"><span className="section-index">A NEW STORY</span><h1>새 여행 만들기</h1><p>기본 정보를 적으면 여행 날짜가 자동으로 준비됩니다.</p></div>
      <NewTripForm />
    </main>
  </>;
}
