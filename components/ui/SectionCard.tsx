"use client";

import { useState } from "react";

interface Props {
  title: string;
  emoji: string;
  modelUsed?: string;
  summary?: string;
  children: React.ReactNode;
  error?: string;
}

export default function SectionCard({ title, emoji, modelUsed, summary, children, error }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <p className="text-red-400 text-sm">This module encountered an error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              {modelUsed && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${modelUsed === "gemini" ? "bg-blue-400" : "bg-orange-400"}`} />
                  {modelUsed === "gemini" ? "Gemini 1.5 Pro" : "Grok-3"}
                </span>
              )}
            </div>
          </div>
        </div>

        {summary && (
          <p className="text-slate-300 mt-4 leading-relaxed">{summary}</p>
        )}

        {summary && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition"
          >
            {expanded ? "Show less" : "Explain this to me simply"}
            <span className="transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "none" }}>↓</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
}

export function WhatThisMeansBox({ text }: { text: string }) {
  return (
    <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg shrink-0">💡</span>
        <div>
          <div className="font-semibold text-indigo-300 text-sm mb-1">What This Means For You</div>
          <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
