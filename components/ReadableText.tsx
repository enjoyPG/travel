type ReadableTextProps = {
  text: string;
  className?: string;
};

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
      {steps.map((step, index) => <li key={`${index}-${step.slice(0, 24)}`}>{step}</li>)}
    </ol>;
  }

  return <div className={`readable-copy ${className}`.trim()}>
    {splitParagraphs(text).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}
  </div>;
}
