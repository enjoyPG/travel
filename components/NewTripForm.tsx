"use client";

import { useState, type FormEvent } from "react";
import { createTripDraft } from "@/data/create-trip";

export function NewTripForm() {
  const [fields, setFields] = useState({ slug: "", country: "", city: "", title: "", description: "", startDate: "", endDate: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function change(key: keyof typeof fields, value: string) { setFields((current) => ({ ...current, [key]: value })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const trip = createTripDraft({
        ...fields,
        image: "/images/trip-placeholder.svg",
        imageAlt: `${fields.city} 여행 대표 사진`,
      });
      const response = await fetch("/api/admin/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(trip) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "여행을 만들지 못했습니다.");
      window.location.assign(`/admin/trips/${trip.slug}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "여행을 만들지 못했습니다.");
      setBusy(false);
    }
  }

  return <form className="admin-panel admin-grid-form" onSubmit={submit}>
    <div className="admin-field"><label htmlFor="trip-title">여행 제목</label><input id="trip-title" value={fields.title} onChange={(event) => change("title", event.target.value)} required maxLength={100} placeholder="예: 도쿄의 작은 장면들" /></div>
    <div className="admin-field"><label htmlFor="trip-slug">여행 주소</label><input id="trip-slug" value={fields.slug} onChange={(event) => change("slug", event.target.value.toLowerCase())} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="예: tokyo-2027" /><small>영문 소문자·숫자·하이픈만 사용합니다.</small></div>
    <div className="admin-field"><label htmlFor="trip-country">나라</label><input id="trip-country" value={fields.country} onChange={(event) => change("country", event.target.value)} required placeholder="예: JAPAN" /></div>
    <div className="admin-field"><label htmlFor="trip-city">도시</label><input id="trip-city" value={fields.city} onChange={(event) => change("city", event.target.value)} required placeholder="예: TOKYO" /></div>
    <div className="admin-field"><label htmlFor="trip-start">출발일</label><input id="trip-start" type="date" value={fields.startDate} onChange={(event) => change("startDate", event.target.value)} required /></div>
    <div className="admin-field"><label htmlFor="trip-end">마지막 날</label><input id="trip-end" type="date" min={fields.startDate || undefined} value={fields.endDate} onChange={(event) => change("endDate", event.target.value)} required /></div>
    <div className="admin-field admin-field-wide"><label htmlFor="trip-description">한 줄 소개</label><input id="trip-description" value={fields.description} onChange={(event) => change("description", event.target.value)} maxLength={250} placeholder="사진 카드 아래에 보일 소개" /></div>
    <div className="admin-form-actions"><p>초안으로 저장합니다. 날짜별 일정은 자동으로 만들어지고, 대표 사진을 올린 뒤 공개할 수 있습니다.</p><button type="submit" disabled={busy}>{busy ? "만드는 중…" : "여행 초안 만들기"}</button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </form>;
}
