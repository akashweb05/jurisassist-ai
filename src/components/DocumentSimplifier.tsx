import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Search,
  CheckSquare,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { LegalDocument, ClauseAnalysis, RiskLevel } from '../types/legal';

interface DocumentSimplifierProps {
  document: LegalDocument;
}

export const DocumentSimplifier: React.FC<DocumentSimplifierProps> = ({ document }) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'plain-first' | 'original'>('side-by-side');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredClauses = document.clauses.filter(clause => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      clause.title.toLowerCase().includes(q) ||
      clause.clauseNumber.toLowerCase().includes(q) ||
      clause.plainEnglishExplanation.toLowerCase().includes(q) ||
      clause.originalText.toLowerCase().includes(q)
    );
  });

  const handleCopyExplanation = (clause: ClauseAnalysis) => {
    navigator.clipboard.writeText(`${clause.title} (${clause.clauseNumber}):\n${clause.plainEnglishExplanation}`);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3" /> High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Moderate Risk
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Standard
          </span>
        );
    }
  };

  return (
    <section 
      aria-labelledby="simplifier-section-title"
      className="space-y-6"
    >
      {/* Readability & Executive Demystification Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {document.docType}
              </span>
              <span className="text-xs text-slate-400">Audited {document.createdAt}</span>
            </div>
            <h2 id="simplifier-section-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {document.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {document.summary}
            </p>
          </div>

          {/* Readability Score Gauges */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shrink-0">
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Reading Level</p>
              <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                Grade {document.readability.fleschKincaidGrade}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {document.readability.fleschKincaidGrade > 12 ? 'Heavy Legalese' : 'Accessible'}
              </p>
            </div>
            <div className="text-center px-2 border-x border-slate-200 dark:border-slate-700">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Reading Ease</p>
              <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {document.readability.fleschReadingEase}/100
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {document.readability.fleschReadingEase < 40 ? 'Difficult' : 'Easy'}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Legalese Density</p>
              <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                {document.readability.legaleseDensityPercent}%
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Archaic terms
              </p>
            </div>
          </div>
        </div>

        {/* Key Rights vs Key Obligations Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Your Key Rights & Protections</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
              {document.keyRights.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5 mb-2.5">
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Your Mandatory Obligations</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-950 dark:text-blue-200">
              {document.keyObligations.map((o, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold shrink-0">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Clause Navigator & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search clauses or terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* View Mode Switcher */}
        <div 
          role="radiogroup" 
          aria-label="Clause Display Layout"
          className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto text-xs"
        >
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'side-by-side'}
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'plain-first'}
            onClick={() => setViewMode('plain-first')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              viewMode === 'plain-first'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Plain English Focus
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'original'}
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              viewMode === 'original'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Original Legalese
          </button>
        </div>
      </div>

      {/* Clause Cards List */}
      <div className="space-y-4">
        {filteredClauses.map((clause) => (
          <article
            key={clause.id}
            aria-labelledby={`clause-heading-${clause.id}`}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {clause.clauseNumber}
                </span>
                <h3 id={`clause-heading-${clause.id}`} className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {clause.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {clause.category}
                </span>
                {getRiskBadge(clause.riskLevel)}
                <button
                  type="button"
                  onClick={() => handleCopyExplanation(clause)}
                  title="Copy plain explanation"
                  aria-label={`Copy plain English explanation of ${clause.title}`}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
                >
                  {copiedId === clause.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Layout Rendering based on viewMode */}
            {viewMode === 'side-by-side' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Left: Original Legalese */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Original Contract Clause</span>
                  </div>
                  <p>{clause.originalText}</p>
                </div>

                {/* Right: Plain English Breakdown */}
                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/60 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Plain English (What it means for you)</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {clause.plainEnglishExplanation}
                    </p>
                  </div>

                  {clause.riskLevel !== 'low' && (
                    <div className="mt-3 pt-2.5 border-t border-blue-100 dark:border-blue-900/40 text-xs">
                      <p className="text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Warning: {clause.riskReason}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1">
                        <strong>Renegotiation Strategy:</strong> {clause.renegotiationTip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'plain-first' && (
              <div className="mt-3 p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {clause.plainEnglishExplanation}
                </p>
                {clause.riskLevel !== 'low' && (
                  <div className="mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-xs space-y-1">
                    <p className="text-rose-700 dark:text-rose-300 font-medium">
                      ⚠️ <strong>Risk Flag:</strong> {clause.riskReason}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      💡 <strong>Counter-proposal:</strong> {clause.renegotiationTip}
                    </p>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'original' && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
                <p>{clause.originalText}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
