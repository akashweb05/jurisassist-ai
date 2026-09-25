import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Filter, 
  ArrowUpRight, 
  Lightbulb, 
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { LegalDocument, ClauseAnalysis, RiskLevel, ClauseCategory } from '../types/legal';

interface RiskRadarProps {
  document: LegalDocument;
  onNavigateToClause?: (clauseId: string) => void;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ document }) => {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const highRisks = document.clauses.filter(c => c.riskLevel === 'high');
  const mediumRisks = document.clauses.filter(c => c.riskLevel === 'medium');
  const lowRisks = document.clauses.filter(c => c.riskLevel === 'low');

  const categories = Array.from(new Set(document.clauses.map(c => c.category)));

  const filteredClauses = document.clauses.filter(c => {
    if (selectedRiskFilter !== 'all' && c.riskLevel !== selectedRiskFilter) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
    if (score >= 35) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
  };

  return (
    <section 
      aria-labelledby="risk-radar-heading"
      className="space-y-6"
    >
      {/* Risk Index Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <h2 id="risk-radar-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Contract Risk & Obligations Radar
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Algorithmic scanning for hidden liability traps, one-sided termination triggers, forfeiture penalties, and overbroad restrictive covenants.
            </p>
          </div>

          {/* Overall Risk Score Badge */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 shrink-0 ${getScoreColor(document.overallRiskScore)}`}>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Aggregate Risk Index</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{document.overallRiskScore}</span>
                <span className="text-sm font-semibold opacity-70">/ 100</span>
              </div>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs">
              {document.overallRiskScore >= 60 ? 'Critical Attention' : document.overallRiskScore >= 35 ? 'Moderate Exposure' : 'Low Exposure'}
            </div>
          </div>
        </div>

        {/* Severity Count Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'high' ? 'all' : 'high')}
            aria-pressed={selectedRiskFilter === 'high'}
            className={`p-3.5 rounded-xl border text-left transition ${
              selectedRiskFilter === 'high'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 ring-2 ring-rose-400'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> High Risk Traps
              </span>
              <span className="text-lg font-extrabold text-rose-700 dark:text-rose-400">{highRisks.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Unlimited indemnity, unilateral termination, forfeiture
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRiskFilter(selectedRiskFilter === 'medium' ? 'all' : 'medium')}
            aria-pressed={selectedRiskFilter === 'medium'}
            className={`p-3.5 rounded-xl border text-left transition ${
              selectedRiskFilter === 'medium'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Moderate Exposure
              </span>
              <span className="text-lg font-extrabold text-amber-700 dark:text-amber-400">{mediumRisks.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Warranty disclaimers, Net 90 payment, maintenance
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRiskFilter('all')}
            aria-pressed={selectedRiskFilter === 'all'}
            className={`p-3.5 rounded-xl border text-left transition ${
              selectedRiskFilter === 'all'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-400'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Standard Provisions
              </span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{lowRisks.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Standard commercial terms with balanced mutual rights
            </p>
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`text-xs px-2.5 py-1 rounded-lg border font-medium shrink-0 transition ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({document.clauses.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flagged Clause Risk Cards */}
      <div className="space-y-4">
        {filteredClauses.map((clause) => {
          const isHigh = clause.riskLevel === 'high';
          const isMedium = clause.riskLevel === 'medium';

          return (
            <div
              key={clause.id}
              className={`rounded-2xl border p-5 shadow-xs transition ${
                isHigh
                  ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : isMedium
                  ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isHigh
                      ? 'bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100'
                      : isMedium
                      ? 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {clause.clauseNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {clause.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {clause.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isHigh
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : isMedium
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {clause.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Original snippet */}
              <div className="mt-3 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                <p>{clause.originalText}</p>
              </div>

              {/* Risk Breakdown & Strategic Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>The Legal Trap / Vulnerability</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {clause.riskReason}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-xs">
                  <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Renegotiation Strategy & Redline</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {clause.renegotiationTip}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
