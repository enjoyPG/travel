import type { TripTransportGuide } from "@/data/trip-types";

export const defaultOsakaTransportGuide: TripTransportGuide = {
  title: "오사카 지하철·패스 한눈에 보기",
  intro: "역명 옆 알파벳+숫자와 운영 회사명을 같이 보면 돼요. M20은 미도스지선 난바, S19는 오사카 메트로 센니치마에선 츠루하시예요. 색은 보조 표시이고 역 코드와 회사가 기준이에요. 10/2–3에는 오사카 메트로 전 구간 주유패스 QR을 쓸 수 있지만, JR·고베 지하철은 ICOCA예요.",
  rules: [
    { badge: "QR", title: "주유패스 · 오사카 메트로", body: "10/2–3 패스 사용일에는 Osaka Metro 8개 노선과 뉴트램에서 QR을 사용해요. 개찰구의 QR 리더에 화면을 보여주세요. Metro 안에서 노선만 바꾸면 개찰구 밖으로 나가지 않아요. 노선이 적용 구역 밖으로 이어지면 그 이동 전체를 ICOCA로 결제해요." },
    { badge: "IC", title: "ICOCA · JR·고베·경계 이동", body: "JR 오사카 순환선·유메사키선·고베선, 고베 시영 지하철, 난카이, 주유패스 사용일 밖의 이동은 ICOCA를 써요. 한 이동 중 패스 적용 구간과 미적용 구간이 섞이면 이 여행에서는 쪼개 결제하지 않고 ICOCA로 처음부터 끝까지 타요. 라피트는 ICOCA 운임과 별도로 특급권이 필요해요." },
    { badge: "JOY", title: "JoyPass · 관광 시설 입장권", body: "JoyPass는 등록된 관광 시설·체험 입장에 사용해요. 전철·지하철 승차에는 사용할 수 없으므로 교통은 일정별로 주유패스 QR 또는 ICOCA로 따로 결제해요." },
  ],
  groups: [
    {
      title: "Osaka Metro · 8개 노선 주유패스 가능",
      lines: [
        { code: "M", name: "미도스지선", company: "Osaka Metro", color: "red", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "T", name: "다니마치선", company: "Osaka Metro", color: "purple", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "Y", name: "요쓰바시선", company: "Osaka Metro", color: "blue", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "C", name: "주오선", company: "Osaka Metro", color: "green", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "S", name: "센니치마에선", company: "Osaka Metro", color: "pink", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "K", name: "사카이스지선", company: "Osaka Metro", color: "brown", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "N", name: "나가호리 쓰루미료쿠치선", company: "Osaka Metro", color: "lime", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
        { code: "I", name: "이마자토스지선", company: "Osaka Metro", color: "orange", passIncluded: true, payment: "단독 Metro 구간 주유 QR · 경계 넘으면 ICOCA 전체" },
      ],
    },
    {
      title: "JR West · 주유패스 불가, ICOCA 사용",
      lines: [
        { code: "O", name: "오사카 순환선", company: "JR West", color: "red", passIncluded: false, payment: "ICOCA·승차권" },
        { code: "P", name: "JR 유메사키선", company: "JR West", color: "blue", passIncluded: false, payment: "ICOCA·승차권" },
        { code: "Q", name: "야마토지선", company: "JR West", color: "green", passIncluded: false, payment: "ICOCA·승차권" },
        { code: "R", name: "한와선", company: "JR West", color: "blue", passIncluded: false, payment: "ICOCA·승차권" },
        { code: "A", name: "JR 교토선 · JR 고베선", company: "JR West", color: "teal", passIncluded: false, payment: "ICOCA·승차권" },
      ],
    },
    {
      title: "다른 회사 · 이번 일정의 결제",
      lines: [
        { code: "NK", name: "난카이 공항급행 · 간사이공항 구간", company: "Nankai", color: "teal", passIncluded: false, payment: "공항 이동은 ICOCA·승차권 · 라피트 특급권 별도" },
        { code: "S", name: "세이신·야마테선", company: "Kobe City Subway", color: "green", passIncluded: false, payment: "ICOCA·승차권" },
      ],
    },
  ],
  howtoTitle: "표지·환승·결제를 순서대로 확인해요",
  howtoSteps: [
    { title: "① 역 코드와 회사부터 확인", body: "역명 표지의 알파벳+숫자(예: M20, S19)와 노선 색, 회사명을 같이 확인해요. 츠루하시역은 Osaka Metro S19와 JR O04가 다른 회사·개찰구이므로 출발 전에 어느 역인지 확인해요." },
    { title: "② 행선지와 승강장 번호 확인", body: "전광판에서 열차 행선지와 다음 정차역을 확인하고, 일정에 적힌 일본어 방면 표지를 따라가요. 예: 天王寺方面, 西九条・弁天町方面, 三ノ宮・姫路方面. 플랫폼 번호와 막차·급행 정차 여부는 현장 안내를 우선해요." },
    { title: "③ Osaka Metro 안에서 노선 갈아타기", body: "목적역을 나가기 전에는 개찰구를 나가지 않아요. ‘のりかえ / Transfer’ 표지와 다음 노선 색·기호를 따라 환승 통로를 걸어요. 환승 통로에서 패스 QR이나 ICOCA를 다시 대지 않고, 마지막 목적역 개찰구에서 처리해요." },
    { title: "④ JR·다른 회사로 옮길 때", body: "JR↔Osaka Metro, JR↔고베 시영 지하철처럼 회사가 바뀌면 개찰구도 달라요. ‘のりかえ改札 / Transfer gate’가 있으면 ICOCA를 한 번 대고 통과해요. 전용 환승 개찰구가 없으면 먼저 탄 회사의 일반 개찰구에서 나와 다음 회사 개찰구로 다시 들어가요. JR↔JR 환승은 JR 유료 구역 안에서 표지를 따라가면 돼요." },
    { title: "⑤ 이동 전체를 한 가지 결제수단으로", body: "10/2–3 Osaka Metro 단독 구간은 주유패스 QR을 써요. 이동 중 적용 구간 밖으로 나가거나 JR·사철 등 다른 회사가 섞이면 이 일정에서는 ICOCA로 출발역부터 도착역까지 전부 결제해요. 패스 QR과 ICOCA를 한 이동에서 섞지 않아요." },
  ],
  notes: [
    { title: "JR은 주유패스 대상이 아니에요", body: "오사카 순환선(O), 유메사키선(P), 야마토지선(Q), 한와선(R), 교토선·고베선(A)은 JR West예요. 모든 구간에서 ICOCA 또는 승차권을 써요. 10/1 USJ행도 JR 순환선(O)→유메사키선(P)이므로 ICOCA예요." },
    { title: "노선 경계·운영 회사가 바뀌면 ICOCA", body: "한큐·한신·게이한·긴테쓰·난카이 등 사철은 회사별로 주유패스 적용 구간이 따로 있어요. 목적지가 적용 구간 밖이거나 한 번의 이동에서 회사·운임 경계가 섞이면, 경계에서 나눠 찍지 않고 ICOCA로 전 구간을 결제해요. 난카이 라피트는 특급권도 별도예요." },
    { title: "주유패스 2일권 사용 날짜", body: "10/2–3 연속 이틀에 사용해요. 48시간 이용권처럼 첫 사용 시각부터 계산하지 않으니, QR 화면의 유효 날짜를 확인하고 10/2 개시 전에 사용 시작 안내를 확인해요." },
  ],
  links: [
    { label: "Osaka Metro 노선도 · NUUA", url: "https://metro.nuua.travel/ko/osaka" },
    { label: "주유패스 공식 노선도", url: "https://osaka-amazing-pass.com/kr/service_about_train.html" },
    { label: "구역 밖 이용 FAQ", url: "https://osaka-amazing-pass.com/kr/faq.html" },
    { label: "주유패스 이용 가능한 시설", url: "https://osaka-amazing-pass.com/kr/service_free.html" },
  ],
};
