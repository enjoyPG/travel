import type { TripActivity } from "@/data/trip-types";

export type TransportPayment = NonNullable<TripActivity["transportPayment"]>;

export function getTransportPayment(activity: TripActivity): TransportPayment {
  if (activity.transportPayment) return activity.transportPayment;
  const text = activity.transport ?? "";

  if (!/(JR|Osaka Metro|지하철|전철|열차|난카이|한큐|한신|게이한|긴테츠)/i.test(text)) return "none";
  if (/ICOCA|승차권/.test(text)) return "icoca";
  if (/주유패스/.test(text) && !/주유패스\s*불가/.test(text) && /(QR|사용|요금은)/.test(text)) return "amazing-pass";
  if (/Osaka Metro/i.test(text) && !/(고베|Kobe|ICOCA)/i.test(text)) return "amazing-pass";
  return "ticket";
}

export const transportPaymentLabels: Record<TransportPayment, string> = {
  "amazing-pass": "주유패스 · 전 구간",
  icoca: "ICOCA · 전 구간",
  ticket: "승차권 · 전 구간",
  none: "도보 · 교통요금 없음",
};
