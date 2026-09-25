import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { GeminiService } from '../services/geminiService';
import { DocumentComparisonResult, ComparisonDiffClause } from '../types/legal';

export const ContractComparator: React.FC = () => {
  const [docAName, setDocAName] = useState<string>('Version 1 (Original Aggressive Lease)');
  const [docBName, setDocBName] = useState<string>('Version 2 (Tenant-Friendly Revision)');
  const [docAText, setDocAText] = useState<string>(SAMPLE_CONTRACTS[0].content);
  const [docBText, setDocBText] = useState<string>(SAMPLE_CONTRACTS[0].revisedVersion || '');
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<DocumentComparisonResult | null>(() => {
    // Initial pre-computed comparison for instant demonstration
    return null;
  });

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_CONTRACTS.find(s => s.id === sampleId);
    if (sample && sample.revisedVersion) {
      setDocAName(`${sample.name} (Original)`);
      setDocBName(`${sample.name} (Fair Revision)`);
      setDocAText(sample.content);
      setDocBText(sample.revisedVersion);
      setComparisonResult(null);
    }
  };

  const handleRunComparison = async () => {
    if (!docAText.trim() || !docBText.trim()) return;
    setIsComparing(true);
    try {
      const { comparison } = await GeminiService.compareDocuments(docAText, docBText, docAName, docBName);
      setComparisonResult(comparison);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <section 
      aria-labelledby="comparator-title"
      className="space-y-6"
    >
      {/* Overview & Benchmark Loader */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 id="comparator-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Bilateral Contract & Policy Comparator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Compare contract drafts or evaluate proposed counter-offers against standard balanced benchmarks to spot subtle shifts in liability.
            </p>
          </div>

          {/* Quick preset loaders */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1">Load Pair:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('residential-lease')}
              className="text-xs px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
            >
              Lease (Original vs Fair)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('freelance-contractor')}
              className="text-xs px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
            >
              Freelance (Original vs Balanced)
            </button>
          </div>
        </div>

        {/* Two Document Editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Doc A */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="doc-a-text" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document A (Baseline / Original)
              </label>
              <input
                type="text"
                value={docAName}
                onChange={(e) => setDocAName(e.target.value)}
                className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              />
            </div>
            <textarea
              id="doc-a-text"
              rows={8}
              value={docAText}
              onChange={(e) => setDocAText(e.target.value)}
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Doc B */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="doc-b-text" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document B (Proposed Revision / Counter)
              </label>
              <input
                type="text"
                value={docBName}
                onChange={(e) => setDocBName(e.target.value)}
                className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
              />
            </div>
            <textarea
              id="doc-b-text"
              rows={8}
              value={docBText}
              onChange={(e) => setDocBText(e.target.value)}
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleRunComparison}
            disabled={isComparing || !docAText.trim() || !docBText.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {isComparing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Comparing Provisions & Shifting Balances...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Bilateral Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Executive Comparison Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="md:col-span-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  Divergence Analysis
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Fairness & Obligation Shift
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {comparisonResult.summaryOfDifferences}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-center items-center text-center">
                <p className="text-xs font-semibold text-slate-500">Document Similarity</p>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  {comparisonResult.similarityScore}%
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Scale className="w-3.5 h-3.5" />
                  <span>
                    {comparisonResult.overallFairnessShift === 'favors_doc_b' ? 'Protections Improved' : 'Requires Review'}
                  </span>
                </div>
              </div>
            </div>

            {/* Critical Alerts if any */}
            {comparisonResult.criticalAlerts.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
                <p className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Critical Divergence Warnings:</span>
                </p>
                <ul className="space-y-1 text-rose-900 dark:text-rose-200">
                  {comparisonResult.criticalAlerts.map((alert, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Clause-by-Clause Differences */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Section-by-Section Comparison ({comparisonResult.clauseDiffs.length} clauses evaluated)</span>
            </h3>

            {comparisonResult.clauseDiffs.map((diff, idx) => {
              const isModified = diff.changeType === 'modified';
              const isMoreFavorable = diff.impactOnUser === 'more_favorable';
              const isLessFavorable = diff.impactOnUser === 'less_favorable';

              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition ${
                    isMoreFavorable
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : isLessFavorable
                      ? 'border-rose-200 dark:border-rose-900/60'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {diff.clauseNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {diff.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {diff.changeType}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isMoreFavorable
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : isLessFavorable
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isMoreFavorable ? 'Beneficial Shift' : isLessFavorable ? 'Higher Risk' : 'Neutral Change'}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {diff.explanation}
                  </p>

                  {/* Side-by-side text difference */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        {comparisonResult.docAName}
                      </span>
                      <p>{diff.docAContent}</p>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs font-mono ${
                      isMoreFavorable 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200' 
                        : isLessFavorable
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}>
                      <span className="text-[10px] uppercase font-bold block mb-1 opacity-70">
                        {comparisonResult.docBName}
                      </span>
                      <p>{diff.docBContent}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
