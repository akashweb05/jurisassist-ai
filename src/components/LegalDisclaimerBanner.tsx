import React, { useState } from 'react';
import { Scale, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export const LegalDisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      aria-label="Legal Disclaimer and Regulatory Notice"
      className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p className="font-medium">
            <span className="font-bold underline decoration-amber-500">Legal Notice:</span> JurisAssist AI provides informational analysis and document navigation assistance. It does <span className="font-semibold">not</span> provide legal advice and does <span className="font-semibold">not</span> establish an attorney-client relationship.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="disclaimer-details"
          className="self-end md:self-auto text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1.5 py-0.5"
        >
          {isExpanded ? (
            <>Less Details <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /></>
          ) : (
            <>Regulatory Guidelines <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" /></>
          )}
        </button>
      </div>

      {isExpanded && (
        <div 
          id="disclaimer-details" 
          className="mt-2 pt-2 border-t border-amber-200/80 dark:border-amber-800/80 text-xs max-w-7xl mx-auto space-y-1.5 leading-relaxed text-amber-800 dark:text-amber-300"
        >
          <p>
            • <strong>Informational Utility:</strong> Contract evaluations, readability scores, and risk classifications are algorithmically generated suggestions intended to assist self-represented individuals and businesses in identifying key terms.
          </p>
          <p>
            • <strong>Confidentiality First:</strong> All text inputs undergo client-side PII redacting prior to external API submission. For sensitive matters, utilize our exportable Lawyer Prep Kit to consult a licensed attorney.
          </p>
          <p>
            • <strong>Statutory Variations:</strong> Contract enforceability varies by state, province, and country (e.g., local tenant protection acts, statutory wage laws). Always verify binding commitments with a qualified legal professional in your jurisdiction.
          </p>
        </div>
      )}
    </aside>
  );
};
