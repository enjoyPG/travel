import { NextRequest } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const mimeToExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("photo");
  const slug = form.get("slug");
  if (!(file instanceof File) || typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return Response.json({ error: "사진 또는 여행 주소가 올바르지 않습니다." }, { status: 400 });
  }
  const extension = mimeToExtension[file.type];
  if (!extension || file.size === 0 || file.size > 6 * 1024 * 1024) {
    return Response.json({ error: "JPG, PNG, WebP 사진을 6MB 이하로 올려 주세요." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const path = `${slug}/${id}.${extension}`;
  const storage = getSupabaseAdmin().storage.from("trip-photos");
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false });
  if (error) return Response.json({ error: "사진을 업로드하지 못했습니다. 저장소 설정을 확인해 주세요." }, { status: 502 });
  const { data } = storage.getPublicUrl(path);
  return Response.json({ id, url: data.publicUrl, alt: file.name.replace(/\.[^.]+$/, "") });
}
