import { SlideFooter } from "./ProblemSlide";
import type { RiskContent } from "@/lib/schemas/12-pitch-deck";

interface Props {
  title: string;
  subtitle: string | null;
  content: RiskContent;
}

const sevColor = (s: string) =>
  s === "high" ? "#EF4444" : s === "medium" ? "#F59E0B" : "#10B981";

export default function RiskSlide({ title, subtitle, content }: Props) {
  return (
    <div className="slide-inner">
      <div className="slide-accent-bar" />
      <div className="slide-body">
        <h2 className="slide-title">{title}</h2>
        {subtitle && <p className="slide-subtitle">{subtitle}</p>}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12, fontSize: "clamp(8px,1.1vw,11px)" }}>
          <thead>
            <tr>
              {["Risk", "Severity", "Mitigation"].map((h) => (
                <th key={h} style={{ background: "#111827", color: "#fff", padding: "5px 8px", textAlign: "left", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.risks.map((risk, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#F3F4F6" }}>
                <td style={{ padding: "6px 8px", fontWeight: 700, color: "#111827", border: "1px solid #E5E7EB", width: "35%" }}>{risk.risk}</td>
                <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", background: sevColor(risk.severity), color: "#fff", fontWeight: 700, textAlign: "center", width: "15%" }}>
                  {risk.severity.toUpperCase()}
                </td>
                <td style={{ padding: "6px 8px", color: "#6B7280", border: "1px solid #E5E7EB", width: "50%" }}>{risk.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          <div style={{ width: 4, background: "#1A56DB", borderRadius: "4px 0 0 4px" }} />
          <div style={{ background: "#EFF6FF", padding: "6px 10px", borderRadius: "0 4px 4px 0", flex: 1 }}>
            <span style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#6B7280", fontStyle: "italic" }}>{content.biggest_risk_acknowledged}</span>
          </div>
        </div>
      </div>
      <SlideFooter num={8} />
    </div>
  );
}
