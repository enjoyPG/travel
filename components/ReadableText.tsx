type ReadableTextProps = {
  text: string;
  className?: string;
};

type HighlightKind = "place" | "transit" | "pass" | "food";

const highlightedTerms: Array<{ term: string; kind: HighlightKind }> = [
  ...[
    "Universal Studios Japan", "유니버설 스튜디오 재팬", "유니버셜 스튜디오 재팬",
    "레고랜드 디스커버리 센터 오사카", "레고랜드 디스커버리센터 오사카",
    "레고랜드 디스커버리 센터", "레고랜드 디스커버리센터",
    "오사카성 천수각", "오사카성 고자부네", "오사카 성 천수각", "고베 스마 씨월드",
    "덴포잔 대관람차", "누노비키 허브가든", "누노비키 허브엔", "Kobe Suma Seaworld",
    "간사이 국제공항", "간사이공항역", "간사이 공항", "간사이공항",
    "유니버설시티역", "유니버설시티", "니시쿠조역", "니시쿠조",
    "신이마미야역", "신이마미야", "쓰루하시역", "츠루하시역", "쓰루하시", "츠루하시",
    "오사카코역", "오사카코", "벤텐초역", "벤텐초", "에비스초",
    "스마 씨월드", "스마역", "산노미야", "신고베",
    "오사카성", "고자부네", "쓰텐카쿠", "신세카이", "덴포잔", "산타마리아",
    "소라니와온천", "소라니와 온천", "도톤보리", "돈보리 강 크루즈", "돈보리강", "돈보리 강",
    "헵파이브", "우메다", "난바", "신사이바시", "닛폰바시", "나라 공원", "나라역", "나라현", "고베", "교토", "도쿄", "오사카",
  ].map((term) => ({ term, kind: "place" as const })),
  ...[
    "Osaka Metro", "오사카 메트로", "JR West", "JR 웨스트",
    "JR 오사카 순환선", "JR 유메사키선", "JR 교토선", "JR 고베선", "JR 한와선",
    "오사카 순환선", "유메사키선", "미도스지선", "다니마치선", "센니치마에선",
    "주오선", "한와선", "교토선", "고베선", "공항급행", "라피트",
    "난카이", "Nankai", "한신선", "한큐", "긴테쓰", "Kintetsu", "JR",
  ].map((term) => ({ term, kind: "transit" as const })),
  ...[
    "Kansai One Pass", "간사이 원패스", "주유패스", "조이패스", "ICOCA", "이코카",
  ].map((term) => ({ term, kind: "pass" as const })),
  ...[
    "토마토 오코노미야키", "비프카츠 산도", "인디안 카레", "오코노미야키",
    "타코야키", "모던야키", "네기야키", "이카야키", "야키소바", "쿠시카츠",
    "호르몬 구이", "도테야키", "야키니쿠", "부타만", "키츠네우동", "카스우동",
    "니쿠스이", "테치리", "하코스시", "오므라이스", "카레 우동", "고나몬", "요쇼쿠",
  ].map((term) => ({ term, kind: "food" as const })),
];

const highlightKindByTerm = new Map(highlightedTerms.map(({ term, kind }) => [term.toLocaleLowerCase(), kind]));
const highlightedTermPattern = new RegExp(
  `(${highlightedTerms.map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length).join("|")})`,
  "giu",
);

export function HighlightedText({ text, className = "" }: ReadableTextProps) {
  return <span className={className}>{text.split(highlightedTermPattern).map((part, index) => {
    const kind = highlightKindByTerm.get(part.toLocaleLowerCase());
    return kind
      ? <mark className={`term-highlight term-highlight--${kind}`} key={`${kind}-${index}`}>{part}</mark>
      : part;
  })}</span>;
}

function splitNumberedSteps(text: string) {
  const chunks = text.trim().split(/\s+(?=\d+[.)]\s)/).filter(Boolean);
  return chunks.length > 1 && /^\d+[.)]\s/.test(chunks[0])
    ? chunks.map((chunk) => chunk.replace(/^\d+[.)]\s*/, "").trim())
    : null;
}

function splitParagraphs(text: string) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => line.split(/(?<=[.!?。！？])\s+(?=[^\s])/u).map((sentence) => sentence.trim()).filter(Boolean));
}

export function ReadableText({ text, className = "" }: ReadableTextProps) {
  const steps = splitNumberedSteps(text);

  if (steps) {
    return <ol className={`readable-copy readable-copy-steps ${className}`.trim()}>
      {steps.map((step, index) => <li key={`${index}-${step.slice(0, 24)}`}><HighlightedText text={step} /></li>)}
    </ol>;
  }

  return <div className={`readable-copy ${className}`.trim()}>
    {splitParagraphs(text).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}><HighlightedText text={paragraph} /></p>)}
  </div>;
}
