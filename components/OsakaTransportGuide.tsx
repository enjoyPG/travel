import type { TripTransportGuide, TripTransportGuideLine } from "@/data/trip-types";
import { ReadableText } from "@/components/ReadableText";

function RouteTable({ lines }: { lines: TripTransportGuideLine[] }) {
  return <div className="pass-table-scroll">
    <table className="pass-route-table">
      <thead><tr><th scope="col">노선 기호</th><th scope="col">노선</th><th scope="col">회사</th><th scope="col">주유패스<br />10/2–3</th><th scope="col">결제 방법</th></tr></thead>
      <tbody>{lines.map((line, index) => <tr key={`${line.code}-${line.name}-${index}`}>
        <td><span className={`route-code route-${line.color}`}>{line.code}</span></td>
        <td><strong>{line.name}</strong></td>
        <td>{line.company}</td>
        <td><span className={line.passIncluded ? "route-status is-covered" : "route-status is-excluded"}>{line.passIncluded ? "사용 가능" : "불가"}</span></td>
        <td>{line.payment}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

export function OsakaTransportGuide({ guide }: { guide: TripTransportGuide }) {
  return <section className="osaka-transport-guide" aria-labelledby="transport-guide-title">
    <div className="transport-guide-heading">
      <span className="section-index">PASS &amp; TRAINS</span>
      <h2 id="transport-guide-title">{guide.title}</h2>
      <ReadableText text={guide.intro} className="transport-guide-intro-copy" />
    </div>

    <div className="pass-rule-grid">
      {guide.rules.map((rule, index) => <article key={`${rule.badge}-${index}`}>
        <span className={`pass-rule-mark ${index === 0 ? "is-pass" : index === 1 ? "is-icoca" : "is-joy"}`}>{rule.badge}</span>
        <div><strong>{rule.title}</strong><ReadableText text={rule.body} className="pass-rule-copy" /></div>
      </article>)}
    </div>

    <div className="pass-route-tables">
      {guide.groups.map((group, index) => <section aria-label={group.title} key={`${group.title}-${index}`}>
        <h3>{group.title}</h3>
        <RouteTable lines={group.lines} />
      </section>)}
    </div>

    <div className="transport-howto">
      <h3>{guide.howtoTitle}</h3>
      <ol>
        {guide.howtoSteps.map((step, index) => <li key={`${step.title}-${index}`}><strong>{step.title}</strong><ReadableText text={step.body} className="transport-howto-copy" /></li>)}
      </ol>
    </div>

    <div className="transport-guide-notes">
      {guide.notes.map((note, index) => <div className="transport-guide-note" key={`${note.title}-${index}`}><strong>{note.title}</strong><ReadableText text={note.body} className="transport-guide-note-copy" /></div>)}
      <p className="transport-guide-links">{guide.links.filter((link) => link.label.trim() && link.url.startsWith("https://")).map((link, index) => <a href={link.url} target="_blank" rel="noreferrer" key={`${link.url}-${index}`}>{link.label} <span aria-hidden="true">↗</span></a>)}</p>
    </div>
  </section>;
}
