"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { OsakaFoodGuide } from "@/components/OsakaFoodGuide";
import { OsakaTransportGuide } from "@/components/OsakaTransportGuide";
import { ReadableText } from "@/components/ReadableText";
import { defaultOsakaFoodGuide } from "@/data/osaka-food-guide";
import { defaultOsakaTransportGuide } from "@/data/osaka-transport-guide";
import type { TripActivity, TripDocument, TripPhoto } from "@/data/trip-types";
import { getTransportPayment, transportPaymentLabels } from "@/lib/transport-payment";
import { getTransitMapLink } from "@/lib/google-maps-transit";

const bookingTone = {
  required: "must",
  onsite: "onsite",
  none: "easy",
  check: "check",
} as const;

const bookingName = {
  required: "사전 예약",
  onsite: "현장 교환",
  none: "예약 없이",
  check: "조건 확인",
} as const;

function PhotoGallery({ photos }: { photos: TripPhoto[] }) {
  if (photos.length === 0) return null;
  return <div className="trip-photo-gallery">{photos.map((photo) => (
    <figure key={photo.id}>
      <a href={photo.url} target="_blank" rel="noreferrer"><img src={photo.url} alt={photo.alt} loading="lazy" /></a>
      {photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  ))}</div>;
}

function ActivityCard({ activity, number, date, year }: { activity: TripActivity; number: number; date: string; year: number }) {
  const isTransit = activity.title.startsWith("이동 ·") || activity.title.startsWith("귀환 ·");
  const transportPayment = getTransportPayment(activity);
  const mapLink = getTransitMapLink(activity, date, year);
  return (
    <li className="activity-row">
      <div className="activity-time"><span>{activity.time}</span></div>
      <div className="activity-track" aria-hidden="true"><span /></div>
      <article className="activity-card">
        <div className="activity-card-top">
          <span className="activity-number">{isTransit ? "TRANSIT" : `STOP ${String(number).padStart(2, "0")}`}</span>
          {activity.booking && <span className={"booking-pill booking-" + bookingTone[activity.booking.kind]}>{bookingName[activity.booking.kind]}</span>}
        </div>
        <h4>{activity.title}</h4>
        {activity.location && <p className="activity-place"><span aria-hidden="true">⌖</span> {activity.location}</p>}
        <ReadableText text={activity.description} className="activity-description" />
        {activity.transport && <div className={`activity-transport activity-transport--${isTransit ? transportPayment : "facility"}`}>
          <div className="activity-transport-head"><span className="transport-payment-badge">{isTransit ? transportPaymentLabels[transportPayment] : "시설 · 입장 정보"}</span><strong>{isTransit ? "🚇 이동·결제" : "🎟 이용 안내"}</strong></div>
          <ReadableText text={activity.transport} className="activity-transport-copy" />
        </div>}
        {mapLink && <a className="activity-map-cta" href={mapLink.href} target="_blank" rel="noopener noreferrer" aria-label={`${mapLink.origin}에서 ${mapLink.destination}까지, ${mapLink.dateTimeLabel} 대중교통 경로를 Google 지도에서 확인`}>
          <span className="activity-map-icon" aria-hidden="true">↗</span>
          <span className="activity-map-copy"><strong>Google 지도 대중교통 확인</strong><small>{mapLink.origin} → {mapLink.destination} · {mapLink.dateTimeLabel}</small></span>
          <span className="activity-map-open">새 페이지 열기</span>
        </a>}
        {activity.booking && (
          <div className="activity-reservation">
            <div><strong>{activity.booking.label}</strong><ReadableText text={activity.booking.detail} className="activity-reservation-copy" /></div>
            {activity.booking.url && <a href={activity.booking.url} target="_blank" rel="noreferrer">공식 안내 <span aria-hidden="true">↗</span></a>}
          </div>
        )}
        {activity.note && <div className="activity-note"><strong>여행 메모</strong><ReadableText text={activity.note} className="activity-note-copy" /></div>}
        {activity.photos && <PhotoGallery photos={activity.photos} />}
      </article>
    </li>
  );
}

export function TripDetail({ trip }: { trip: TripDocument }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTopic, setActiveTopic] = useState<"itinerary" | "food" | "transport">("itinerary");
  const isOsakaTrip = trip.slug === "osaka-2026";
  const day = trip.days[activeIndex];
  const year = trip.startDate.slice(0, 4);

  function moveTopic(event: KeyboardEvent<HTMLButtonElement>, current: "itinerary" | "food" | "transport") {
    const topics = ["itinerary", "food", "transport"] as const;
    const currentIndex = topics.indexOf(current);
    const nextIndex = event.key === "ArrowRight" ? (currentIndex + 1) % topics.length
      : event.key === "ArrowLeft" ? (currentIndex + topics.length - 1) % topics.length
      : event.key === "Home" ? 0
      : event.key === "End" ? topics.length - 1
      : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const nextTopic = topics[nextIndex];
    setActiveTopic(nextTopic);
    document.getElementById(`topic-tab-${nextTopic}`)?.focus();
  }

  return (
    <>
      <SiteHeader tripTitle={trip.city} />
      <main className="detail-page">
        <section className="detail-hero">
          <Image src={trip.image} alt={trip.imageAlt} fill priority sizes="100vw" unoptimized={trip.image.startsWith("http")} className="detail-hero-image" />
          <div className="detail-hero-shade" />
          <div className="detail-hero-inner page-wrap">
          <div className="detail-hero-actions">
            <Link href="/" className="hero-back">← 여행 목록</Link>
            <Link href={`/admin/trips/${trip.slug}`} className="hero-edit-link">✎ 내용 수정</Link>
          </div>
            <div className="detail-hero-copy">
              <span>TRAVEL STORY <i /> {trip.country} · {trip.city}</span>
              <h1>{trip.heroTitle.map((line, index) => <span key={index}>{line}{index < trip.heroTitle.length - 1 && <br />}</span>)}</h1>
              <p>{trip.dateLabel} <span aria-hidden="true">·</span> {trip.durationLabel}</p>
            </div>
          </div>
        </section>

        <div className="detail-body page-wrap">
          <section className="trip-quick-info" aria-label="여행 핵심 정보">
            {trip.quickInfo.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></div>)}
          </section>

          {isOsakaTrip && <nav className="trip-topic-tabs" id="trip-topics" role="tablist" aria-label="오사카 여행 정보">
            <button type="button" role="tab" id="topic-tab-itinerary" aria-controls="trip-topic-panel" aria-selected={activeTopic === "itinerary"} tabIndex={activeTopic === "itinerary" ? 0 : -1} className={activeTopic === "itinerary" ? "is-active" : ""} onClick={() => setActiveTopic("itinerary")} onKeyDown={(event) => moveTopic(event, "itinerary")}><span>01</span> 일정</button>
            <button type="button" role="tab" id="topic-tab-food" aria-controls="trip-topic-panel" aria-selected={activeTopic === "food"} tabIndex={activeTopic === "food" ? 0 : -1} className={activeTopic === "food" ? "is-active" : ""} onClick={() => setActiveTopic("food")} onKeyDown={(event) => moveTopic(event, "food")}><span>02</span> 오사카 음식</button>
            <button type="button" role="tab" id="topic-tab-transport" aria-controls="trip-topic-panel" aria-selected={activeTopic === "transport"} tabIndex={activeTopic === "transport" ? 0 : -1} className={activeTopic === "transport" ? "is-active" : ""} onClick={() => setActiveTopic("transport")} onKeyDown={(event) => moveTopic(event, "transport")}><span>03</span> 지하철·패스</button>
          </nav>}

          <div className="trip-topic-panel" id={isOsakaTrip ? "trip-topic-panel" : undefined} role={isOsakaTrip ? "tabpanel" : undefined} aria-labelledby={isOsakaTrip ? `topic-tab-${activeTopic}` : undefined}>
          {(!isOsakaTrip || activeTopic === "itinerary") && <>
          <section className="itinerary-layout" id="itinerary" aria-labelledby="itinerary-title">
            <aside className="day-sidebar">
              <div className="day-sidebar-heading"><span className="section-index">YOUR {trip.days.length} DAYS</span><h2 id="itinerary-title">날짜별 일정</h2><p>하루를 선택해 동선을 확인하세요.</p></div>
              <div className="day-list" role="tablist" aria-label="여행 날짜">
                {trip.days.map((item, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeIndex === index}
                    aria-controls="selected-day-panel"
                    id={`day-tab-${index}`}
                    className={"day-button" + (activeIndex === index ? " is-active" : "")}
                    onClick={() => setActiveIndex(index)}
                    key={item.id}
                  >
                    <span className="day-button-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="day-button-date">{item.date}<small>{item.weekday}</small></span>
                    <span className="day-button-title">{item.title}</span>
                    <span className="day-button-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <p className="day-sidebar-foot">현지 시간 기준으로 정리한 계획입니다.</p>
            </aside>

            <div className="day-main" role="tabpanel" id="selected-day-panel" aria-labelledby={`day-tab-${activeIndex}`} aria-live="polite">
              <div className="selected-day-heading">
                <div className="day-kicker"><span>DAY {String(activeIndex + 1).padStart(2, "0")} / {String(trip.days.length).padStart(2, "0")}</span>{day.pass && <span className="pass-label">{day.pass}</span>}</div>
                <h2>{day.title}</h2>
                <ReadableText text={day.subtitle} className="day-subtitle-copy" />
                <div className="selected-day-date"><span>{day.date}</span><small>{year} · {day.weekday}요일</small></div>
              </div>

              <ol className="activity-list">
                {day.activities.map((activity, index) => <ActivityCard activity={activity} number={index + 1} date={day.date} year={Number(year)} key={activity.id ?? index + "-" + activity.title} />)}
              </ol>
              {day.activities.length === 0 && <p className="activity-empty">이날의 일정이 아직 없어요.</p>}

              <div className="day-memory">
                <div><span className="memory-icon" aria-hidden="true">✳</span><div><strong>이날의 기록</strong><ReadableText text={day.note || "여행 중 남기는 메모와 사진이 일정 아래에 모입니다."} className="day-memory-copy" /></div></div>
                {!day.note && !day.photos?.length && <span className="memory-empty">아직 기록이 없어요</span>}
              </div>
              {day.photos && <PhotoGallery photos={day.photos} />}
              <div className="day-pagination">
                <button type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex(activeIndex - 1)}>← 이전 날</button>
                <span>{activeIndex + 1} / {trip.days.length}</span>
                <button type="button" disabled={activeIndex === trip.days.length - 1} onClick={() => setActiveIndex(activeIndex + 1)}>다음 날 →</button>
              </div>
            </div>
          </section>

          {trip.bookingHighlights.length > 0 && <section className="booking-summary" id="booking" aria-labelledby="booking-title">
            <div className="booking-summary-heading"><span className="section-index">BEFORE YOU GO</span><h2 id="booking-title">예약 먼저 챙기기</h2><p>필요한 예약은 해당 날짜의 활동 카드에서도 볼 수 있습니다.</p></div>
            <div className="booking-summary-list">
              {trip.bookingHighlights.map((item) => (
                item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="booking-summary-row" key={item.date + item.name}>
                  <span>{item.date}</span><strong>{item.name}</strong><small>{item.status}</small><span aria-hidden="true">↗</span>
                </a> : <div className="booking-summary-row" key={item.date + item.name}>
                  <span>{item.date}</span><strong>{item.name}</strong><small>{item.status}</small><span aria-hidden="true">·</span>
                </div>
              ))}
            </div>
          </section>}
          </>}

          {isOsakaTrip && activeTopic === "food" && <OsakaFoodGuide guide={trip.foodGuide ?? defaultOsakaFoodGuide} />}
          {isOsakaTrip && activeTopic === "transport" && <OsakaTransportGuide guide={trip.transportGuide ?? defaultOsakaTransportGuide} />}
          </div>
          <footer className="detail-footer"><Link href="/">← 다른 여행 보기</Link><span className="handwritten">see you on the road!</span></footer>
        </div>
      </main>
    </>
  );
}
