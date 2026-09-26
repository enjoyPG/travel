import type { TripActivity } from "@/data/trip-types";

type MapPoint = {
  label: string;
  mapsName: string;
  placeId: string;
  lat: number;
  lng: number;
};

const points = {
  tsuruhashi: { label: "쓰루하시역", mapsName: "Tsuruhashi Station, Osaka, Japan", placeId: "0x6000e0a95f812c59:0x8ceed43cb7db1f3c", lat: 34.6652458, lng: 135.530318 },
  universalCity: { label: "유니버설시티역", mapsName: "Universal City Station, Osaka, Japan", placeId: "0x6000e890dcaf65db:0x44b3a88239419885", lat: 34.6678049, lng: 135.4385577 },
  kansaiAirport: { label: "간사이공항역", mapsName: "Kansai Airport Station, Osaka, Japan", placeId: "0x6000b91351b903d7:0x122605568f9c9b5d", lat: 34.4358892, lng: 135.243459 },
  osakako: { label: "오사카코역", mapsName: "Osakako Station, Osaka, Japan", placeId: "0x6000e88a72f4efe1:0x23180b9a00239244", lat: 34.6539844, lng: 135.4343734 },
  bentencho: { label: "벤텐초역", mapsName: "Bentencho Station, Osaka, Japan", placeId: "0x6000e633b9be0229:0x1781beaf560d262c", lat: 34.6701578, lng: 135.4619871 },
  namba: { label: "난바역", mapsName: "Namba Station, Osaka, Japan", placeId: "0x6000e71336f37515:0x5e5e33a312c32752", lat: 34.6670979, lng: 135.5003424 },
  tanimachi4: { label: "다니마치 4초메역", mapsName: "Tanimachi 4-chome Station, Osaka, Japan", placeId: "0x6000e7303b896f9b:0xe184dd05b7e04c23", lat: 34.6821069, lng: 135.5172527 },
  ebisucho: { label: "에비스초역", mapsName: "Ebisucho Station, Osaka, Japan", placeId: "0x6000e767683a0287:0x388d82aed7ca8e86", lat: 34.6556306, lng: 135.5056361 },
  nippombashi: { label: "닛폰바시역", mapsName: "Nippombashi Station, Osaka, Japan", placeId: "0x6000e7402f4aa96b:0xf9f81cb3f89f2923", lat: 34.6669677, lng: 135.5061197 },
  umeda: { label: "우메다역", mapsName: "Umeda Station, Osaka, Japan", placeId: "0x6000e6918dc9e10d:0x47b718217281e2c3", lat: 34.7050271, lng: 135.4984269 },
  shinimamiya: { label: "신이마미야역", mapsName: "Shin-Imamiya Station, Osaka, Japan", placeId: "0x6000e7621f94904f:0xc8812b30198df041", lat: 34.6497931, lng: 135.5015478 },
  nankaiShinimamiya: { label: "난카이 신이마미야역", mapsName: "Nankai Shin-Imamiya Station, Osaka, Japan", placeId: "0x6000e76236d67dd9:0xeb9f23e90b55f95d", lat: 34.6501927, lng: 135.5007276 },
  shinkobe: { label: "신코베역", mapsName: "Shin-Kobe Station, Kobe, Japan", placeId: "0x60008ec34f49fb8b:0x790b10d9f54938fb", lat: 34.7062884, lng: 135.1954675 },
  suma: { label: "스마카이힌코엔역", mapsName: "Sumakaihinkoen Station, Kobe, Japan", placeId: "0x6000850c2328d6c7:0xc51e8ff2b0d2ea2d", lat: 34.6472401, lng: 135.1265869 },
  dobutsuenmae: { label: "동물원앞역", mapsName: "Dobutsuen-mae Station, Osaka, Japan", placeId: "0x6000dd8af3aa7a4d:0x2cef12ed79886744", lat: 34.6488385, lng: 135.5035068 },
  shinsaibashi: { label: "신사이바시역", mapsName: "Shinsaibashi Station, Osaka, Japan", placeId: "0x6000e71a7502e511:0xf52ebb1984ed4516", lat: 34.6750572, lng: 135.5003772 },
  osaka: { label: "오사카역", mapsName: "Osaka Station, Osaka, Japan", placeId: "0x6000e68d95e3a70b:0x1baec822e859c84a", lat: 34.7024854, lng: 135.4959506 },
} satisfies Record<string, MapPoint>;

type PointKey = keyof typeof points;

function resolvePoint(value: string): PointKey | null {
  const place = value.toLocaleLowerCase().replace(/[·()[\]]/g, " ").replace(/\s+/g, " ").trim();
  if (/간사이공항|kansai airport|kix/.test(place)) return "kansaiAirport";
  if (/유니버설시티|universal city|유니버설 스튜디오|usj/.test(place)) return "universalCity";
  if (/츠루하시|쓰루하시|鶴橋|tsuruhashi/.test(place)) return "tsuruhashi";
  if (/오사카코|大阪港|osakako|덴포잔/.test(place)) return "osakako";
  if (/벤텐초|弁天町|bentencho/.test(place)) return "bentencho";
  if (/다니마치 ?4|谷町四|오사카성|大阪城/.test(place)) return "tanimachi4";
  if (/쓰텐카쿠|츠텐카쿠|신세카이|通天閣|新世界|에비스초/.test(place)) return "ebisucho";
  if (/닛폰바시|닛뽄바시|니폰바시|日本橋/.test(place)) return "nippombashi";
  if (/신코베|신고베|新神戸|shinkobe/.test(place)) return "shinkobe";
  if (/스마|須磨|suma/.test(place)) return "suma";
  if (/동물원앞|도부츠엔마에|動物園前|에비스 숙소|ebisu/.test(place)) return "dobutsuenmae";
  if (/난카이 신이마미야|南海新今宮/.test(place)) return "nankaiShinimamiya";
  if (/신이마미야|新今宮|shin.?imamiya/.test(place)) return "shinimamiya";
  if (/신사이바시|心斎橋|shinsaibashi/.test(place)) return "shinsaibashi";
  if (/우메다|梅田|오사카역|大阪駅|umeda/.test(place)) return "umeda";
  if (/난바|남바|なんば|難波|namba|도톤보리|道頓堀/.test(place)) return "namba";
  if (/오사카/.test(place)) return "osaka";
  return null;
}

function departureTime(activity: TripActivity) {
  const exact = activity.time.match(/(?:^|\D)(\d{1,2}):(\d{2})/);
  if (exact) return { hour: Number(exact[1]), minute: Number(exact[2]), note: "일정 기준" };

  const title = activity.title.toLocaleLowerCase();
  if (/간사이공항|kansai airport/.test(title)) return { hour: 18, minute: 30, note: "입국 후 예상" };
  if (/universal city|유니버설시티/.test(title)) return { hour: 20, minute: 0, note: "폐장 후 예상" };
  if (/쇼핑 후|자유시간 후/.test(title)) return { hour: 18, minute: 0, note: "일정 추정" };
  return null;
}

export type TransitMapLink = {
  href: string;
  origin: string;
  destination: string;
  dateTimeLabel: string;
};

export function getTransitMapLink(activity: TripActivity, dayDate: string, year: number): TransitMapLink | null {
  if (!activity.title.startsWith("이동 ·") && !activity.title.startsWith("귀환 ·")) return null;
  const route = activity.title.replace(/^(?:이동|귀환)\s*[·:]\s*/, "").split(/\s*→\s*/);
  if (route.length !== 2) return null;

  const [originText, destinationText] = route;
  let originKey = resolvePoint(originText);
  const destinationKey = resolvePoint(destinationText);
  if (!originKey || !destinationKey) return null;
  if (destinationKey === "kansaiAirport" && /에비스|ebisu/i.test(originText)) originKey = "nankaiShinimamiya";

  const time = departureTime(activity);
  const dateParts = dayDate.match(/^(\d{1,2})[./](\d{1,2})$/);
  if (!time || !dateParts) return null;

  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);
  // Google Maps' route URL interprets this Unix value as the requested local wall-clock time.
  const departureTimestamp = Math.floor(Date.UTC(year, month - 1, day, time.hour, time.minute) / 1000);
  const origin = points[originKey];
  const destination = points[destinationKey];
  const centerLat = ((origin.lat + destination.lat) / 2).toFixed(6);
  const centerLng = ((origin.lng + destination.lng) / 2).toFixed(6);
  const zoom = originKey === "kansaiAirport" || destinationKey === "kansaiAirport" ? "9z"
    : originKey === "shinkobe" || destinationKey === "shinkobe" || originKey === "suma" || destinationKey === "suma" ? "10z" : "12z";
  const pointData = (point: MapPoint) => `!1m5!1m1!1s${point.placeId}!2m2!1d${point.lng}!2d${point.lat}`;
  const href = `https://www.google.com/maps/dir/${encodeURIComponent(origin.mapsName)}/${encodeURIComponent(destination.mapsName)}/@${centerLat},${centerLng},${zoom}/data=!4m18!4m17${pointData(origin)}${pointData(destination)}!2m3!6e0!7e2!8j${departureTimestamp}!3e3`;
  const dateTimeLabel = `${month}/${day} · ${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")} ${time.note}`;

  return { href, origin: origin.label, destination: destination.label, dateTimeLabel };
}
