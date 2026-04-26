import { z } from "zod";

// Module 1 — Idea Decoder
export const IdeaDecoderSchema = z.object({
  plain_english_summary: z.string(),
  problem_statement: z.string(),
  solution: z.string(),
  target_customer: z.string(),
  value_proposition: z.string(),
  industry: z.string(),
  geography: z.string(),
  stage: z.string(),
  key_assumptions: z.array(z.string()),
  what_this_means_for_you: z.string(),
});
export type IdeaDecoder = z.infer<typeof IdeaDecoderSchema>;

// Module 2 — Market Sizing
export const MarketSizingSchema = z.object({
  plain_english_summary: z.string(),
  tam: z.object({ value: z.string(), explanation: z.string() }),
  sam: z.object({ value: z.string(), explanation: z.string() }),
  som: z.object({ value: z.string(), explanation: z.string() }),
  methodology: z.string(),
  data_sources: z.array(z.string()),
  confidence_level: z.enum(["low", "medium", "high"]),
  what_this_means_for_you: z.string(),
});
export type MarketSizing = z.infer<typeof MarketSizingSchema>;

// Module 3 — Customer Profiling
export const CustomerProfilingSchema = z.object({
  plain_english_summary: z.string(),
  personas: z.array(
    z.object({
      name: z.string(),
      age_range: z.string(),
      occupation: z.string(),
      goals: z.array(z.string()),
      pain_points: z.array(z.string()),
      where_to_find_them: z.array(z.string()),
      what_they_read_watch: z.array(z.string()),
      willingness_to_pay: z.string(),
    })
  ),
  early_adopter_profile: z.string(),
  what_this_means_for_you: z.string(),
});
export type CustomerProfiling = z.infer<typeof CustomerProfilingSchema>;

// Module 4 — Competitor Landscape
export const CompetitorLandscapeSchema = z.object({
  plain_english_summary: z.string(),
  market_maturity: z.enum(["emerging", "growing", "mature", "declining"]),
  competitors: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["direct", "indirect", "substitute"]),
      description: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      estimated_pricing: z.string(),
      threat_level: z.enum(["low", "medium", "high"]),
      what_you_can_learn_from_them: z.string(),
      url: z.string().optional(),
    })
  ),
  whitespace_opportunity: z.string(),
  what_this_means_for_you: z.string(),
});
export type CompetitorLandscape = z.infer<typeof CompetitorLandscapeSchema>;

// Module 5 — Problem Validation Score
export const ProblemValidationSchema = z.object({
  plain_english_summary: z.string(),
  score: z.number().min(0).max(100),
  verdict: z.enum(["weak", "moderate", "strong", "very_strong"]),
  dimensions: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(10),
      reasoning: z.string(),
    })
  ),
  key_evidence_for: z.array(z.string()),
  key_evidence_against: z.array(z.string()),
  what_this_means_for_you: z.string(),
});
export type ProblemValidation = z.infer<typeof ProblemValidationSchema>;

// Module 6 — Business Model Options
export const BusinessModelSchema = z.object({
  plain_english_summary: z.string(),
  models: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
      example_companies: z.array(z.string()),
      estimated_time_to_revenue: z.string(),
      complexity: z.enum(["low", "medium", "high"]),
    })
  ),
  recommended_model: z.string(),
  recommendation_reason: z.string(),
  unit_economics_example: z.string(),
  what_this_means_for_you: z.string(),
});
export type BusinessModel = z.infer<typeof BusinessModelSchema>;

// Module 7 — Go-to-Market Playbook
export const GoToMarketSchema = z.object({
  plain_english_summary: z.string(),
  positioning_statement: z.string(),
  first_90_days: z.array(
    z.object({
      week_range: z.string(),
      focus: z.string(),
      actions: z.array(z.string()),
    })
  ),
  channels: z.array(
    z.object({
      channel: z.string(),
      why: z.string(),
      how_to_start: z.string(),
      expected_outcome: z.string(),
    })
  ),
  first_customer_script: z.string(),
  key_message: z.string(),
  what_this_means_for_you: z.string(),
});
export type GoToMarket = z.infer<typeof GoToMarketSchema>;

// Module 8 — Risk Radar
export const RiskRadarSchema = z.object({
  plain_english_summary: z.string(),
  overall_risk_level: z.enum(["low", "medium", "high", "very_high"]),
  risks: z.array(
    z.object({
      category: z.enum([
        "market",
        "regulatory",
        "operational",
        "competitive",
        "financial",
        "technical",
      ]),
      title: z.string(),
      description: z.string(),
      probability: z.enum(["low", "medium", "high"]),
      impact: z.enum(["low", "medium", "high"]),
      mitigation: z.string(),
    })
  ),
  biggest_risk_summary: z.string(),
  what_this_means_for_you: z.string(),
});
export type RiskRadar = z.infer<typeof RiskRadarSchema>;

// Module 9 — Trend & Timing Analysis
export const TrendTimingSchema = z.object({
  plain_english_summary: z.string(),
  timing_verdict: z.enum(["too_early", "good_timing", "peak_timing", "late"]),
  tailwinds: z.array(
    z.object({ trend: z.string(), explanation: z.string() })
  ),
  headwinds: z.array(
    z.object({ trend: z.string(), explanation: z.string() })
  ),
  market_maturity_stage: z.string(),
  notable_recent_developments: z.array(z.string()),
  data_sources: z.array(z.string()),
  what_this_means_for_you: z.string(),
});
export type TrendTiming = z.infer<typeof TrendTimingSchema>;

// Module 10 — Investor Lens
export const InvestorLensSchema = z.object({
  plain_english_summary: z.string(),
  vc_attractiveness_score: z.number().min(0).max(10),
  thesis_fit: z.string(),
  what_vcs_love: z.array(z.string()),
  red_flags: z.array(z.string()),
  questions_vcs_will_ask: z.array(z.string()),
  comparable_funded_companies: z.array(
    z.object({
      name: z.string(),
      funding: z.string(),
      relevance: z.string(),
    })
  ),
  bootstrappable: z.boolean(),
  bootstrappable_reason: z.string(),
  what_this_means_for_you: z.string(),
});
export type InvestorLens = z.infer<typeof InvestorLensSchema>;

// Module 11 — Digital Marketing Strategy
export const DigitalMarketingSchema = z.object({
  plain_english_summary: z.string(),
  recommended_channels: z.array(z.object({
    platform: z.string(),
    why_this_platform: z.string(),
    campaign_type: z.string(),
    monthly_budget_range: z.object({
      minimum: z.string(),
      recommended: z.string(),
      scale: z.string(),
    }),
    estimated_cpc: z.string(),
    estimated_cpm: z.string(),
    estimated_cpa: z.string(),
    targeting_strategy: z.string(),
    creative_strategy: z.string(),
    expected_roas: z.string(),
    time_to_results: z.string(),
  })),
  launch_campaign_plan: z.object({
    phase_1: z.object({ name: z.string(), budget: z.string(), objective: z.string(), actions: z.array(z.string()) }),
    phase_2: z.object({ name: z.string(), budget: z.string(), objective: z.string(), actions: z.array(z.string()) }),
    phase_3: z.object({ name: z.string(), budget: z.string(), objective: z.string(), actions: z.array(z.string()) }),
  }),
  funnel_breakdown: z.object({
    awareness: z.string(),
    consideration: z.string(),
    conversion: z.string(),
    retention: z.string(),
  }),
  total_monthly_budget_estimate: z.object({
    bootstrapped: z.string(),
    growth_stage: z.string(),
    breakdown_note: z.string(),
  }),
  organic_strategy: z.string(),
  key_metrics_to_track: z.array(z.string()),
  common_mistakes_to_avoid: z.array(z.string()),
  what_this_means_for_you: z.string(),
});
export type DigitalMarketing = z.infer<typeof DigitalMarketingSchema>;

// Assembled report type
export interface FullReport {
  id: string;
  created_at: string;
  idea_text: string;
  geography?: string;
  industry?: string;
  modules: {
    "01-idea-decoder"?: { result: IdeaDecoder; modelUsed: string; error?: string };
    "02-market-sizing"?: { result: MarketSizing; modelUsed: string; error?: string };
    "03-customer-profiling"?: { result: CustomerProfiling; modelUsed: string; error?: string };
    "04-competitor-landscape"?: { result: CompetitorLandscape; modelUsed: string; error?: string };
    "05-problem-validation"?: { result: ProblemValidation; modelUsed: string; error?: string };
    "06-business-model"?: { result: BusinessModel; modelUsed: string; error?: string };
    "07-go-to-market"?: { result: GoToMarket; modelUsed: string; error?: string };
    "08-risk-radar"?: { result: RiskRadar; modelUsed: string; error?: string };
    "09-trend-timing"?: { result: TrendTiming; modelUsed: string; error?: string };
    "10-investor-lens"?: { result: InvestorLens; modelUsed: string; error?: string };
    "11-digital-marketing"?: { result: DigitalMarketing; modelUsed: string; error?: string };
  };
}
