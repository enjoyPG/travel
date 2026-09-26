export type BookingKind = "required" | "onsite" | "none" | "check";

export type TripPhoto = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
};

export type TripActivity = {
  id?: string;
  time: string;
  title: string;
  description: string;
  transport?: string;
  transportPayment?: "amazing-pass" | "icoca" | "ticket" | "none";
  location?: string;
  booking?: {
    kind: BookingKind;
    label: string;
    detail: string;
    url?: string;
  };
  note?: string;
  photos?: TripPhoto[];
};

export type TripItineraryDay = {
  id: string;
  date: string;
  weekday: string;
  title: string;
  subtitle: string;
  pass?: string;
  emoji?: string;
  image?: string;
  note?: string;
  photos?: TripPhoto[];
  activities: TripActivity[];
};

export type TripQuickInfo = {
  label: string;
  value: string;
  detail: string;
};

export type TripBookingHighlight = {
  date: string;
  name: string;
  status: string;
  note?: string;
  url?: string;
};

export type TripTransportGuideLine = {
  code: string;
  name: string;
  company: string;
  color: string;
  passIncluded: boolean;
  payment: string;
};

export type TripTransportGuide = {
  title: string;
  intro: string;
  rules: { badge: string; title: string; body: string }[];
  groups: { title: string; lines: TripTransportGuideLine[] }[];
  howtoTitle: string;
  howtoSteps: { title: string; body: string }[];
  notes: { title: string; body: string }[];
  links: { label: string; url: string }[];
};

export type TripFoodDish = {
  name: string;
  japanese: string;
  description: string;
};

export type TripFoodCategory = {
  title: string;
  intro: string;
  dishes: TripFoodDish[];
};

export type TripFoodGuide = {
  title: string;
  intro: string;
  categories: TripFoodCategory[];
  links: { label: string; url: string }[];
};

export type TripDocument = {
  slug: string;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  title: string;
  heroTitle: string[];
  dateLabel: string;
  durationLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  quickInfo: TripQuickInfo[];
  days: TripItineraryDay[];
  bookingHighlights: TripBookingHighlight[];
  transportGuide?: TripTransportGuide;
  foodGuide?: TripFoodGuide;
  published: boolean;
};
