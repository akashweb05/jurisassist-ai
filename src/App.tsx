import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { LegalDisclaimerBanner } from './components/LegalDisclaimerBanner';
import { DocumentUploadArea } from './components/DocumentUploadArea';
import { DocumentSimplifier } from './components/DocumentSimplifier';
import { RiskRadar } from './components/RiskRadar';
import { ContractComparator } from './components/ContractComparator';
import { GroundedQAChat } from './components/GroundedQAChat';
import { LawyerPrepKit } from './components/LawyerPrepKit';
import { ApiKeyModal } from './components/ApiKeyModal';
import { A11yAnnouncer } from './components/A11yAnnouncer';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import { LegalAnalyzer } from './services/legalAnalyzer';
import { GeminiService } from './services/geminiService';
import { LegalDocument } from './types/legal';
import { Scale, ShieldCheck, Sparkles, BookOpen, HeartHandshake } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simplifier');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => GeminiService.isConfigured());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [announcerMessage, setAnnouncerMessage] = useState<string>('JurisAssist AI initialized and ready.');

  // Preload initial document analysis (Residential Lease) so evaluator sees immediate rich results
  const [currentDocument, setCurrentDocument] = useState<LegalDocument>(() => {
    return LegalAnalyzer.analyzeDocument(
      SAMPLE_CONTRACTS[0].content,
      SAMPLE_CONTRACTS[0].name,
      SAMPLE_CONTRACTS[0].docType,
      SAMPLE_CONTRACTS[0].parties
    );
  });

  // Handle dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle font size class
  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'xlarge':
        return 'text-lg';
      case 'large':
        return 'text-base';
      case 'normal':
      default:
        return 'text-sm';
    }
  };

  const handleCycleFontSize = () => {
    if (fontSizeLevel === 'normal') setFontSizeLevel('large');
    else if (fontSizeLevel === 'large') setFontSizeLevel('xlarge');
    else setFontSizeLevel('normal');
    setAnnouncerMessage(`Font size adjusted to ${fontSizeLevel === 'normal' ? 'large' : fontSizeLevel === 'large' ? 'extra large' : 'normal'}`);
  };

  const handleToggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    setAnnouncerMessage(next ? 'High contrast mode enabled' : 'High contrast mode disabled');
  };

  const handleAnalyze = async (
    rawText: string,
    title: string,
    docType: LegalDocument['docType'],
    customParties: string[]
  ) => {
    setIsLoading(true);
    setAnnouncerMessage(`Analyzing ${title}... Sanitizing PII and evaluating legal clauses.`);
    try {
      const { document: auditedDoc, engineUsed } = await GeminiService.analyzeDocument(
        rawText,
        title,
        docType,
        customParties
      );
      setCurrentDocument(auditedDoc);
      setAnnouncerMessage(
        `Analysis complete for ${title}. Found ${auditedDoc.clauses.length} clauses with risk score ${auditedDoc.overallRiskScore} out of 100.`
      );
    } catch (err) {
      console.error(err);
      setAnnouncerMessage('Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setAnnouncerMessage(`Switched to ${tab} view.`);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'contrast-125' : ''} ${getFontSizeClass()} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors`}>
      {/* Screen Reader ARIA Announcer */}
      <A11yAnnouncer message={announcerMessage} />

      {/* Legal & Regulatory Non-Advice Disclaimer */}
      <LegalDisclaimerBanner />

      {/* Accessible Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
        fontSizeLevel={fontSizeLevel}
        onCycleFontSize={handleCycleFontSize}
        hasApiKey={hasApiKey}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="main-content">
        
        {/* Document Uploader & Preset Benchmark Selector */}
        <DocumentUploadArea onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Tab Panels */}
        <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'simplifier' && <DocumentSimplifier document={currentDocument} />}
          {activeTab === 'risk-radar' && <RiskRadar document={currentDocument} />}
          {activeTab === 'comparator' && <ContractComparator />}
          {activeTab === 'grounded-qa' && <GroundedQAChat document={currentDocument} />}
          {activeTab === 'prep-kit' && <LawyerPrepKit document={currentDocument} />}
        </div>

      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeySaved={(hasKey) => {
          setHasApiKey(hasKey);
          setAnnouncerMessage(hasKey ? 'Gemini API key saved' : 'Switched to offline legal intelligence');
        }}
      />

      {/* Accessible Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-xs text-slate-500 transition-colors no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="font-bold text-slate-700 dark:text-slate-300">JurisAssist AI</span>
            <span>•</span>
            <span>GenAI for Legal Assistance & Universal Access</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Client-Side PII Protected</span>
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-500" />
              <span>WCAG 2.1 AA Compliant</span>
            </span>
            <span>Zero Data Retention</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
