/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document, Page, Text, View, StyleSheet,
} from "@react-pdf/renderer";

// ── Styles ──────────────────────────────────────────────────────────────────

const C = {
  bg:      "#f8f6f2",
  white:   "#ffffff",
  ink:     "#1c1917",
  ink2:    "#57534e",
  ink3:    "#a8a29e",
  rule:    "#e5e2db",
  accent:  "#3b5bdb",
  accentLt:"#eef2ff",
  green:   "#2f9e44",
  greenLt: "#ebfbee",
  amber:   "#e67700",
  amberLt: "#fff3bf",
  red:     "#c92a2a",
  redLt:   "#fff5f5",
};

const S = StyleSheet.create({
  page:        { backgroundColor: C.bg, paddingHorizontal: 40, paddingVertical: 36, fontFamily: "Helvetica" },
  // cover
  coverPage:   { backgroundColor: C.ink, paddingHorizontal: 48, paddingVertical: 56, fontFamily: "Helvetica" },
  coverLabel:  { fontSize: 9, color: "#9ca3af", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 },
  coverTitle:  { fontSize: 28, color: "#ffffff", fontFamily: "Helvetica-Bold", lineHeight: 1.2, marginBottom: 16, maxWidth: 440 },
  coverSub:    { fontSize: 12, color: "#9ca3af", lineHeight: 1.6, maxWidth: 420, marginBottom: 40 },
  coverMeta:   { flexDirection: "row", gap: 24, marginBottom: 8 },
  coverMetaItem:{ fontSize: 10, color: "#6b7280" },
  coverMetaVal: { fontSize: 10, color: "#d1d5db", fontFamily: "Helvetica-Bold" },
  // section
  sectionWrap: { marginBottom: 28, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: C.rule, borderBottomStyle: "solid" },
  moduleLabel: { fontSize: 8, color: C.accent, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Helvetica-Bold", marginBottom: 4 },
  sectionTitle:{ fontSize: 18, color: C.ink, fontFamily: "Helvetica-Bold", letterSpacing: -0.3, marginBottom: 6 },
  summary:     { fontSize: 10, color: C.ink2, lineHeight: 1.7, marginBottom: 14 },
  // cards
  cardRow:     { flexDirection: "row", gap: 8, marginBottom: 10 },
  card:        { flex: 1, backgroundColor: C.white, borderRadius: 6, borderWidth: 1, borderColor: C.rule, borderStyle: "solid", padding: 10 },
  cardLabel:   { fontSize: 7, color: C.ink3, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "Helvetica-Bold", marginBottom: 4 },
  cardValue:   { fontSize: 16, color: C.ink, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  cardBody:    { fontSize: 9, color: C.ink2, lineHeight: 1.5 },
  // label
  label:       { fontSize: 7, color: C.ink3, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "Helvetica-Bold", marginBottom: 6 },
  // body text
  body:        { fontSize: 10, color: C.ink2, lineHeight: 1.65 },
  bodyBold:    { fontSize: 10, color: C.ink, fontFamily: "Helvetica-Bold" },
  // list
  listItem:    { flexDirection: "row", gap: 6, marginBottom: 4 },
  bullet:      { fontSize: 10, color: C.accent, width: 10 },
  listText:    { fontSize: 10, color: C.ink2, lineHeight: 1.5, flex: 1 },
  // chip
  chip:        { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, marginRight: 5, marginBottom: 4 },
  chipText:    { fontSize: 8, fontFamily: "Helvetica-Bold" },
  chipRow:     { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  // callout
  callout:     { backgroundColor: C.accentLt, borderLeftWidth: 3, borderLeftColor: C.accent, borderLeftStyle: "solid", borderRadius: 4, padding: 12, marginTop: 14 },
  calloutLabel:{ fontSize: 8, color: C.accent, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "Helvetica-Bold", marginBottom: 4 },
  calloutText: { fontSize: 10, color: C.ink, lineHeight: 1.65 },
  // score bar bg
  barBg:       { height: 4, backgroundColor: C.rule, borderRadius: 99, marginTop: 4, marginBottom: 10 },
  barFill:     { height: 4, backgroundColor: C.accent, borderRadius: 99 },
  // two col
  twoCol:      { flexDirection: "row", gap: 16, marginBottom: 12 },
  col:         { flex: 1 },
  // tinted box
  greenBox:    { backgroundColor: C.greenLt, borderWidth: 1, borderColor: "#b2f2bb", borderStyle: "solid", borderRadius: 6, padding: 10, marginBottom: 8 },
  redBox:      { backgroundColor: C.redLt,   borderWidth: 1, borderColor: "#ffc9c9", borderStyle: "solid", borderRadius: 6, padding: 10, marginBottom: 8 },
  amberBox:    { backgroundColor: C.amberLt, borderWidth: 1, borderColor: "#ffe066", borderStyle: "solid", borderRadius: 6, padding: 10, marginBottom: 8 },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={S.moduleLabel}>Module {String(num).padStart(2, "0")}</Text>
      <Text style={S.sectionTitle}>{title}</Text>
    </View>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <View style={S.callout}>
      <Text style={S.calloutLabel}>💡 What This Means For You</Text>
      <Text style={S.calloutText}>{text}</Text>
    </View>
  );
}

function BulletList({ items, color = C.accent }: { items: string[]; color?: string }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={S.listItem}>
          <Text style={[S.bullet, { color }]}>→</Text>
          <Text style={S.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function ScoreBarRow({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={S.bodyBold}>{label}</Text>
        <Text style={S.body}>{value}/{max}</Text>
      </View>
      <View style={S.barBg}>
        <View style={[S.barFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

// ── Section renders ──────────────────────────────────────────────────────────

function IdeaDecoder({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={1} title="Idea Decoder" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={S.cardRow}>
        {[
          { l: "Problem",           v: d.problem_statement },
          { l: "Solution",          v: d.solution },
        ].map(({ l, v }) => (
          <View key={l} style={S.card}>
            <Text style={S.cardLabel}>{l}</Text>
            <Text style={S.body}>{v}</Text>
          </View>
        ))}
      </View>
      <View style={S.cardRow}>
        {[
          { l: "Target Customer",   v: d.target_customer },
          { l: "Value Proposition", v: d.value_proposition },
        ].map(({ l, v }) => (
          <View key={l} style={S.card}>
            <Text style={S.cardLabel}>{l}</Text>
            <Text style={S.body}>{v}</Text>
          </View>
        ))}
      </View>
      {d.key_assumptions?.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={S.label}>Key Assumptions</Text>
          <BulletList items={d.key_assumptions} color={C.amber} />
        </View>
      )}
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function MarketSizing({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={2} title="Market Sizing" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={S.cardRow}>
        {[
          { acronym: "TAM", label: "Total Addressable Market", data: d.tam },
          { acronym: "SAM", label: "Serviceable Addressable Market", data: d.sam },
          { acronym: "SOM", label: "Obtainable Market (Yr 1)", data: d.som },
        ].map(({ acronym, label, data }) => (
          <View key={acronym} style={S.card}>
            <Text style={[S.cardLabel, { color: C.accent }]}>{acronym}</Text>
            <Text style={S.cardValue}>{data.value}</Text>
            <Text style={[S.cardLabel, { marginTop: 2 }]}>{label}</Text>
            <Text style={S.cardBody}>{data.explanation}</Text>
          </View>
        ))}
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function CustomerProfiling({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={3} title="Customer Profiles" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      {d.personas?.map((p: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 10 }]}>
          <Text style={S.bodyBold}>{p.name} · {p.occupation} · {p.age_range}</Text>
          <View style={S.twoCol}>
            <View style={S.col}>
              <Text style={[S.label, { color: C.green, marginTop: 8 }]}>Goals</Text>
              <BulletList items={p.goals} color={C.green} />
            </View>
            <View style={S.col}>
              <Text style={[S.label, { color: C.red, marginTop: 8 }]}>Pain Points</Text>
              <BulletList items={p.pain_points} color={C.red} />
            </View>
          </View>
          <Text style={S.label}>Willingness to Pay</Text>
          <Text style={S.body}>{p.willingness_to_pay}</Text>
        </View>
      ))}
      <View style={S.amberBox}>
        <Text style={S.cardLabel}>Your Early Adopter</Text>
        <Text style={S.body}>{d.early_adopter_profile}</Text>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function CompetitorLandscape({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={4} title="Competitor Map" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      {d.competitors?.map((c: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 8 }]}>
          <Text style={S.bodyBold}>{c.name} · {c.type} · {c.threat_level} threat</Text>
          <Text style={[S.body, { marginTop: 3, marginBottom: 6 }]}>{c.description}</Text>
          <View style={S.twoCol}>
            <View style={S.col}>
              <Text style={[S.label, { color: C.green }]}>Strengths</Text>
              <BulletList items={c.strengths} color={C.green} />
            </View>
            <View style={S.col}>
              <Text style={[S.label, { color: C.red }]}>Weaknesses</Text>
              <BulletList items={c.weaknesses} color={C.red} />
            </View>
          </View>
        </View>
      ))}
      <View style={S.greenBox}>
        <Text style={S.cardLabel}>Whitespace Opportunity</Text>
        <Text style={S.body}>{d.whitespace_opportunity}</Text>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function ProblemValidation({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={5} title="Problem Validation Score" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={[S.card, { marginBottom: 12, alignItems: "center", padding: 16 }]}>
        <Text style={{ fontSize: 40, color: C.accent, fontFamily: "Helvetica-Bold" }}>{d.score}</Text>
        <Text style={S.body}>out of 100 · {d.verdict?.replace("_", " ")}</Text>
      </View>
      {d.dimensions?.map((dim: any, i: number) => (
        <ScoreBarRow key={i} label={dim.name} value={dim.score} max={10} />
      ))}
      <View style={S.twoCol}>
        <View style={S.col}>
          <Text style={[S.label, { color: C.green }]}>Evidence For</Text>
          <BulletList items={d.key_evidence_for} color={C.green} />
        </View>
        <View style={S.col}>
          <Text style={[S.label, { color: C.red }]}>Evidence Against</Text>
          <BulletList items={d.key_evidence_against} color={C.red} />
        </View>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function BusinessModel({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={6} title="Business Model Options" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      {d.models?.map((m: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 8, borderColor: m.name === d.recommended_model ? C.accent : C.rule }]}>
          {m.name === d.recommended_model && (
            <Text style={[S.cardLabel, { color: C.accent, marginBottom: 4 }]}>★ Recommended</Text>
          )}
          <Text style={S.bodyBold}>{m.name} · {m.complexity} complexity · {m.estimated_time_to_revenue}</Text>
          <Text style={[S.body, { marginTop: 4, marginBottom: 8 }]}>{m.description}</Text>
          <View style={S.twoCol}>
            <View style={S.col}>
              <Text style={[S.label, { color: C.green }]}>Pros</Text>
              <BulletList items={m.pros} color={C.green} />
            </View>
            <View style={S.col}>
              <Text style={[S.label, { color: C.red }]}>Cons</Text>
              <BulletList items={m.cons} color={C.red} />
            </View>
          </View>
        </View>
      ))}
      <View style={S.amberBox}>
        <Text style={S.cardLabel}>Unit Economics Example</Text>
        <Text style={S.body}>{d.unit_economics_example}</Text>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function GoToMarket({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={7} title="Go-to-Market Playbook" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={[S.card, { backgroundColor: C.accentLt, marginBottom: 12 }]}>
        <Text style={S.cardLabel}>Positioning Statement</Text>
        <Text style={S.body}>{d.positioning_statement}</Text>
      </View>
      <Text style={S.label}>First 90 Days</Text>
      {d.first_90_days?.map((phase: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 8 }]}>
          <Text style={[S.cardLabel, { color: C.accent }]}>{phase.week_range} — {phase.focus}</Text>
          <BulletList items={phase.actions} />
        </View>
      ))}
      <View style={[S.greenBox, { marginTop: 8 }]}>
        <Text style={S.cardLabel}>First Outreach Script</Text>
        <Text style={[S.body, { fontStyle: "italic" }]}>&quot;{d.first_customer_script}&quot;</Text>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function RiskRadar({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={8} title="Risk Radar" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      {d.risks?.map((risk: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 8 }]}>
          <Text style={S.bodyBold}>{risk.title} · {risk.category} · {risk.probability} probability · {risk.impact} impact</Text>
          <Text style={[S.body, { marginVertical: 4 }]}>{risk.description}</Text>
          <Text style={[S.label, { color: C.green }]}>Mitigation</Text>
          <Text style={S.body}>{risk.mitigation}</Text>
        </View>
      ))}
      <View style={S.redBox}>
        <Text style={S.cardLabel}>Biggest Risk</Text>
        <Text style={S.body}>{d.biggest_risk_summary}</Text>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function TrendTiming({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={9} title="Trend & Timing Analysis" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={[S.card, { marginBottom: 12, alignItems: "center", padding: 14 }]}>
        <Text style={{ fontSize: 18, color: C.accent, fontFamily: "Helvetica-Bold" }}>
          {d.timing_verdict?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </Text>
        <Text style={S.body}>{d.market_maturity_stage}</Text>
      </View>
      <View style={S.twoCol}>
        <View style={S.col}>
          <Text style={[S.label, { color: C.green }]}>Tailwinds</Text>
          {d.tailwinds?.map((t: any, i: number) => (
            <View key={i} style={[S.greenBox, { marginBottom: 6 }]}>
              <Text style={S.bodyBold}>{t.trend}</Text>
              <Text style={S.body}>{t.explanation}</Text>
            </View>
          ))}
        </View>
        <View style={S.col}>
          <Text style={[S.label, { color: C.red }]}>Headwinds</Text>
          {d.headwinds?.map((h: any, i: number) => (
            <View key={i} style={[S.redBox, { marginBottom: 6 }]}>
              <Text style={S.bodyBold}>{h.trend}</Text>
              <Text style={S.body}>{h.explanation}</Text>
            </View>
          ))}
        </View>
      </View>
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function InvestorLens({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={10} title="Investor Lens" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={[S.card, { marginBottom: 12, alignItems: "center", padding: 16 }]}>
        <Text style={{ fontSize: 40, color: C.accent, fontFamily: "Helvetica-Bold" }}>{d.vc_attractiveness_score}/10</Text>
        <Text style={S.body}>VC Attractiveness · {d.thesis_fit}</Text>
      </View>
      <View style={S.twoCol}>
        <View style={S.col}>
          <Text style={[S.label, { color: C.green }]}>What VCs Will Love</Text>
          <BulletList items={d.what_vcs_love} color={C.green} />
        </View>
        <View style={S.col}>
          <Text style={[S.label, { color: C.red }]}>Red Flags</Text>
          <BulletList items={d.red_flags} color={C.red} />
        </View>
      </View>
      <Text style={[S.label, { color: C.amber, marginTop: 8 }]}>Questions VCs Will Ask</Text>
      {d.questions_vcs_will_ask?.map((q: string, i: number) => (
        <View key={i} style={S.listItem}>
          <Text style={[S.bullet, { color: C.amber }]}>{i + 1}.</Text>
          <Text style={S.listText}>{q}</Text>
        </View>
      ))}
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

function DigitalMarketing({ d }: { d: any }) {
  return (
    <View style={S.sectionWrap}>
      <SectionHeader num={11} title="Digital Marketing Strategy" />
      <Text style={S.summary}>{d.plain_english_summary}</Text>
      <View style={S.cardRow}>
        <View style={S.card}>
          <Text style={S.cardLabel}>Bootstrapped Monthly Budget</Text>
          <Text style={S.cardValue}>{d.total_monthly_budget_estimate?.bootstrapped}</Text>
        </View>
        <View style={S.card}>
          <Text style={S.cardLabel}>Growth Stage Budget</Text>
          <Text style={[S.cardValue, { color: C.accent }]}>{d.total_monthly_budget_estimate?.growth_stage}</Text>
        </View>
      </View>
      <Text style={[S.body, { marginBottom: 12 }]}>{d.total_monthly_budget_estimate?.breakdown_note}</Text>
      {d.recommended_channels?.map((ch: any, i: number) => (
        <View key={i} style={[S.card, { marginBottom: 8 }]}>
          <Text style={S.bodyBold}>{ch.platform} — {ch.campaign_type}</Text>
          <Text style={[S.body, { marginVertical: 4 }]}>{ch.why_this_platform}</Text>
          <View style={S.cardRow}>
            {[
              { l: "CPC", v: ch.estimated_cpc },
              { l: "CPM", v: ch.estimated_cpm },
              { l: "CPA", v: ch.estimated_cpa },
            ].map(({ l, v }) => (
              <View key={l} style={[S.card, { flex: 1 }]}>
                <Text style={S.cardLabel}>{l}</Text>
                <Text style={S.bodyBold}>{v}</Text>
              </View>
            ))}
          </View>
          <Text style={S.label}>Recommended Budget</Text>
          <Text style={S.body}>{ch.monthly_budget_range?.recommended}</Text>
        </View>
      ))}
      <Text style={[S.label, { marginTop: 8 }]}>Key Metrics to Track</Text>
      <BulletList items={d.key_metrics_to_track ?? []} />
      <Callout text={d.what_this_means_for_you} />
    </View>
  );
}

// ── Main Document ─────────────────────────────────────────────────────────────

export function buildReportDocument(report: Record<string, any>) {
  return <ReportDocument report={report} />;
}

export function ReportDocument({ report }: { report: Record<string, any> }) {
  const modules = report.modules ?? {};
  const idea = modules["01-idea-decoder"]?.result;
  const pv = modules["05-problem-validation"]?.result;

  const generatedDate = new Date(report.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Document title="MarketMind AI Report" author="MarketMind AI">
      {/* Cover page */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverLabel}>MarketMind AI · Market Research Report</Text>
        <Text style={S.coverTitle}>
          {idea?.plain_english_summary?.slice(0, 120) ?? report.idea_text?.slice(0, 120)}
        </Text>
        <Text style={S.coverSub}>
          {idea?.value_proposition ?? ""}
        </Text>
        <View style={S.coverMeta}>
          <View>
            <Text style={S.coverMetaItem}>Industry</Text>
            <Text style={S.coverMetaVal}>{idea?.industry ?? report.industry ?? "—"}</Text>
          </View>
          <View>
            <Text style={S.coverMetaItem}>Geography</Text>
            <Text style={S.coverMetaVal}>{idea?.geography ?? report.geography ?? "—"}</Text>
          </View>
          {pv && (
            <View>
              <Text style={S.coverMetaItem}>Validation Score</Text>
              <Text style={S.coverMetaVal}>{pv.score}/100</Text>
            </View>
          )}
          <View>
            <Text style={S.coverMetaItem}>Generated</Text>
            <Text style={S.coverMetaVal}>{generatedDate}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 9, color: "#4b5563", marginTop: 40 }}>
          This report was generated by MarketMind AI. All analysis is AI-generated and should be validated with primary research before making major business decisions.
        </Text>
      </Page>

      {/* Report pages */}
      <Page size="A4" style={S.page} wrap>
        {modules["01-idea-decoder"]?.result && <IdeaDecoder d={modules["01-idea-decoder"].result} />}
        {modules["02-market-sizing"]?.result && <MarketSizing d={modules["02-market-sizing"].result} />}
        {modules["03-customer-profiling"]?.result && <CustomerProfiling d={modules["03-customer-profiling"].result} />}
        {modules["04-competitor-landscape"]?.result && <CompetitorLandscape d={modules["04-competitor-landscape"].result} />}
        {modules["05-problem-validation"]?.result && <ProblemValidation d={modules["05-problem-validation"].result} />}
        {modules["06-business-model"]?.result && <BusinessModel d={modules["06-business-model"].result} />}
        {modules["07-go-to-market"]?.result && <GoToMarket d={modules["07-go-to-market"].result} />}
        {modules["08-risk-radar"]?.result && <RiskRadar d={modules["08-risk-radar"].result} />}
        {modules["09-trend-timing"]?.result && <TrendTiming d={modules["09-trend-timing"].result} />}
        {modules["10-investor-lens"]?.result && <InvestorLens d={modules["10-investor-lens"].result} />}
        {modules["11-digital-marketing"]?.result && <DigitalMarketing d={modules["11-digital-marketing"].result} />}
      </Page>
    </Document>
  );
}
