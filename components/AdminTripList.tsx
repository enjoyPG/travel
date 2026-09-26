"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TripDocument } from "@/data/trip-types";

export function AdminTripList({ trips }: { trips: TripDocument[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function removeTrip(trip: TripDocument) {
    const accepted = window.confirm(`“${trip.title}” 여행 기록을 삭제할까요? 공개 중인 여행 페이지도 사라지며, 삭제 후 되돌릴 수 없습니다.`);
    if (!accepted) return;

    setError("");
    setDeleting(trip.slug);
    try {
      const response = await fetch(`/api/admin/trips/${trip.slug}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "여행을 삭제하지 못했습니다.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "여행을 삭제하지 못했습니다.");
    } finally {
      setDeleting(null);
    }
  }

  return <>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="admin-trip-list">
      {trips.length === 0 && <p className="admin-trip-empty">아직 등록된 여행 기록이 없습니다.</p>}
      {trips.map((trip) => <article className="admin-trip-row" key={trip.slug}>
        <Link href={`/admin/trips/${trip.slug}`} className="admin-trip-open">
          <span className="admin-trip-status">{trip.published ? "공개 중" : "초안"}</span>
          <strong>{trip.title}</strong>
          <small>{trip.dateLabel} · {trip.city}</small>
          <span aria-hidden="true">↗</span>
        </Link>
        <button type="button" className="admin-trip-delete" onClick={() => removeTrip(trip)} disabled={deleting !== null}>
          {deleting === trip.slug ? "삭제 중…" : "삭제"}
        </button>
      </article>)}
    </div>
  </>;
}
