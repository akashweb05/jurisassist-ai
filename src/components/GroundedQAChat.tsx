import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { LegalDocument, ChatMessage } from '../types/legal';
import { GeminiService } from '../services/geminiService';

interface GroundedQAChatProps {
  document: LegalDocument;
}

export const GroundedQAChat: React.FC<GroundedQAChatProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `Hello! I have thoroughly indexed **"${document.title}"** (${document.clauses.length} sections).\n\nAsk me any question regarding your obligations, payment schedules, hidden penalties, or rights. Every answer is strictly grounded with direct clause citations.`,
      timestamp: 'Just now',
      confidence: 'high'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'Can the counterparty enter or inspect without notice?',
    'What happens to my deposit or payment if I terminate early?',
    'Are there any unlimited liability or indemnification clauses?',
    'Do I retain ownership of intellectual property or data?',
    'What are the mandatory dispute resolution procedures?'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await GeminiService.answerQuestion(query, document);
      setMessages(prev => [...prev, response]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'I encountered an error retrieving that provision. Please try rephrasing your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 'low'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*_#\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section 
      aria-labelledby="qa-chat-title"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[700px] transition-colors"
    >
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="qa-chat-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Grounded Legal Assistant</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Anti-Hallucination
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Querying {document.title} with verified clause citations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'assistant',
                content: `Chat cleared. Ready for your questions on "${document.title}".`,
                timestamp: 'Just now',
                confidence: 'high'
              }
            ]);
          }}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
          title="Reset Conversation"
          aria-label="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggestions:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 whitespace-nowrap shrink-0 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Timeline */}
      <div 
        tabIndex={0}
        aria-label="Chat messages history"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations badges if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                      <FileText className="w-3.5 h-3.5" /> Direct Clause Verification:
                    </p>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="p-2 rounded bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-blue-700 dark:text-blue-300">[{c.clauseNumber}]</span> {c.snippet}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message metadata & accessible actions */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                      title="Copy response"
                      aria-label="Copy response text"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.content)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                      aria-label={isSpeaking ? "Stop speaking" : "Read answer aloud"}
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-blue-500" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 max-w-xs rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Cross-referencing document clauses...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <label htmlFor="legal-chat-input" className="sr-only">
          Ask a question about this legal document
        </label>
        <input
          id="legal-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question (e.g. Can the landlord enter without notice?)..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </section>
  );
};
