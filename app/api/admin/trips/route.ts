import { NextRequest } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-request";
import { getAdminTrip, saveTrip } from "@/lib/trip-repository";
import { parseTripDocument } from "@/lib/validate-trip";

export async function POST(request: NextRequest) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;
  try {
    const trip = parseTripDocument(await request.json());
    if (await getAdminTrip(trip.slug)) return Response.json({ error: "이미 사용 중인 여행 주소입니다." }, { status: 409 });
    await saveTrip(trip);
    return Response.json({ slug: trip.slug }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "여행을 만들지 못했습니다." }, { status: 400 });
  }
}
