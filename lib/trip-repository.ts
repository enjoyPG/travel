import "server-only";
import { osakaTrip } from "@/data/trips";
import type { TripDocument } from "@/data/trip-types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

type TripRow = { slug: string; document: TripDocument; published: boolean };

function schemaPending(error: { code?: string }) {
  return error.code === "42P01" || error.code === "PGRST205";
}

export async function listPublishedTrips(): Promise<TripDocument[]> {
  if (!isSupabaseConfigured()) return [osakaTrip];
  const { data, error } = await getSupabaseAdmin().from("trips").select("slug, document, published").eq("published", true);
  if (error && schemaPending(error)) return [osakaTrip];
  if (error) throw new Error(`여행 목록을 읽지 못했습니다: ${error.message}`);
  const records = (data ?? []) as TripRow[];
  return records.map((row) => ({ ...row.document, slug: row.slug, published: row.published }));
}

export async function getPublishedTrip(slug: string): Promise<TripDocument | undefined> {
  if (!isSupabaseConfigured()) return slug === osakaTrip.slug ? osakaTrip : undefined;
  const { data, error } = await getSupabaseAdmin().from("trips").select("slug, document, published").eq("slug", slug).maybeSingle();
  if (error && schemaPending(error)) return slug === osakaTrip.slug ? osakaTrip : undefined;
  if (error) throw new Error(`여행을 읽지 못했습니다: ${error.message}`);
  if (data) return data.published ? { ...(data.document as TripDocument), slug: data.slug, published: true } : undefined;
  return undefined;
}

export async function listAdminTrips(): Promise<TripDocument[]> {
  if (!isSupabaseConfigured()) return [osakaTrip];
  const { data, error } = await getSupabaseAdmin().from("trips").select("slug, document, published");
  if (error && schemaPending(error)) return [osakaTrip];
  if (error) throw new Error(`여행 목록을 읽지 못했습니다: ${error.message}`);
  const records = (data ?? []) as TripRow[];
  return records.map((row) => ({ ...row.document, slug: row.slug, published: row.published }));
}

export async function getAdminTrip(slug: string): Promise<TripDocument | undefined> {
  if (!isSupabaseConfigured()) return slug === osakaTrip.slug ? osakaTrip : undefined;
  const { data, error } = await getSupabaseAdmin().from("trips").select("slug, document, published").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`여행을 읽지 못했습니다: ${error.message}`);
  if (data) return { ...(data.document as TripDocument), slug: data.slug, published: data.published };
  return undefined;
}

export async function deleteTrip(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("저장소가 연결되지 않아 여행을 삭제할 수 없습니다.");
  const { error } = await getSupabaseAdmin().from("trips").delete().eq("slug", slug);
  if (error) throw new Error(`여행을 삭제하지 못했습니다: ${error.message}`);
}

export async function saveTrip(trip: TripDocument): Promise<void> {
  const { error } = await getSupabaseAdmin().from("trips").upsert({
    slug: trip.slug,
    document: trip,
    published: trip.published,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`여행을 저장하지 못했습니다: ${error.message}`);
}
