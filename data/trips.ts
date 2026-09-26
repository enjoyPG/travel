import { bookingHighlights, osakaDays } from "@/data/osaka";
import { defaultOsakaFoodGuide } from "@/data/osaka-food-guide";
import { defaultOsakaTransportGuide } from "@/data/osaka-transport-guide";
import type { TripDocument } from "@/data/trip-types";

export const osakaTrip: TripDocument = {
  slug: "osaka-2026",
  startDate: "2026-09-30",
  endDate: "2026-10-07",
  country: "JAPAN",
  city: "OSAKA",
  title: "오사카, 여덟 번의 하루",
  heroTitle: ["오사카,", "여덟 번의 하루"],
  dateLabel: "2026.09.30 — 10.07",
  durationLabel: "7박 8일",
  description: "도톤보리의 밤부터 고베의 초록빛 하루까지",
  image: "/images/osaka-dotonbori.png",
  imageAlt: "해 질 무렵 오사카 도톤보리 운하의 풍경",
  quickInfo: [
    { label: "FLIGHT", value: "청주 ↔ 간사이", detail: "9.30 출발 · 10.07 귀국" },
    { label: "STAY", value: "츠루하시 → 에비스", detail: "10.05 두 번째 숙소 체크인" },
    { label: "PASS", value: "주유패스 · 조이패스", detail: "주유 10.02–03 · 조이 10.02/05" },
  ],
  days: osakaDays,
  bookingHighlights,
  foodGuide: defaultOsakaFoodGuide,
  transportGuide: defaultOsakaTransportGuide,
  published: true,
};
