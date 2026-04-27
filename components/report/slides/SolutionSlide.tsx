import { SlideFooter } from "./ProblemSlide";
import type { SolutionContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: SolutionContent;
}

export default function SolutionSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <p style={{ fontSize: "clamp(11px,1.5vw,14px)", fontWeight: 600, color: "#111827", marginBottom: 12 }}>{content.solution_statement}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>Before ✗</div>
            {content.before.map((b, i) => (
              <div key={i} style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#EF4444", marginBottom: 4 }}>✗  {b}</div>
            ))}
          </div>
          <div style={{ fontSize: "clamp(14px,2vw,22px)", color: "#9CA3AF", paddingTop: 20, alignSelf: "center" }}>→</div>
          <div>
            <div style={{ fontSize: "clamp(10px,1.4vw,13px)", fontWeight: 700, color: "#10B981", marginBottom: 6 }}>After ✓</div>
            {content.after.map((a, i) => (
              <div key={i} style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#10B981", marginBottom: 4 }}>✓  {a}</div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "7px 12px", background: "#FF9933", borderRadius: 6, textAlign: "center" }}>
          <span style={{ fontSize: "clamp(9px,1.3vw,12px)", fontWeight: 700, color: "#111827" }}>⭐ {content.key_differentiator}</span>
        </div>
      </div>
      <SlideFooter num={2} />
    </div>
  );
}
