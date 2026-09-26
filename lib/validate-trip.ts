import type { TripDocument } from "@/data/trip-types";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

function webUrl(value: unknown): value is string {
  if (!text(value, 2000)) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function imageUrl(value: unknown): value is string {
  return webUrl(value) || (text(value, 500) && value.startsWith("/images/"));
}

export function parseTripDocument(value: unknown): TripDocument {
  if (!record(value)) throw new Error("여행 내용이 올바르지 않습니다.");
  if (!text(value.slug, 80) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) throw new Error("여행 주소가 올바르지 않습니다.");
  for (const key of ["startDate", "endDate"] as const) {
    if (!text(value[key], 10) || !/^\d{4}-\d{2}-\d{2}$/.test(value[key])) throw new Error("여행 날짜가 올바르지 않습니다.");
  }
  for (const key of ["country", "city", "title", "dateLabel", "durationLabel", "description", "imageAlt"] as const) {
    if (!text(value[key], 500)) throw new Error(`${key} 값이 올바르지 않습니다.`);
  }
  if (!imageUrl(value.image)) throw new Error("대표 사진 주소가 올바르지 않습니다.");
  if (!Array.isArray(value.heroTitle) || value.heroTitle.length < 1 || value.heroTitle.length > 3 || !value.heroTitle.every((line) => text(line, 100))) throw new Error("여행 제목이 올바르지 않습니다.");
  if (typeof value.published !== "boolean") throw new Error("공개 상태가 올바르지 않습니다.");
  if (value.published && value.image === "/images/trip-placeholder.svg") throw new Error("게시하기 전에 대표 사진을 올려 주세요.");
  if (!Array.isArray(value.quickInfo) || value.quickInfo.length > 8 || !value.quickInfo.every((item) => record(item) && text(item.label, 40) && text(item.value, 150) && text(item.detail, 200))) throw new Error("핵심 정보가 올바르지 않습니다.");
  if (!Array.isArray(value.bookingHighlights) || value.bookingHighlights.length > 40 || !value.bookingHighlights.every((item) => record(item) && text(item.date, 20) && text(item.name, 150) && text(item.status, 80) && (item.url === undefined || item.url === "" || webUrl(item.url)))) throw new Error("예약 정보가 올바르지 않습니다.");
  if (value.transportGuide !== undefined && !validTransportGuide(value.transportGuide)) throw new Error("교통·패스 안내가 올바르지 않습니다.");
  if (value.foodGuide !== undefined && !validFoodGuide(value.foodGuide)) throw new Error("음식 안내가 올바르지 않습니다.");
  if (!Array.isArray(value.days) || value.days.length < 1 || value.days.length > 60) throw new Error("여행 날짜는 1일부터 60일까지 필요합니다.");
  for (const day of value.days) {
    if (!record(day) || !text(day.id, 80) || !text(day.date, 20) || !text(day.weekday, 10) || !text(day.title, 150) || !text(day.subtitle, 300) || (day.note !== undefined && !text(day.note, 10000))) throw new Error("날짜별 일정이 올바르지 않습니다.");
    if (!Array.isArray(day.activities) || day.activities.length > 80) throw new Error("하루 활동은 80개 이하로 입력해 주세요.");
    for (const activity of day.activities) {
      if (!record(activity) || !text(activity.time, 40) || !text(activity.title, 150) || !text(activity.description, 5000) || (activity.transport !== undefined && !text(activity.transport, 500)) || (activity.transportPayment !== undefined && !["amazing-pass", "icoca", "ticket", "none"].includes(String(activity.transportPayment))) || (activity.location !== undefined && !text(activity.location, 300)) || (activity.note !== undefined && !text(activity.note, 10000))) throw new Error("활동 내용이 올바르지 않습니다.");
      if (activity.booking !== undefined && (!record(activity.booking) || !["required", "onsite", "none", "check"].includes(String(activity.booking.kind)) || !text(activity.booking.label, 150) || !text(activity.booking.detail, 1500) || (activity.booking.url !== undefined && !webUrl(activity.booking.url)))) throw new Error("활동 예약 정보가 올바르지 않습니다.");
      if (!validPhotos(activity.photos)) throw new Error("활동 사진 정보가 올바르지 않습니다.");
    }
    if (!validPhotos(day.photos)) throw new Error("날짜별 사진 정보가 올바르지 않습니다.");
  }
  return value as unknown as TripDocument;
}

function validFoodGuide(value: unknown): boolean {
  if (!record(value) || !text(value.title, 200) || !text(value.intro, 3000)) return false;
  if (!Array.isArray(value.categories) || value.categories.length > 20 || !value.categories.every((category) =>
    record(category) && text(category.title, 200) && text(category.intro, 1000) && Array.isArray(category.dishes) && category.dishes.length <= 100 && category.dishes.every((dish) =>
      record(dish) && text(dish.name, 150) && text(dish.japanese, 150) && text(dish.description, 2000),
    ),
  )) return false;
  if (!Array.isArray(value.links) || value.links.length > 40 || !value.links.every((link) => record(link) && text(link.label, 200) && text(link.url, 2000) && (link.url === "" || webUrl(link.url)))) return false;
  return true;
}

function validPhotos(value: unknown): boolean {
  return value === undefined || (Array.isArray(value) && value.length <= 40 && value.every((photo) => record(photo) && text(photo.id, 80) && webUrl(photo.url) && text(photo.alt, 300) && (photo.caption === undefined || text(photo.caption, 1000))));
}

function validTransportGuide(value: unknown): boolean {
  const colors = ["red", "purple", "blue", "green", "pink", "brown", "lime", "orange", "teal"];
  if (!record(value) || !text(value.title, 200) || !text(value.intro, 1000) || !text(value.howtoTitle, 200)) return false;
  if (!Array.isArray(value.rules) || value.rules.length > 30 || !value.rules.every((item) => record(item) && text(item.badge, 20) && text(item.title, 200) && text(item.body, 2000))) return false;
  if (!Array.isArray(value.groups) || value.groups.length > 30 || !value.groups.every((group) => record(group) && text(group.title, 200) && Array.isArray(group.lines) && group.lines.length <= 100 && group.lines.every((line) => record(line) && text(line.code, 20) && text(line.name, 200) && text(line.company, 100) && typeof line.passIncluded === "boolean" && colors.includes(String(line.color)) && text(line.payment, 300)))) return false;
  if (!Array.isArray(value.howtoSteps) || value.howtoSteps.length > 40 || !value.howtoSteps.every((item) => record(item) && text(item.title, 200) && text(item.body, 3000))) return false;
  if (!Array.isArray(value.notes) || value.notes.length > 40 || !value.notes.every((item) => record(item) && text(item.title, 200) && text(item.body, 3000))) return false;
  if (!Array.isArray(value.links) || value.links.length > 40 || !value.links.every((item) => record(item) && text(item.label, 200) && text(item.url, 2000) && (item.url === "" || webUrl(item.url)))) return false;
  return true;
}
