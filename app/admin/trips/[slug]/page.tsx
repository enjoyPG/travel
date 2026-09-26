import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { TripEditor } from "@/components/TripEditor";
import { getAdminEmail } from "@/lib/supabase/server";
import { getAdminTrip } from "@/lib/trip-repository";

export const dynamic = "force-dynamic";

export default async function EditTripPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await getAdminEmail())) redirect("/admin/login");
  const { slug } = await params;
  const trip = await getAdminTrip(slug);
  if (!trip) notFound();
  return <>
    <SiteHeader />
    <main className="admin-shell page-wrap"><Link href="/admin" className="admin-back">← 여행 관리</Link><TripEditor initialTrip={trip} /></main>
  </>;
}
