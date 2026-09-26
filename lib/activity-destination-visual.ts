import type { TripActivity } from "@/data/trip-types";

export type ActivityDestinationVisual = {
  src: string;
  alt: string;
  label: string;
};

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
    match: /오사카성|오사카 성|고자부네/,
    visual: {
      src: "/images/osaka-castle.jpg",
      alt: "해자와 돌담 위에 세워진 오사카성 천수각",
      label: "오사카성",
    },
  },
  {
    match: /덴포잔|오사카코|산타마리아|레고랜드/,
    visual: {
      src: "/images/tempozan-bay.jpg",
      alt: "덴포잔 대관람차와 오사카 항구의 유람선",
      label: "덴포잔 베이 에어리어",
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
      src: "/images/osaka-shinsekai.png",
      alt: "신세카이 거리와 쓰텐카쿠 타워",
      label: "신세카이 · 쓰텐카쿠",
    },
  },
  {
    match: /hep\s*five|우메다/i,
    visual: {
      src: "/images/umeda-hep-five.jpg",
      alt: "붉은 대관람차가 보이는 우메다 도심 야경",
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
    match: /도톤보리|돈보리|리버\s*크루즈|리버크루즈/,
    visual: {
      src: "/images/osaka-dotonbori.png",
      alt: "간판과 다리가 비치는 도톤보리 운하의 저녁 풍경",
      label: "도톤보리",
    },
  },
  {
    match: /츠루하시.*(식사|점심|저녁|맛집|상점|시장|먹거리)/,
    visual: {
      src: "/images/tsuruhashi-food-alley.jpg",
      alt: "고깃집과 음식점이 모인 츠루하시 골목",
      label: "츠루하시 먹거리 골목",
    },
  },
];

export function getActivityDestinationVisual(activity: TripActivity): ActivityDestinationVisual | null {
  const activityLabel = `${activity.title} ${activity.location ?? ""}`;
  return destinationVisuals.find(({ match }) => match.test(activityLabel))?.visual ?? null;
}
