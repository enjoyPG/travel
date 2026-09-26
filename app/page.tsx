import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { listPublishedTrips } from "@/lib/trip-repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trips = await listPublishedTrips();
  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section className="home-heading page-wrap">
          <div>
            <span className="eyebrow">THE TRAVEL ARCHIVE <span className="eyebrow-line" /></span>
            <h1>여행을 <span>골라볼까요?</span></h1>
          </div>
          <p>계획했던 순간부터 돌아온 뒤의 기록까지.<br />우리가 떠난 여행을 한 장씩 모아두는 공간.</p>
        </section>

        <section className="trip-picker page-wrap" aria-labelledby="trip-picker-title">
          <div className="section-topline">
            <div>
              <span className="section-index">01 / DESTINATIONS</span>
              <h2 id="trip-picker-title">여행 선택</h2>
            </div>
            <span className="trip-count">{trips.length}개의 여행</span>
          </div>
          <div className="trip-card-grid">
            {trips.map((trip, index) => (
              <Link className="trip-card" href={"/trips/" + trip.slug} key={trip.slug} aria-label={trip.title + " 일정 보기"}>
                <Image src={trip.image} alt={trip.imageAlt} fill priority={index === 0} sizes="(max-width: 720px) 100vw, 1200px" unoptimized={trip.image.startsWith("http")} className="trip-card-image" />
                <div className="trip-card-shade" />
                <div className="trip-card-top"><span>TRIP {String(index + 1).padStart(2, "0")}</span><span>{trip.country} / {trip.city}</span></div>
                <div className="trip-card-bottom">
                  <div className="trip-card-copy">
                    <span className="trip-card-date">{trip.dateLabel}</span>
                    <h3>{trip.title}</h3>
                    <p>{trip.description}</p>
                  </div>
                  <span className="trip-card-arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="home-caption">사진을 누르면 날짜별 일정과 여행 기록이 열립니다.</p>
        </section>

        <div className="home-end page-wrap"><span>기억해 두고 싶은 여행, 하나씩.</span><span className="handwritten">the days we went somewhere ♡</span></div>
      </main>
    </>
  );
}
