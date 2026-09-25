export type RiskLevel = 'low' | 'medium' | 'high';

export type ClauseCategory = 
  | 'Liability & Indemnification'
  | 'Termination & Cancellation'
  | 'Intellectual Property'
  | 'Payment & Fees'
  | 'Non-Compete & Restrictive Covenants'
  | 'Dispute Resolution & Arbitration'
  | 'Privacy & Data Use'
  | 'Warranties & Disclaimers'
  | 'General Provisions';

export interface ClauseAnalysis {
  id: string;
  clauseNumber: string;
  title: string;
  originalText: string;
  plainEnglishExplanation: string;
  category: ClauseCategory;
  riskLevel: RiskLevel;
  riskReason: string;
  renegotiationTip: string;
  isObligation: boolean;
  affectedParty: 'User/Signee' | 'Counterparty' | 'Mutual';
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gradeLevelDescription: string;
  sentenceCount: number;
  wordCount: number;
  complexWordCount: number;
  legaleseDensityPercent: number;
}

export interface LegalDocument {
  id: string;
  title: string;
  docType: 'Contract' | 'Lease Agreement' | 'NDA' | 'Terms of Service' | 'Employment' | 'Custom';
  rawContent: string;
  sanitizedContent: string;
  anonymizationMap: Record<string, string>;
  createdAt: string;
  readability: ReadabilityMetrics;
  clauses: ClauseAnalysis[];
  overallRiskScore: number; // 0 (safest) to 100 (most predatory)
  summary: string;
  keyRights: string[];
  keyObligations: string[];
}

export interface ComparisonDiffClause {
  clauseNumber: string;
  title: string;
  docAContent: string;
  docBContent: string;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
  impactOnUser: 'more_favorable' | 'less_favorable' | 'neutral';
  explanation: string;
}

export interface DocumentComparisonResult {
  docAName: string;
  docBName: string;
  similarityScore: number; // 0 - 100%
  overallFairnessShift: 'favors_doc_a' | 'favors_doc_b' | 'balanced';
  summaryOfDifferences: string;
  clauseDiffs: ComparisonDiffClause[];
  criticalAlerts: string[];
}

export interface ConsultationPrepKit {
  executiveSummary: string;
  overallRiskVerdict: string;
  topVulnerabilities: {
    title: string;
    riskLevel: RiskLevel;
    clauseNumber: string;
    whyItMatters: string;
  }[];
  questionsForAttorney: string[];
  recommendedRedlines: {
    clauseNumber: string;
    currentText: string;
    proposedChange: string;
    rationale: string;
  }[];
  actionableChecklist: {
    item: string;
    priority: 'Immediate' | 'Before Signing' | 'Post-Signing';
    completed: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: {
    clauseNumber: string;
    snippet: string;
  }[];
  confidence?: 'high' | 'medium' | 'low';
}
