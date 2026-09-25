import React, { useState } from 'react';
import { 
  Briefcase, 
  Printer, 
  Download, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  FileText, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { LegalDocument, ConsultationPrepKit } from '../types/legal';
import { GeminiService } from '../services/geminiService';

interface LawyerPrepKitProps {
  document: LegalDocument;
}

export const LawyerPrepKit: React.FC<LawyerPrepKitProps> = ({ document }) => {

  const [checklist, setChecklist] = useState(() => {
    // Generate initial checklist from document
    const highRisks = document.clauses.filter(c => c.riskLevel === 'high');
    return [
      { id: '1', item: `Confirm whether Section (${highRisks[0]?.clauseNumber || 'Indemnity'}) violates local consumer protection statutes.`, completed: false, priority: 'Immediate' },
      { id: '2', item: 'Request written redline proposing mutual 30-day notice and liability caps.', completed: false, priority: 'Before Signing' },
      { id: '3', item: 'Verify insurance coverage limits against requested indemnification amounts.', completed: false, priority: 'Before Signing' },
      { id: '4', item: 'Record renewal deadline in calendar with 90-day alert buffer.', completed: false, priority: 'Post-Signing' },
    ];
  });

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const highRisks = document.clauses.filter(c => c.riskLevel === 'high');
    const md = `# JurisAssist AI - Attorney Consultation Dossier
Generated: ${new Date().toLocaleDateString()}
Document: ${document.title} (${document.docType})
Risk Score: ${document.overallRiskScore} / 100

## Executive Brief
${document.summary}

## Top Vulnerabilities Identified
${highRisks.map(c => `- **${c.clauseNumber} (${c.title})**: ${c.riskReason}\n  *Proposed Redline:* ${c.renegotiationTip}`).join('\n\n')}

## Targeted Questions for Legal Counsel
1. Are the indemnification provisions enforceable in our jurisdiction, and how can we insert a mutual liability cap?
2. Does the termination clause provide adequate cure periods, or could the counterparty terminate abruptly?
3. Are the restrictive covenants or IP assignment terms legally overbroad under local statutes?
4. What is the estimated cost of arbitration in the chosen venue compared to standard municipal courts?

## Actionable Next Steps
${checklist.map(c => `- [${c.completed ? 'X' : ' '}] (${c.priority}) ${c.item}`).join('\n')}

---
Notice: JurisAssist AI generates educational dossiers and does not provide formal legal advice.`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `Lawyer_Prep_Kit_${document.title.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const highRisks = document.clauses.filter(c => c.riskLevel === 'high');

  return (
    <section 
      aria-labelledby="prep-kit-title"
      className="space-y-6"
    >
      {/* Top Banner with Action Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <h2 id="prep-kit-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Lawyer Consultation Prep Kit
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Maximize your 30-minute legal consultation. Hand this structured briefing and targeted questionnaire directly to your attorney.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier (.md)</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition shadow-md shadow-indigo-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Dossier Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Dossier Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Confidential Attorney-Client Consultation Brief
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {document.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prepared via JurisAssist AI Client Portal • {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluated Risk</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {document.overallRiskScore} / 100
            </span>
          </div>
        </div>

        {/* 1. Executive Brief for Counsel */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>1. Executive Summary for Counsel</span>
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {document.summary}
          </div>
        </div>

        {/* 2. Top Legal Vulnerabilities & Traps */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>2. Top Contractual Vulnerabilities</span>
          </h4>
          <div className="space-y-3">
            {highRisks.map((clause) => (
              <div key={clause.id} className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 mb-1">
                  <span>[{clause.clauseNumber}] {clause.title}</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    High Risk Exposure
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-2">{clause.riskReason}</p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-0.5">Recommended Redline:</span>
                  <span className="text-slate-800 dark:text-slate-200">{clause.renegotiationTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Targeted Questions to Ask Legal Counsel */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>3. Questions to Ask During Your 30-Minute Consultation</span>
          </h4>
          <div className="space-y-2">
            {[
              'Are the indemnification provisions enforceable in our jurisdiction, and how can we insert a mutual liability cap?',
              'Does the termination clause provide adequate cure periods, or could the counterparty terminate abruptly?',
              'Are the non-compete or intellectual property assignment terms legally overbroad under local employment statutes?',
              'If a dispute occurs, what would typical arbitration in the chosen venue cost relative to standard small claims court?'
            ].map((q, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Actionable Next Steps Checklist */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>4. Actionable Pre-Signing Checklist</span>
          </h4>
          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleChecklist(item.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 text-xs transition ${
                  item.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-slate-500 line-through'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="font-medium">{item.item}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  item.priority === 'Immediate'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {item.priority}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer on Print */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400">
          Generated for informational consultation preparation by JurisAssist AI. Does not constitute formal legal counsel.
        </div>

      </div>
    </section>
  );
};
