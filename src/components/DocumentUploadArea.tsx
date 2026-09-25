import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  RotateCcw,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SAMPLE_CONTRACTS, SampleContract } from '../data/sampleContracts';
import { PiiAnonymizer, AnonymizationResult } from '../services/piiAnonymizer';
import { LegalDocument } from '../types/legal';

interface DocumentUploadAreaProps {
  onAnalyze: (rawText: string, title: string, docType: LegalDocument['docType'], customParties: string[]) => void;
  isLoading: boolean;
}

export const DocumentUploadArea: React.FC<DocumentUploadAreaProps> = ({ onAnalyze, isLoading }) => {
  const [selectedSample, setSelectedSample] = useState<string>('residential-lease');
  const [title, setTitle] = useState<string>('Residential Tenancy Lease Agreement');
  const [docType, setDocType] = useState<LegalDocument['docType']>('Lease Agreement');
  const [content, setContent] = useState<string>(SAMPLE_CONTRACTS[0].content);
  const [partyInput, setPartyInput] = useState<string>('Apex Real Estate Holdings LLC, John Doe');
  const [showSanitizedPreview, setShowSanitizedPreview] = useState<boolean>(false);
  const [anonymizationPreview, setAnonymizationPreview] = useState<AnonymizationResult | null>(() => {
    return PiiAnonymizer.anonymize(SAMPLE_CONTRACTS[0].content, ['Apex Real Estate Holdings LLC', 'John Doe']);
  });

  const handleSampleSelect = (sampleId: string) => {
    setSelectedSample(sampleId);
    const sample = SAMPLE_CONTRACTS.find(s => s.id === sampleId);
    if (sample) {
      setTitle(sample.name);
      setDocType(sample.docType);
      setContent(sample.content);
      const parties = sample.parties.join(', ');
      setPartyInput(parties);
      const partiesArr = sample.parties;
      const res = PiiAnonymizer.anonymize(sample.content, partiesArr);
      setAnonymizationPreview(res);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const partiesArr = partyInput.split(',').map(p => p.trim()).filter(Boolean);
    const res = PiiAnonymizer.anonymize(newContent, partiesArr);
    setAnonymizationPreview(res);
  };

  const handlePartyChange = (partiesStr: string) => {
    setPartyInput(partiesStr);
    const partiesArr = partiesStr.split(',').map(p => p.trim()).filter(Boolean);
    const res = PiiAnonymizer.anonymize(content, partiesArr);
    setAnonymizationPreview(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        handleContentChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const partiesArr = partyInput.split(',').map(p => p.trim()).filter(Boolean);
    onAnalyze(content, title, docType, partiesArr);
  };

  return (
    <section 
      aria-labelledby="upload-section-title"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 id="upload-section-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Select or Paste Legal Document</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Load an authentic contract benchmark or paste your own document for instant AI analysis.
          </p>
        </div>

        {/* 1-Click Preset Benchmark Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Presets:</span>
          {SAMPLE_CONTRACTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleSelect(sample.id)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                selectedSample === sample.id
                  ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {sample.name.split(' ')[0]} {sample.docType === 'NDA' ? 'NDA' : sample.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Title, DocType and Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="doc-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title
            </label>
            <input
              id="doc-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="doc-type-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              id="doc-type-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Contract">Contract</option>
              <option value="Lease Agreement">Lease Agreement</option>
              <option value="NDA">NDA (Non-Disclosure)</option>
              <option value="Terms of Service">Terms of Service</option>
              <option value="Employment">Employment</option>
              <option value="Custom">Custom Document</option>
            </select>
          </div>

          <div>
            <label htmlFor="parties-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Party Names to Anonymize</span>
              <span className="text-[10px] text-slate-400 font-normal">Comma-separated</span>
            </label>
            <input
              id="parties-input"
              type="text"
              value={partyInput}
              onChange={(e) => handlePartyChange(e.target.value)}
              placeholder="e.g. John Doe, Acme Corp"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Text Area with Live PII Redaction Switch */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="contract-content-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Contract Text</span>
              <span className="text-[11px] font-normal text-slate-400">
                ({content.length.toLocaleString()} characters)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <label 
                htmlFor="file-upload-input"
                className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Upload .txt/.md</span>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".txt,.md,.doc,.json"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>

              <span className="text-slate-300 dark:text-slate-700">|</span>

              <button
                type="button"
                onClick={() => setShowSanitizedPreview(!showSanitizedPreview)}
                className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 font-medium transition ${
                  showSanitizedPreview
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {showSanitizedPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showSanitizedPreview ? 'Show Original' : 'Preview PII Redacted'}</span>
              </button>
            </div>
          </div>

          <textarea
            id="contract-content-input"
            rows={8}
            value={showSanitizedPreview && anonymizationPreview ? anonymizationPreview.sanitizedText : content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Paste your legal agreement, lease, NDA, or terms of service here..."
            className="w-full p-3.5 text-xs sm:text-sm font-mono leading-relaxed rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* PII Anonymization Security Shield Bar */}
        {anonymizationPreview && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-slate-900 dark:text-slate-100">PII Privacy Shield Active:</strong>{' '}
                {anonymizationPreview.stats.totalTokensProtected} sensitive identifiers masked
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              {anonymizationPreview.stats.partiesMasked > 0 && (
                <span>Parties: <strong>{anonymizationPreview.stats.partiesMasked}</strong></span>
              )}
              {anonymizationPreview.stats.emailsMasked > 0 && (
                <span>Emails: <strong>{anonymizationPreview.stats.emailsMasked}</strong></span>
              )}
              {anonymizationPreview.stats.phonesMasked > 0 && (
                <span>Phones: <strong>{anonymizationPreview.stats.phonesMasked}</strong></span>
              )}
              {anonymizationPreview.stats.addressesMasked > 0 && (
                <span>Addresses: <strong>{anonymizationPreview.stats.addressesMasked}</strong></span>
              )}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Safe to Process
              </span>
            </div>
          </div>
        )}

        {/* Submit Analyze Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Auditing & Simplifying Clauses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Analyze & Demystify Document</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
