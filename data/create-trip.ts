import type { TripDocument, TripItineraryDay } from "@/data/trip-types";

export type NewTripInput = Pick<TripDocument, "slug" | "country" | "city" | "title" | "description" | "image" | "imageAlt" | "startDate" | "endDate">;

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("날짜는 YYYY-MM-DD 형식으로 입력해 주세요.");
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error("올바른 여행 날짜를 입력해 주세요.");
  return date;
}

export function createTripDraft(input: NewTripInput): TripDocument {
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  const dayCount = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (dayCount < 1 || dayCount > 60) throw new Error("여행 기간은 1일부터 60일까지 선택해 주세요.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) throw new Error("주소는 영문 소문자, 숫자, 하이픈만 사용할 수 있어요.");

  const days: TripItineraryDay[] = Array.from({ length: dayCount }, (_, index) => {
    const current = new Date(start.getTime() + index * 86_400_000);
    const isoDate = current.toISOString().slice(0, 10);
    return {
      id: isoDate,
      date: `${current.getUTCMonth() + 1}.${String(current.getUTCDate()).padStart(2, "0")}`,
      weekday: weekdays[current.getUTCDay()],
      title: `${index + 1}일차`,
      subtitle: "오늘의 여행을 적어 주세요.",
      activities: [],
    };
  });

  const dateLabel = `${input.startDate.replaceAll("-", ".")} — ${input.endDate.slice(5).replace("-", ".")}`;
  return {
    ...input,
    heroTitle: [input.title],
    dateLabel,
    durationLabel: dayCount === 1 ? "당일 여행" : `${dayCount - 1}박 ${dayCount}일`,
    quickInfo: [],
    days,
    bookingHighlights: [],
    published: false,
  };
}
