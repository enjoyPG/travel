"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { BookingKind, TripActivity, TripBookingHighlight, TripDocument, TripItineraryDay, TripPhoto, TripQuickInfo } from "@/data/trip-types";
import type { TripTransportGuide, TripTransportGuideLine } from "@/data/trip-types";
import type { TripFoodGuide, TripFoodDish } from "@/data/trip-types";
import { defaultOsakaTransportGuide } from "@/data/osaka-transport-guide";
import { defaultOsakaFoodGuide } from "@/data/osaka-food-guide";
import { getTransportPayment } from "@/lib/transport-payment";

function PhotoInputs({ photos, onUpload, onRemove, onUpdate, busy }: { photos: TripPhoto[]; onUpload: (files: FileList) => void; onRemove: (id: string) => void; onUpdate: (id: string, patch: Partial<TripPhoto>) => void; busy: boolean }) {
  return <div className="editor-photos">
    {photos.length > 0 && <div className="editor-photo-list">{photos.map((photo) => <figure key={photo.id}><img src={photo.url} alt={photo.alt} /><button type="button" onClick={() => onRemove(photo.id)} aria-label={`${photo.alt} 사진 제거`}>×</button><div className="editor-photo-fields"><input aria-label="사진 대체 텍스트" value={photo.alt} onChange={(event) => onUpdate(photo.id, { alt: event.target.value })} placeholder="사진 설명" /><input aria-label="사진 캡션" value={photo.caption ?? ""} onChange={(event) => onUpdate(photo.id, { caption: event.target.value })} placeholder="사진 아래 문구" /></div></figure>)}</div>}
    <label className="editor-upload">{busy ? "사진 올리는 중…" : "+ 사진 추가"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => { if (event.target.files?.length) onUpload(event.target.files); event.target.value = ""; }} /></label>
    <small>JPG·PNG·WebP, 한 장당 6MB 이하. 저장한 사진은 방문자에게 공개됩니다.</small>
  </div>;
}

const routeColors = ["red", "purple", "blue", "green", "pink", "brown", "lime", "orange", "teal"];

function TransportGuideEditor({ guide, onChange }: { guide: TripTransportGuide; onChange: (guide: TripTransportGuide) => void }) {
  function update(patch: Partial<TripTransportGuide>) { onChange({ ...guide, ...patch }); }
  function updateRule(index: number, patch: Partial<TripTransportGuide["rules"][number]>) { update({ rules: guide.rules.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function updateGroup(index: number, patch: Partial<TripTransportGuide["groups"][number]>) { update({ groups: guide.groups.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function updateLine(groupIndex: number, lineIndex: number, patch: Partial<TripTransportGuideLine>) {
    update({ groups: guide.groups.map((group, index) => index === groupIndex ? { ...group, lines: group.lines.map((line, row) => row === lineIndex ? { ...line, ...patch } : line) } : group) });
  }
  function updateStep(index: number, patch: Partial<TripTransportGuide["howtoSteps"][number]>) { update({ howtoSteps: guide.howtoSteps.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function updateNote(index: number, patch: Partial<TripTransportGuide["notes"][number]>) { update({ notes: guide.notes.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function updateLink(index: number, patch: Partial<TripTransportGuide["links"][number]>) { update({ links: guide.links.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }

  return <section className="admin-panel editor-section" aria-labelledby="editor-transport-guide">
    <div className="editor-section-heading"><span className="section-index">06 / PASS &amp; TRAINS</span><h2 id="editor-transport-guide">교통·패스 안내</h2><p>공개 일정 아래에 표시되는 노선표, 환승 안내, 링크를 모두 수정할 수 있습니다. 줄바꿈은 입력 칸에서도 그대로 보여요.</p></div>
    <div className="admin-grid-form">
      <div className="admin-field"><label htmlFor="guide-title">안내 제목</label><input id="guide-title" value={guide.title} onChange={(event) => update({ title: event.target.value })} /></div>
      <div className="admin-field admin-field-wide"><label htmlFor="guide-intro">짧은 소개</label><textarea id="guide-intro" rows={2} value={guide.intro} onChange={(event) => update({ intro: event.target.value })} /></div>
    </div>

    <div className="editor-guide-subsection"><h3>결제 방법 카드</h3>
      {guide.rules.map((rule, index) => <div className="editor-guide-row" key={index}>
        <input aria-label="결제 카드 표시" value={rule.badge} onChange={(event) => updateRule(index, { badge: event.target.value })} placeholder="QR" />
        <input aria-label="결제 카드 제목" value={rule.title} onChange={(event) => updateRule(index, { title: event.target.value })} placeholder="카드 제목" />
        <textarea aria-label="결제 카드 설명" rows={2} value={rule.body} onChange={(event) => updateRule(index, { body: event.target.value })} placeholder="설명" />
        <button type="button" onClick={() => update({ rules: guide.rules.filter((_, itemIndex) => itemIndex !== index) })}>제거</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ rules: [...guide.rules, { badge: "", title: "", body: "" }] })}>+ 결제 안내 추가</button>
    </div>

    <div className="editor-guide-subsection"><h3>노선표</h3>
      {guide.groups.map((group, groupIndex) => <div className="editor-guide-group" key={groupIndex}>
        <div className="editor-guide-group-heading"><input aria-label="노선 그룹 제목" value={group.title} onChange={(event) => updateGroup(groupIndex, { title: event.target.value })} /><button type="button" onClick={() => update({ groups: guide.groups.filter((_, index) => index !== groupIndex) })}>그룹 삭제</button></div>
        {group.lines.map((line, lineIndex) => <div className="editor-guide-line" key={`${groupIndex}-${lineIndex}`}>
          <input aria-label="노선 기호" value={line.code} onChange={(event) => updateLine(groupIndex, lineIndex, { code: event.target.value })} placeholder="M" />
          <input aria-label="노선명" value={line.name} onChange={(event) => updateLine(groupIndex, lineIndex, { name: event.target.value })} placeholder="노선명" />
          <input aria-label="철도 회사" value={line.company} onChange={(event) => updateLine(groupIndex, lineIndex, { company: event.target.value })} placeholder="회사" />
          <select aria-label="노선 색상" value={line.color} onChange={(event) => updateLine(groupIndex, lineIndex, { color: event.target.value })}>{routeColors.map((color) => <option key={color} value={color}>{({ red: "빨강", purple: "보라", blue: "파랑", green: "초록", pink: "분홍", brown: "갈색", lime: "연두", orange: "주황", teal: "청록" } as Record<string, string>)[color]}</option>)}</select>
          <select aria-label="주유패스 사용 가능 여부" value={line.passIncluded ? "yes" : "no"} onChange={(event) => updateLine(groupIndex, lineIndex, { passIncluded: event.target.value === "yes" })}><option value="yes">패스 가능</option><option value="no">패스 불가</option></select>
          <input aria-label="결제 방법" value={line.payment} onChange={(event) => updateLine(groupIndex, lineIndex, { payment: event.target.value })} placeholder="결제 방법" />
          <button type="button" onClick={() => updateGroup(groupIndex, { lines: group.lines.filter((_, index) => index !== lineIndex) })}>삭제</button>
        </div>)}
        <button className="editor-subtle-button" type="button" onClick={() => updateGroup(groupIndex, { lines: [...group.lines, { code: "", name: "", company: "", color: "teal", passIncluded: false, payment: "ICOCA·승차권" }] })}>+ 노선 추가</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ groups: [...guide.groups, { title: "새 노선 그룹", lines: [] }] })}>+ 노선 그룹 추가</button>
    </div>

    <div className="editor-guide-subsection"><h3>타는 법과 환승 순서</h3>
      <div className="admin-field"><label htmlFor="guide-howto-title">소제목</label><input id="guide-howto-title" value={guide.howtoTitle} onChange={(event) => update({ howtoTitle: event.target.value })} /></div>
      {guide.howtoSteps.map((step, index) => <div className="editor-guide-step" key={index}>
        <input aria-label="환승 안내 제목" value={step.title} onChange={(event) => updateStep(index, { title: event.target.value })} placeholder="단계 제목" />
        <textarea aria-label="환승 안내 내용" rows={3} value={step.body} onChange={(event) => updateStep(index, { body: event.target.value })} placeholder="설명" />
        <button type="button" onClick={() => update({ howtoSteps: guide.howtoSteps.filter((_, itemIndex) => itemIndex !== index) })}>삭제</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ howtoSteps: [...guide.howtoSteps, { title: "", body: "" }] })}>+ 환승 안내 추가</button>
    </div>

    <div className="editor-guide-subsection"><h3>추가 안내 문구</h3>
      {guide.notes.map((note, index) => <div className="editor-guide-step" key={index}>
        <input aria-label="추가 안내 제목" value={note.title} onChange={(event) => updateNote(index, { title: event.target.value })} placeholder="소제목" />
        <textarea aria-label="추가 안내 내용" rows={3} value={note.body} onChange={(event) => updateNote(index, { body: event.target.value })} placeholder="설명" />
        <button type="button" onClick={() => update({ notes: guide.notes.filter((_, itemIndex) => itemIndex !== index) })}>삭제</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ notes: [...guide.notes, { title: "", body: "" }] })}>+ 안내 문구 추가</button>
    </div>

    <div className="editor-guide-subsection"><h3>관련 링크</h3>
      {guide.links.map((link, index) => <div className="editor-guide-link" key={index}>
        <input aria-label="링크 이름" value={link.label} onChange={(event) => updateLink(index, { label: event.target.value })} placeholder="링크 이름" />
        <input aria-label="링크 주소" type="url" value={link.url} onChange={(event) => updateLink(index, { url: event.target.value })} placeholder="https://" />
        <button type="button" onClick={() => update({ links: guide.links.filter((_, itemIndex) => itemIndex !== index) })}>삭제</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ links: [...guide.links, { label: "", url: "" }] })}>+ 링크 추가</button>
    </div>
  </section>;
}

function FoodGuideEditor({ guide, onChange }: { guide: TripFoodGuide; onChange: (guide: TripFoodGuide) => void }) {
  function update(patch: Partial<TripFoodGuide>) { onChange({ ...guide, ...patch }); }
  function updateCategory(index: number, patch: Partial<TripFoodGuide["categories"][number]>) { update({ categories: guide.categories.map((category, categoryIndex) => categoryIndex === index ? { ...category, ...patch } : category) }); }
  function updateDish(categoryIndex: number, dishIndex: number, patch: Partial<TripFoodDish>) {
    update({ categories: guide.categories.map((category, index) => index === categoryIndex ? { ...category, dishes: category.dishes.map((dish, row) => row === dishIndex ? { ...dish, ...patch } : dish) } : category) });
  }
  function updateLink(index: number, patch: Partial<TripFoodGuide["links"][number]>) { update({ links: guide.links.map((link, linkIndex) => linkIndex === index ? { ...link, ...patch } : link) }); }

  return <section className="admin-panel editor-section" aria-labelledby="editor-food-guide">
    <div className="editor-section-heading"><span className="section-index">05 / FOOD CULTURE</span><h2 id="editor-food-guide">오사카 음식 가이드</h2><p>공개 화면의 음식 탭에 보이는 소개·분류·21개 음식 설명과 참고 링크를 수정할 수 있습니다.</p></div>
    <div className="admin-grid-form">
      <div className="admin-field"><label htmlFor="food-guide-title">가이드 제목</label><input id="food-guide-title" value={guide.title} onChange={(event) => update({ title: event.target.value })} /></div>
      <div className="admin-field admin-field-wide"><label htmlFor="food-guide-intro">소개 문구</label><textarea id="food-guide-intro" rows={3} value={guide.intro} onChange={(event) => update({ intro: event.target.value })} /></div>
    </div>
    <div className="editor-guide-subsection"><h3>음식 분류와 카드</h3>
      {guide.categories.map((category, categoryIndex) => <div className="editor-food-category" key={`${category.title}-${categoryIndex}`}>
        <div className="editor-guide-group-heading"><input aria-label="음식 분류 제목" value={category.title} onChange={(event) => updateCategory(categoryIndex, { title: event.target.value })} /><button type="button" onClick={() => update({ categories: guide.categories.filter((_, index) => index !== categoryIndex) })}>분류 삭제</button></div>
        <div className="admin-field"><label htmlFor={`food-category-intro-${categoryIndex}`}>분류 소개</label><textarea id={`food-category-intro-${categoryIndex}`} rows={2} value={category.intro} onChange={(event) => updateCategory(categoryIndex, { intro: event.target.value })} /></div>
        {category.dishes.map((dish, dishIndex) => <div className="editor-food-dish" key={`${dish.name}-${dishIndex}`}>
          <input aria-label={`${dish.name} 한국어 이름`} value={dish.name} onChange={(event) => updateDish(categoryIndex, dishIndex, { name: event.target.value })} placeholder="한국어 이름" />
          <input aria-label={`${dish.name} 일본어 이름`} value={dish.japanese} onChange={(event) => updateDish(categoryIndex, dishIndex, { japanese: event.target.value })} placeholder="일본어 표기" />
          <textarea aria-label={`${dish.name} 설명`} rows={2} value={dish.description} onChange={(event) => updateDish(categoryIndex, dishIndex, { description: event.target.value })} placeholder="음식 설명" />
          <button type="button" onClick={() => updateCategory(categoryIndex, { dishes: category.dishes.filter((_, index) => index !== dishIndex) })}>삭제</button>
        </div>)}
        <button className="editor-subtle-button" type="button" onClick={() => updateCategory(categoryIndex, { dishes: [...category.dishes, { name: "", japanese: "", description: "" }] })}>+ 음식 추가</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ categories: [...guide.categories, { title: "새 분류", intro: "", dishes: [] }] })}>+ 음식 분류 추가</button>
    </div>
    <div className="editor-guide-subsection"><h3>참고 링크</h3>
      {guide.links.map((link, index) => <div className="editor-guide-link" key={`${link.label}-${index}`}>
        <input aria-label="음식 참고 링크 이름" value={link.label} onChange={(event) => updateLink(index, { label: event.target.value })} placeholder="링크 이름" />
        <input aria-label="음식 참고 링크 주소" type="url" value={link.url} onChange={(event) => updateLink(index, { url: event.target.value })} placeholder="https://" />
        <button type="button" onClick={() => update({ links: guide.links.filter((_, linkIndex) => linkIndex !== index) })}>삭제</button>
      </div>)}
      <button className="editor-subtle-button" type="button" onClick={() => update({ links: [...guide.links, { label: "", url: "" }] })}>+ 참고 링크 추가</button>
    </div>
  </section>;
}

export function TripEditor({ initialTrip }: { initialTrip: TripDocument }) {
  const [trip, setTrip] = useState<TripDocument>(() => ({
    ...initialTrip,
    transportGuide: initialTrip.transportGuide ?? (initialTrip.slug === "osaka-2026" ? defaultOsakaTransportGuide : undefined),
    foodGuide: initialTrip.foodGuide ?? (initialTrip.slug === "osaka-2026" ? defaultOsakaFoodGuide : undefined),
    days: initialTrip.days.map((day) => ({
      ...day,
      activities: day.activities.map((activity, index) => ({ ...activity, id: activity.id ?? `${day.id}-${index}` })),
    })),
  }));
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const day = trip.days[activeIndex];

  function updateTrip(patch: Partial<TripDocument>) { setTrip((current) => ({ ...current, ...patch })); setMessage(""); }
  function updateDay(patch: Partial<TripItineraryDay>) { setTrip((current) => ({ ...current, days: current.days.map((item, index) => index === activeIndex ? { ...item, ...patch } : item) })); setMessage(""); }
  function updateActivity(id: string, patch: Partial<TripActivity>) {
    setTrip((current) => ({ ...current, days: current.days.map((item, index) => index === activeIndex ? { ...item, activities: item.activities.map((activity) => activity.id === id ? { ...activity, ...patch } : activity) } : item) }));
    setMessage("");
  }
  function addActivity() {
    updateDay({ activities: [...day.activities, { id: crypto.randomUUID(), time: "", title: "새 활동", description: "" }] });
  }
  function removeActivity(id: string) { updateDay({ activities: day.activities.filter((item) => item.id !== id) }); }
  function moveActivity(index: number, direction: -1 | 1) {
    const next = [...day.activities];
    const other = index + direction;
    if (other < 0 || other >= next.length) return;
    [next[index], next[other]] = [next[other], next[index]];
    updateDay({ activities: next });
  }

  async function upload(files: FileList, target: { kind: "cover" } | { kind: "day" } | { kind: "activity"; id: string }) {
    setUploading(true);
    setMessage("");
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("slug", trip.slug);
        form.set("photo", file);
        const response = await fetch("/api/admin/photos", { method: "POST", body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "사진 업로드에 실패했습니다.");
        const photo = result as TripPhoto;
        if (target.kind === "cover") setTrip((current) => ({ ...current, image: photo.url, imageAlt: photo.alt }));
        if (target.kind === "day") setTrip((current) => ({ ...current, days: current.days.map((item, index) => index === activeIndex ? { ...item, photos: [...(item.photos ?? []), photo] } : item) }));
        if (target.kind === "activity") setTrip((current) => ({ ...current, days: current.days.map((item, index) => index === activeIndex ? { ...item, activities: item.activities.map((activity) => activity.id === target.id ? { ...activity, photos: [...(activity.photos ?? []), photo] } : activity) } : item) }));
      }
      setMessage("사진을 올렸습니다. 공개 페이지에 반영하려면 여행을 저장해 주세요.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "사진 업로드에 실패했습니다.");
    } finally { setUploading(false); }
  }

  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/trips/${trip.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(trip) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "저장하지 못했습니다.");
      setMessage("저장했습니다. 공개 중인 여행은 방문자 화면에도 바로 반영됩니다.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "저장하지 못했습니다."); }
    finally { setBusy(false); }
  }

  function updateQuickInfo(index: number, patch: Partial<TripQuickInfo>) { updateTrip({ quickInfo: trip.quickInfo.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function updateBooking(index: number, patch: Partial<TripBookingHighlight>) { updateTrip({ bookingHighlights: trip.bookingHighlights.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }); }
  function fileChange(event: ChangeEvent<HTMLInputElement>) { if (event.target.files?.length) upload(event.target.files, { kind: "cover" }); event.target.value = ""; }

  return <div className="trip-editor">
    <div className="editor-toolbar"><div><span className="section-index">EDITING / {trip.slug}</span><h1>{trip.title}</h1><p>{trip.startDate} — {trip.endDate}</p></div><div className="editor-toolbar-actions"><label className="editor-publish"><input type="checkbox" checked={trip.published} onChange={(event) => updateTrip({ published: event.target.checked })} /> 방문자에게 공개</label><button type="button" onClick={save} disabled={busy || uploading}>{busy ? "저장 중…" : "변경사항 저장"}</button></div></div>
    {message && <p className="editor-status" role="status">{message}</p>}

    <section className="admin-panel editor-section" aria-labelledby="editor-overview"><div className="editor-section-heading"><span className="section-index">01 / OVERVIEW</span><h2 id="editor-overview">여행 기본 정보</h2></div>
      <div className="admin-grid-form">
        <div className="admin-field"><label htmlFor="edit-title">여행 제목</label><input id="edit-title" value={trip.title} onChange={(event) => updateTrip({ title: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-hero">표지 문구</label><textarea id="edit-hero" rows={2} value={trip.heroTitle.join("\n")} onChange={(event) => updateTrip({ heroTitle: event.target.value.split("\n").slice(0, 3) })} /><small>줄바꿈으로 두 줄까지 나눌 수 있습니다.</small></div>
        <div className="admin-field"><label htmlFor="edit-country">나라</label><input id="edit-country" value={trip.country} onChange={(event) => updateTrip({ country: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-city">도시</label><input id="edit-city" value={trip.city} onChange={(event) => updateTrip({ city: event.target.value })} /></div>
        <div className="admin-field admin-field-wide"><label htmlFor="edit-description">카드 소개</label><input id="edit-description" value={trip.description} onChange={(event) => updateTrip({ description: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-start-date">여행 시작일</label><input id="edit-start-date" type="date" value={trip.startDate} onChange={(event) => updateTrip({ startDate: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-end-date">여행 종료일</label><input id="edit-end-date" type="date" value={trip.endDate} onChange={(event) => updateTrip({ endDate: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-date-label">화면에 보일 기간</label><input id="edit-date-label" value={trip.dateLabel} onChange={(event) => updateTrip({ dateLabel: event.target.value })} /></div>
        <div className="admin-field"><label htmlFor="edit-duration">며칠 여행인가요?</label><input id="edit-duration" value={trip.durationLabel} onChange={(event) => updateTrip({ durationLabel: event.target.value })} /></div>
      </div>
      <div className="editor-cover"><img src={trip.image} alt={trip.imageAlt} /><div><strong>대표 사진</strong><p>홈의 큰 카드와 여행 상단에 사용됩니다.</p><label className="editor-upload">{uploading ? "올리는 중…" : "대표 사진 올리기"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={fileChange} /></label></div></div>
      <div className="admin-field editor-image-alt"><label htmlFor="edit-image-alt">대표 사진 설명</label><input id="edit-image-alt" value={trip.imageAlt} onChange={(event) => updateTrip({ imageAlt: event.target.value })} /></div>
    </section>

    <section className="admin-panel editor-section" aria-labelledby="editor-quick"><div className="editor-section-heading"><span className="section-index">02 / AT A GLANCE</span><h2 id="editor-quick">여행 핵심 정보</h2></div>
      {trip.quickInfo.map((item, index) => <div className="editor-inline-fields" key={index}><input aria-label={`${index + 1}번 정보 구분`} value={item.label} onChange={(event) => updateQuickInfo(index, { label: event.target.value })} placeholder="구분 예: FLIGHT" /><input aria-label={`${index + 1}번 정보 제목`} value={item.value} onChange={(event) => updateQuickInfo(index, { value: event.target.value })} placeholder="제목" /><input aria-label={`${index + 1}번 정보 설명`} value={item.detail} onChange={(event) => updateQuickInfo(index, { detail: event.target.value })} placeholder="간단한 설명" /><button type="button" onClick={() => updateTrip({ quickInfo: trip.quickInfo.filter((_, itemIndex) => itemIndex !== index) })}>제거</button></div>)}
      <button className="editor-subtle-button" type="button" onClick={() => updateTrip({ quickInfo: [...trip.quickInfo, { label: "", value: "", detail: "" }] })}>+ 핵심 정보 추가</button>
    </section>

    <section className="editor-days" aria-labelledby="editor-days-title"><div className="editor-section-heading"><span className="section-index">03 / DAY BY DAY</span><h2 id="editor-days-title">날짜별 일정과 기록</h2><p>날짜를 고르고 활동·메모·사진을 수정하세요.</p></div>
      <div className="editor-day-tabs">{trip.days.map((item, index) => <button key={item.id} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)}><small>DAY {String(index + 1).padStart(2, "0")}</small><strong>{item.date}</strong><span>{item.title}</span></button>)}</div>
      {day && <div className="admin-panel editor-section">
        <div className="admin-grid-form"><div className="admin-field"><label htmlFor="edit-day-title">이날의 제목</label><input id="edit-day-title" value={day.title} onChange={(event) => updateDay({ title: event.target.value })} /></div><div className="admin-field"><label htmlFor="edit-day-date">날짜</label><input id="edit-day-date" value={day.date} onChange={(event) => updateDay({ date: event.target.value })} /></div><div className="admin-field"><label htmlFor="edit-day-weekday">요일</label><input id="edit-day-weekday" value={day.weekday} onChange={(event) => updateDay({ weekday: event.target.value })} /></div><div className="admin-field"><label htmlFor="edit-day-emoji">아이콘</label><input id="edit-day-emoji" value={day.emoji ?? ""} onChange={(event) => updateDay({ emoji: event.target.value })} /></div><div className="admin-field"><label htmlFor="edit-day-pass">패스·테마 표시</label><input id="edit-day-pass" value={day.pass ?? ""} onChange={(event) => updateDay({ pass: event.target.value })} placeholder="예: 주유패스 1일차" /></div><div className="admin-field admin-field-wide"><label htmlFor="edit-day-subtitle">짧은 소개</label><input id="edit-day-subtitle" value={day.subtitle} onChange={(event) => updateDay({ subtitle: event.target.value })} /></div></div>
        <div className="editor-activity-heading"><h3>시간별 활동</h3><button type="button" onClick={addActivity}>+ 활동 추가</button></div>
        {day.activities.map((activity, index) => <div className="editor-activity" key={activity.id ?? `${day.id}-${index}`}><div className="editor-activity-top"><strong>STOP {String(index + 1).padStart(2, "0")}</strong><div><button type="button" disabled={index === 0} onClick={() => moveActivity(index, -1)} aria-label={`${activity.title} 위로 이동`}>↑</button><button type="button" disabled={index === day.activities.length - 1} onClick={() => moveActivity(index, 1)} aria-label={`${activity.title} 아래로 이동`}>↓</button><button type="button" onClick={() => removeActivity(activity.id ?? "")}>활동 제거</button></div></div>
          <div className="admin-grid-form"><div className="admin-field"><label htmlFor={`time-${index}`}>시간</label><input id={`time-${index}`} value={activity.time} onChange={(event) => updateActivity(activity.id ?? "", { time: event.target.value })} placeholder="예: 09:30 또는 오후" /></div><div className="admin-field"><label htmlFor={`title-${index}`}>활동 이름</label><input id={`title-${index}`} value={activity.title} onChange={(event) => updateActivity(activity.id ?? "", { title: event.target.value })} /></div><div className="admin-field admin-field-wide"><label htmlFor={`location-${index}`}>장소</label><input id={`location-${index}`} value={activity.location ?? ""} onChange={(event) => updateActivity(activity.id ?? "", { location: event.target.value })} /></div><div className="admin-field admin-field-wide"><label htmlFor={`description-${index}`}>일정 설명</label><textarea id={`description-${index}`} rows={5} value={activity.description} onChange={(event) => updateActivity(activity.id ?? "", { description: event.target.value })} placeholder="줄바꿈으로 이동 단계를 나눠 적을 수 있습니다." /></div><div className="admin-field admin-field-wide"><label htmlFor={`transport-${index}`}>이동·결제 안내</label><textarea id={`transport-${index}`} rows={2} value={activity.transport ?? ""} onChange={(event) => updateActivity(activity.id ?? "", { transport: event.target.value })} placeholder="예: JR 고베선 · ICOCA / Osaka Metro C · 주유패스 QR" /></div><div className="admin-field"><label htmlFor={`transport-payment-${index}`}>교통 결제 색상 표시</label><select id={`transport-payment-${index}`} value={getTransportPayment(activity)} onChange={(event) => updateActivity(activity.id ?? "", { transportPayment: event.target.value as NonNullable<TripActivity["transportPayment"]> })}><option value="amazing-pass">주유패스 · 전 구간</option><option value="icoca">ICOCA · 전 구간</option><option value="ticket">별도 승차권</option><option value="none">도보 · 교통요금 없음</option></select><small>일부 구간만 패스가 적용되면 ICOCA로 전체 구간을 결제해요.</small></div></div>
          <div className="editor-booking"><label htmlFor={`booking-kind-${index}`}>예약 방식</label><select id={`booking-kind-${index}`} value={activity.booking?.kind ?? ""} onChange={(event) => { const kind = event.target.value as BookingKind | ""; updateActivity(activity.id ?? "", { booking: kind ? { kind, label: activity.booking?.label ?? "", detail: activity.booking?.detail ?? "", url: activity.booking?.url } : undefined }); }}><option value="">예약 정보 없음</option><option value="required">사전 예약</option><option value="onsite">현장 교환</option><option value="none">예약 없이</option><option value="check">조건 확인</option></select>{activity.booking && <div className="admin-grid-form"><div className="admin-field"><label htmlFor={`booking-label-${index}`}>예약 메모 제목</label><input id={`booking-label-${index}`} value={activity.booking.label} onChange={(event) => updateActivity(activity.id ?? "", { booking: { ...activity.booking!, label: event.target.value } })} /></div><div className="admin-field"><label htmlFor={`booking-url-${index}`}>공식 링크</label><input id={`booking-url-${index}`} type="url" value={activity.booking.url ?? ""} onChange={(event) => updateActivity(activity.id ?? "", { booking: { ...activity.booking!, url: event.target.value || undefined } })} placeholder="https://" /></div><div className="admin-field admin-field-wide"><label htmlFor={`booking-detail-${index}`}>예약 방법</label><textarea id={`booking-detail-${index}`} rows={2} value={activity.booking.detail} onChange={(event) => updateActivity(activity.id ?? "", { booking: { ...activity.booking!, detail: event.target.value } })} /></div></div>}</div>
          <div className="admin-field editor-note"><label htmlFor={`note-${index}`}>이 활동의 공개 메모</label><textarea id={`note-${index}`} rows={3} value={activity.note ?? ""} onChange={(event) => updateActivity(activity.id ?? "", { note: event.target.value })} placeholder="현장에서 기억해 두고 싶은 내용을 적어 주세요." /></div>
          <PhotoInputs photos={activity.photos ?? []} busy={uploading} onUpload={(files) => upload(files, { kind: "activity", id: activity.id ?? "" })} onRemove={(id) => updateActivity(activity.id ?? "", { photos: (activity.photos ?? []).filter((photo) => photo.id !== id) })} onUpdate={(id, patch) => updateActivity(activity.id ?? "", { photos: (activity.photos ?? []).map((photo) => photo.id === id ? { ...photo, ...patch } : photo) })} />
        </div>)}
        <div className="editor-day-memory"><h3>이날의 기록</h3><div className="admin-field"><label htmlFor="edit-day-note">공개 메모</label><textarea id="edit-day-note" rows={4} value={day.note ?? ""} onChange={(event) => updateDay({ note: event.target.value })} placeholder="하루의 분위기, 방문 소감, 다음에 기억할 내용을 적어 주세요." /></div><PhotoInputs photos={day.photos ?? []} busy={uploading} onUpload={(files) => upload(files, { kind: "day" })} onRemove={(id) => updateDay({ photos: (day.photos ?? []).filter((photo) => photo.id !== id) })} onUpdate={(id, patch) => updateDay({ photos: (day.photos ?? []).map((photo) => photo.id === id ? { ...photo, ...patch } : photo) })} /></div>
      </div>}
    </section>

    <section className="admin-panel editor-section" aria-labelledby="editor-bookings"><div className="editor-section-heading"><span className="section-index">04 / BEFORE YOU GO</span><h2 id="editor-bookings">예약 요약</h2><p>상세 화면 아래쪽에 모아 보여줄 예약 목록입니다.</p></div>
      {trip.bookingHighlights.map((item, index) => <div className="editor-booking-summary" key={index}><div className="admin-grid-form"><div className="admin-field"><label htmlFor={`summary-date-${index}`}>날짜</label><input id={`summary-date-${index}`} value={item.date} onChange={(event) => updateBooking(index, { date: event.target.value })} /></div><div className="admin-field"><label htmlFor={`summary-name-${index}`}>장소</label><input id={`summary-name-${index}`} value={item.name} onChange={(event) => updateBooking(index, { name: event.target.value })} /></div><div className="admin-field"><label htmlFor={`summary-status-${index}`}>상태</label><input id={`summary-status-${index}`} value={item.status} onChange={(event) => updateBooking(index, { status: event.target.value })} /></div><div className="admin-field"><label htmlFor={`summary-url-${index}`}>공식 링크</label><input id={`summary-url-${index}`} type="url" value={item.url} onChange={(event) => updateBooking(index, { url: event.target.value })} /></div><div className="admin-field admin-field-wide"><label htmlFor={`summary-note-${index}`}>추가 메모</label><textarea id={`summary-note-${index}`} rows={2} value={item.note ?? ""} onChange={(event) => updateBooking(index, { note: event.target.value || undefined })} /></div></div><button type="button" onClick={() => updateTrip({ bookingHighlights: trip.bookingHighlights.filter((_, itemIndex) => itemIndex !== index) })}>예약 요약 제거</button></div>)}
      <button className="editor-subtle-button" type="button" onClick={() => updateTrip({ bookingHighlights: [...trip.bookingHighlights, { date: "", name: "", status: "", url: "" }] })}>+ 예약 요약 추가</button>
    </section>
    {trip.slug === "osaka-2026" && <FoodGuideEditor guide={trip.foodGuide ?? defaultOsakaFoodGuide} onChange={(foodGuide) => updateTrip({ foodGuide })} />}
    {trip.slug === "osaka-2026" && <TransportGuideEditor guide={trip.transportGuide ?? defaultOsakaTransportGuide} onChange={(transportGuide) => updateTrip({ transportGuide })} />}
    <div className="editor-bottom-actions"><Link href={`/trips/${trip.slug}`} target="_blank">공개 화면 보기 ↗</Link><button type="button" onClick={save} disabled={busy || uploading}>{busy ? "저장 중…" : "변경사항 저장"}</button></div>
  </div>;
}
