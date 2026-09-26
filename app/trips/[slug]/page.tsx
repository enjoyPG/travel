import { notFound } from "next/navigation";
import { TripDetail } from "@/components/TripDetail";
import { getPublishedTrip } from "@/lib/trip-repository";

export const dynamic = "force-dynamic";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getPublishedTrip(slug);
  if (!trip) notFound();
  return <TripDetail trip={trip} />;
}
