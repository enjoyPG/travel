import { NextRequest } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-request";
import { deleteTrip, getAdminTrip, saveTrip } from "@/lib/trip-repository";
import { parseTripDocument } from "@/lib/validate-trip";

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;
  const { slug } = await context.params;
  try {
    const trip = parseTripDocument(await request.json());
    if (trip.slug !== slug) return Response.json({ error: "여행 주소는 편집 중에 바꿀 수 없습니다." }, { status: 400 });
    if (!(await getAdminTrip(slug))) return Response.json({ error: "여행을 찾을 수 없습니다." }, { status: 404 });
    await saveTrip(trip);
    return Response.json({ slug });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "여행을 저장하지 못했습니다." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;
  const { slug } = await context.params;
  try {
    if (!(await getAdminTrip(slug))) return Response.json({ error: "여행을 찾을 수 없습니다." }, { status: 404 });
    await deleteTrip(slug);
    return Response.json({ slug, deleted: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "여행을 삭제하지 못했습니다." }, { status: 500 });
  }
}
