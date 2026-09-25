import React from 'react';
import { 
  Scale, 
  FileText, 
  ShieldAlert, 
  GitCompare, 
  MessageSquare, 
  Briefcase, 
  Key, 
  Sun, 
  Moon, 
  Contrast, 
  Type,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'simplifier' | 'risk-radar' | 'comparator' | 'grounded-qa' | 'prep-kit';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  fontSizeLevel: 'normal' | 'large' | 'xlarge';
  onCycleFontSize: () => void;
  hasApiKey: boolean;
  onOpenApiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  isHighContrast,
  onToggleHighContrast,
  fontSizeLevel,
  onCycleFontSize,
  hasApiKey,
  onOpenApiModal
}) => {
  const tabs = [
    { id: 'simplifier' as ActiveTab, label: 'Simplifier', icon: FileText, desc: 'Plain English' },
    { id: 'risk-radar' as ActiveTab, label: 'Risk Radar', icon: ShieldAlert, desc: 'Traps & Liabilities' },
    { id: 'comparator' as ActiveTab, label: 'Comparator', icon: GitCompare, desc: 'Compare 2 Contracts' },
    { id: 'grounded-qa' as ActiveTab, label: 'Grounded Q&A', icon: MessageSquare, desc: 'Clause Citations' },
    { id: 'prep-kit' as ActiveTab, label: 'Lawyer Prep Kit', icon: Briefcase, desc: 'Dossier & Checklist' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  JurisAssist
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Demystifying Legal Documents & Access
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav 
            role="tablist" 
            aria-label="Legal Assistant Modules"
            className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Accessibility & Settings Quick Bar */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Engine Indicator / Key Modal Button */}
            <button
              type="button"
              onClick={onOpenApiModal}
              title={hasApiKey ? 'Google Gemini 2.5 Flash active' : 'Offline Heuristic Engine active (Click to set Gemini API key)'}
              aria-label="Configure Gemini AI Key"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                hasApiKey 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {hasApiKey ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="hidden lg:inline">Gemini AI</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span className="hidden lg:inline">Set API Key</span>
                </>
              )}
            </button>

            {/* Font Size Adjuster for Accessibility */}
            <button
              type="button"
              onClick={onCycleFontSize}
              title={`Cycle font size (Current: ${fontSizeLevel})`}
              aria-label={`Adjust text size, current level ${fontSizeLevel}`}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
            >
              <Type className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* High Contrast Mode for Accessibility */}
            <button
              type="button"
              onClick={onToggleHighContrast}
              title={isHighContrast ? "High Contrast Mode Active" : "Enable High Contrast"}
              aria-label="Toggle High Contrast Mode"
              aria-pressed={isHighContrast}
              className={`p-2 rounded-lg border transition ${
                isHighContrast 
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
              }`}
            >
              <Contrast className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Dark / Light Mode */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>

          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-200 dark:border-slate-800 gap-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
