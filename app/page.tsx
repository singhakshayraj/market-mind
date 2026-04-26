"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [geography, setGeography] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length < 10) return;
    setLoading(true);
    const params = new URLSearchParams({
      idea: idea.trim(),
      ...(geography && { geography }),
      ...(industry && { industry }),
    });
    router.push(`/analyse?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-300 text-sm font-medium">AI-Powered Market Research</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          MarketMind <span className="text-indigo-400">AI</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Describe your business idea in plain English.
          <br />
          Get MBA-level market research in under 3 minutes — free.
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder="e.g. I want to build an app that connects freelance truck drivers with small businesses that need same-day delivery in tier-2 Indian cities. The idea is that drivers waste 30–40% of their time with empty trucks on return trips, and small businesses pay too much for courier services..."
              className="w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-5 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-base leading-relaxed"
              rows={6}
              maxLength={2000}
            />
            <span className="absolute bottom-3 right-4 text-slate-500 text-xs">{charCount}/2000</span>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              placeholder="Target geography (optional)"
              className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Industry category (optional)"
              className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={idea.trim().length < 10 || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl py-4 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting analysis...
              </>
            ) : (
              "Analyse My Idea"
            )}
          </button>
        </form>

        {/* Feature highlights */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "10 Analysis Modules", sub: "All in one report" },
            { label: "Under 3 Minutes", sub: "Full report generated" },
            { label: "Plain English", sub: "No MBA required" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800/30 rounded-xl p-4">
              <div className="text-white font-semibold text-sm">{item.label}</div>
              <div className="text-slate-400 text-xs mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
