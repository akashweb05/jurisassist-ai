import React, { useState, useEffect, useRef } from 'react';
import { Key, ShieldCheck, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setApiKey(GeminiService.getApiKey());
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    GeminiService.setApiKey(apiKey);
    setSaveSuccess(true);
    onKeySaved(!!apiKey.trim());
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setApiKey('');
    GeminiService.setApiKey('');
    onKeySaved(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="api-modal-title"
      className="backdrop:bg-slate-950/70 p-0 rounded-2xl shadow-2xl max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 m-auto focus:outline-none"
    >
      <div className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Key className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="api-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Google Gemini API Key
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure live Gemini AI models or use offline engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close API configuration modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero-Storage & Client-Side PII Security</span>
            </div>
            <p>
              Your API key is saved solely in your local browser storage. If omitted, JurisAssist AI operates seamlessly with its built-in rule-based legal intelligence engine.
            </p>
          </div>

          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              API Key (Google Gemini)
            </label>
            <div className="relative">
              <input
                id="gemini-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? "Hide API key" : "Show API key"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
            >
              Clear Stored Key
            </button>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition shadow flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save & Apply'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};
