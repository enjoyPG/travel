import type { TripActivity } from "@/data/trip-types";

export type ActivityDestinationVisual = {
  src: string;
  alt: string;
  label: string;
};

// Each specific stop has its own image. Broad area keywords are avoided so
// multiple activities in the same neighborhood do not reuse one photo.
const destinationVisuals: { match: RegExp; visual: ActivityDestinationVisual }[] = [
  {
    match: /유니버설|universal city|\busj\b/i,
    visual: {
      src: "/images/usj-theme-park.jpg",
      alt: "롤러코스터와 테마파크 거리 풍경",
      label: "유니버설 스튜디오 재팬",
    },
  },
  {
    match: /고자부네/,
    visual: {
      src: "/images/osaka-castle-gozabune.jpg",
      alt: "오사카성 해자 위를 지나는 금빛 고자부네",
      label: "오사카성 고자부네",
    },
  },
  {
    match: /오사카성|오사카 성/,
    visual: {
      src: "/images/osaka-castle.jpg",
      alt: "해자와 돌담 위에 세워진 오사카성 천수각",
      label: "오사카성 천수각",
    },
  },
  {
    match: /오사카코 도착|오사카코/,
    visual: {
      src: "/images/osaka-aquarium-arrival.webp",
      alt: "덴포잔의 가이유칸 수족관 외관과 입구 광장",
      label: "가이유칸 · 오사카코 도착",
    },
  },
  {
    match: /산타마리아|santa maria/i,
    visual: {
      src: "/images/santa-maria-cruise.jpg",
      alt: "오사카항을 출발하는 돛대가 있는 산타마리아 크루즈선",
      label: "산타마리아 데이 크루즈",
    },
  },
  {
    match: /레고랜드/,
    visual: {
      src: "/images/legoland-discovery.jpg",
      alt: "블록으로 만든 오사카 미니어처가 있는 실내 디스커버리 센터",
      label: "레고랜드 디스커버리 센터",
    },
  },
  {
    match: /덴포잔.*대관람차|대관람차.*덴포잔/,
    visual: {
      src: "/images/tempozan-wheel.jpg",
      alt: "푸른 저녁 하늘 아래 불이 켜진 덴포잔 대관람차",
      label: "덴포잔 대관람차",
    },
  },
  {
    match: /소라니와|空庭温泉/,
    visual: {
      src: "/images/soraniwa-onsen.jpg",
      alt: "도심 전망이 보이는 노천 온천 정원",
      label: "소라니와 온천",
    },
  },
  {
    match: /쓰텐카쿠|츠텐카쿠|신세카이/,
    visual: {
      src: "/images/shinsekai-tsutenkaku-day.webp",
      alt: "낮의 신세카이 상점가 위로 보이는 쓰텐카쿠 타워",
      label: "신세카이 · 쓰텐카쿠",
    },
  },
  {
    match: /hep\s*five|우메다/i,
    visual: {
      src: "/images/hep-five-cabin-view.webp",
      alt: "HEP FIVE 관람차 객실에서 내려다본 우메다 야경",
      label: "우메다 · HEP FIVE",
    },
  },
  {
    match: /스마\s*씨월드|須磨海浜公園|고베\s*스마/,
    visual: {
      src: "/images/suma-sea-world.jpg",
      alt: "고베 해양 수족관의 푸른 풀과 범고래",
      label: "고베 스마 씨월드",
    },
  },
  {
    match: /누노비키|허브가든|허브원/,
    visual: {
      src: "/images/kobe-garden.png",
      alt: "고베 누노비키 허브가든과 로프웨이 전망",
      label: "고베 누노비키 허브가든",
    },
  },
  {
    match: /신사이바시/,
    visual: {
      src: "/images/shinsaibashi-shopping.jpg",
      alt: "유리 지붕 아래 상점이 이어지는 신사이바시 쇼핑 거리",
      label: "신사이바시 쇼핑 거리",
    },
  },
  {
    match: /도톤보리.*리버\s*크루즈|돈보리.*리버\s*크루즈|돈보리.*크루즈/,
    visual: {
      src: "/images/dotonbori-cruise-boat.webp",
      alt: "도톤보리 리버 크루즈 배 위에서 바라본 에비스바시와 글리코상",
      label: "돈보리 리버 크루즈",
    },
  },
  {
    match: /도톤보리.*야경.*산책/,
    visual: {
      src: "/images/dotonbori-neon-street.webp",
      alt: "네온 간판과 인파로 붐비는 도톤보리 야간 거리",
      label: "도톤보리 야경 산책",
    },
  },
  {
    match: /도톤보리.*(산책|이른 저녁)/,
    visual: {
      src: "/images/dotonbori-street-day-v2.webp",
      alt: "낮의 에비스바시와 글리코상이 보이는 도톤보리 운하",
      label: "도톤보리 산책",
    },
  },
  {
    match: /츠루하시.*(식사|점심|저녁|맛집|상점|시장|먹거리)/,
    visual: {
      src: "/images/tsuruhashi-yakiniku-table.webp",
      alt: "불판에 고기를 굽고 반찬을 곁들여 먹는 츠루하시 야키니쿠",
      label: "츠루하시 먹거리 골목",
    },
  },
];

export function getActivityDestinationVisual(activity: TripActivity): ActivityDestinationVisual | null {
  const title = activity.title;
  if ((/도톤보리|돈보리/.test(title) && /승선권|교환/.test(title))) return null;
  return destinationVisuals.find(({ match }) => match.test(title))?.visual ?? null;
}
