import type { 
  ClauseAnalysis, 
  ClauseCategory, 
  RiskLevel, 
  LegalDocument, 
  DocumentComparisonResult, 
  ComparisonDiffClause, 
  ConsultationPrepKit,
  ChatMessage
} from '../types/legal';
import { ReadabilityCalculator } from './readabilityCalculator';
import { PiiAnonymizer } from './piiAnonymizer';

interface RiskRule {
  category: ClauseCategory;
  pattern: RegExp;
  riskLevel: RiskLevel;
  reason: string;
  renegotiationTip: string;
}

const RISK_RULES: RiskRule[] = [
  {
    category: 'Liability & Indemnification',
    pattern: /(indemnify|hold harmless|defend|sole negligence|without monetary cap|unlimited liability)/i,
    riskLevel: 'high',
    reason: 'Imposes severe or unlimited indemnification liability on you, potentially forcing you to pay for the other party\'s legal claims or even their own negligence.',
    renegotiationTip: 'Request mutual indemnification and cap your maximum liability to the total fees paid under the contract over the preceding 12 months.'
  },
  {
    category: 'Termination & Cancellation',
    pattern: /(sole discretion|without cause|twenty-four \(24\) hours|immediately terminate|unilateral right to terminate)/i,
    riskLevel: 'high',
    reason: 'Gives the counterparty one-sided power to terminate without notice or reasonable cause while binding you to strict lock-in.',
    renegotiationTip: 'Require equal 30 days prior written notice and a 15-day cure period for any alleged contractual breach.'
  },
  {
    category: 'Non-Compete & Restrictive Covenants',
    pattern: /(non-compet|compete with company|twenty-four \(24\) months|globally|in the technology sector|restrict.*providing)/i,
    riskLevel: 'high',
    reason: 'Extremely broad non-compete restriction that could legally prevent you from earning a living or working with clients in your field.',
    renegotiationTip: 'Limit restrictions strictly to non-solicitation of active current employees or confidential clients, and strike down broad non-compete clauses.'
  },
  {
    category: 'Dispute Resolution & Arbitration',
    pattern: /(binding arbitration|waives all rights to trial by jury|confidential arbitration|fees borne exclusively|chosen solely by)/i,
    riskLevel: 'high',
    reason: 'Forces you to give up court and jury trial rights, mandating costly arbitration in an unfair location where you may be forced to pay all filing fees.',
    renegotiationTip: 'Insert a requirement for mutual good-faith mediation first, and ensure each party pays their own arbitration costs in a neutral jurisdiction.'
  },
  {
    category: 'Intellectual Property',
    pattern: /(irrevocably assigns|all inventions|whether or not related|outside work hours|perpetual.*train machine learning)/i,
    riskLevel: 'high',
    reason: 'Overreaching IP capture that seizes rights to your pre-existing work, side projects, or grants perpetual commercial reuse of your private data.',
    renegotiationTip: 'Explicitly carve out "Background IP" and pre-existing assets. Only assign rights to deliverables created specifically for the project after full payment.'
  },
  {
    category: 'Payment & Fees',
    pattern: /(ninety \(90\) days|withhold.*30%|forfeit.*deposit|liquidated damages of \$|perpetual late fee)/i,
    riskLevel: 'medium',
    reason: 'Unfavorable payment timing (Net 90), arbitrary holdbacks, or punitive liquidated damages that place financial stress on you.',
    renegotiationTip: 'Change payment terms to Net 30 or Net 15, eliminate unilateral holdbacks, and cap late interest at standard statutory rates.'
  },
  {
    category: 'Privacy & Data Use',
    pattern: /(royalty-free license to use.*data|train machine learning models|monetize.*metadata|unrestricted right to enter)/i,
    riskLevel: 'high',
    reason: 'Grants excessive data usage rights or infringes upon privacy (such as landlord unannounced entry or commercial monetization of your data).',
    renegotiationTip: 'Require 24 hours advance written notice for physical entry, and prohibit training proprietary AI models or third-party resale of your private data.'
  },
  {
    category: 'Warranties & Disclaimers',
    pattern: /(as is|as available|expressly disclaims all warranties|normal wear and tear|repair.*cost)/i,
    riskLevel: 'medium',
    reason: 'The provider or landlord disclaims habitability, reliability, or product warranties while offloading maintenance costs onto you.',
    renegotiationTip: 'Require a basic warranty of merchantability, uptime SLA (e.g. 99.5%), or statutory landlord duty for structural maintenance.'
  }
];

export class LegalAnalyzer {
  /**
   * Splits a raw legal contract into identifiable clauses.
   */
  public static segmentClauses(text: string): { clauseNumber: string; title: string; content: string }[] {
    const rawParagraphs = text.split(/\n\s*\n/);
    const clauses: { clauseNumber: string; title: string; content: string }[] = [];

    let currentClauseNumber = 'Preamble';
    let currentTitle = 'Introduction & Background';
    let currentBuffer: string[] = [];

    const sectionRegex = /^(\d+|[A-ZIVX]+)[\.\:\-]\s*([A-Z\s&,\/]{3,50})/m;

    rawParagraphs.forEach((para, idx) => {
      const trimmed = para.trim();
      if (!trimmed) return;

      const match = trimmed.match(sectionRegex);
      if (match) {
        if (currentBuffer.length > 0) {
          clauses.push({
            clauseNumber: currentClauseNumber,
            title: currentTitle,
            content: currentBuffer.join('\n\n')
          });
          currentBuffer = [];
        }

        currentClauseNumber = `Section ${match[1]}`;
        currentTitle = match[2].trim();
        const lines = trimmed.split('\n');
        currentBuffer.push(lines.slice(1).join('\n') || trimmed);
      } else {
        if (currentBuffer.length === 0 && idx === 0) {
          currentBuffer.push(trimmed);
        } else {
          currentBuffer.push(trimmed);
        }
      }
    });

    if (currentBuffer.length > 0) {
      clauses.push({
        clauseNumber: currentClauseNumber,
        title: currentTitle,
        content: currentBuffer.join('\n\n')
      });
    }

    return clauses.length > 0 ? clauses : [
      {
        clauseNumber: 'Document Body',
        title: 'Full Agreement',
        content: text
      }
    ];
  }

  /**
   * Translates complex legal text to Plain English explanation.
   */
  public static generatePlainEnglish(title: string, text: string, category: ClauseCategory): string {
    const lower = text.toLowerCase();
    
    if (lower.includes('indemnify') || lower.includes('hold harmless')) {
      return 'If someone sues or claims damages, you agree to pay for all legal costs, lawyers, and settlements—even if the fault wasn\'t entirely yours.';
    }
    if (lower.includes('enter the premises') || lower.includes('without prior notice')) {
      return 'The landlord or their staff can walk into your home at any hour without telling you beforehand, removing your privacy rights.';
    }
    if (lower.includes('security deposit') && lower.includes('forfeited')) {
      return 'If you need to move out early (even for a medical issue or job move), you lose your entire deposit ($4,800) with zero refund.';
    }
    if (lower.includes('assigns') && lower.includes('inventions')) {
      return 'The company claims ownership of everything you invent or create during this contract, even on your own time or for side hobbies.';
    }
    if (lower.includes('non-compet') || (lower.includes('compete') && lower.includes('months'))) {
      return 'You are blocked from working in your profession or taking software jobs with any competitors for up to 2 years after leaving.';
    }
    if (lower.includes('binding arbitration') || lower.includes('jury')) {
      return 'You surrender your right to go to a normal court or jury trial. Any dispute will be held in a private, expensive arbitration room.';
    }
    if (lower.includes('as is') || lower.includes('disclaims all warranties')) {
      return 'The software or property is given to you without any guarantee of working properly. If it breaks or goes down, you have no recourse.';
    }
    if (lower.includes('ninety (90) days')) {
      return 'You may have to wait 3 full months after finishing your work before you get paid, creating a cash flow risk.';
    }
    if (lower.includes('automatic') && lower.includes('renew')) {
      return 'This contract will auto-lock you in for another full year unless you send a formal certified letter 90 days before it ends.';
    }

    return `In simple terms, this ${title} clause sets out the rules for ${category.toLowerCase()}. It specifies what both sides must do and what happens if conditions change.`;
  }

  /**
   * Evaluates risk level and obligations for a clause.
   */
  public static auditClause(clause: { clauseNumber: string; title: string; content: string }): ClauseAnalysis {
    let matchedRule: RiskRule | null = null;

    for (const rule of RISK_RULES) {
      if (rule.pattern.test(clause.content) || rule.pattern.test(clause.title)) {
        matchedRule = rule;
        break;
      }
    }

    const category: ClauseCategory = matchedRule ? matchedRule.category : 'General Provisions';
    const riskLevel: RiskLevel = matchedRule ? matchedRule.riskLevel : 'low';
    const riskReason = matchedRule 
      ? matchedRule.reason 
      : 'Standard contractual clause with balanced obligations.';
    const renegotiationTip = matchedRule 
      ? matchedRule.renegotiationTip 
      : 'Standard industry term. Ensure you keep copies of all communications.';

    const plainEnglishExplanation = this.generatePlainEnglish(clause.title, clause.content, category);
    const isObligation = /shall|must|agrees to|covenants|required to|will pay/i.test(clause.content);
    const affectedParty: 'User/Signee' | 'Counterparty' | 'Mutual' = 
      /tenant|contractor|subscriber|receiving party/i.test(clause.content) ? 'User/Signee' : 'Mutual';

    return {
      id: `clause-${Math.random().toString(36).substring(2, 9)}`,
      clauseNumber: clause.clauseNumber,
      title: clause.title,
      originalText: clause.content,
      plainEnglishExplanation,
      category,
      riskLevel,
      riskReason,
      renegotiationTip,
      isObligation,
      affectedParty
    };
  }

  /**
   * Full comprehensive analysis of a legal document.
   */
  public static analyzeDocument(
    rawText: string, 
    title: string = 'Legal Document', 
    docType: LegalDocument['docType'] = 'Contract',
    customParties: string[] = []
  ): LegalDocument {
    const piiResult = PiiAnonymizer.anonymize(rawText, customParties);
    const readability = ReadabilityCalculator.analyze(rawText);
    const rawClauses = this.segmentClauses(rawText);
    const analyzedClauses = rawClauses.map(c => this.auditClause(c));

    let riskPoints = 0;
    analyzedClauses.forEach(c => {
      if (c.riskLevel === 'high') riskPoints += 25;
      else if (c.riskLevel === 'medium') riskPoints += 10;
      else riskPoints += 2;
    });
    const overallRiskScore = Math.min(100, Math.max(10, Math.round(riskPoints)));

    const keyRights: string[] = [];
    const keyObligations: string[] = [];

    analyzedClauses.forEach(c => {
      if (c.isObligation && c.affectedParty === 'User/Signee') {
        keyObligations.push(`[${c.clauseNumber}] ${c.plainEnglishExplanation}`);
      } else if (c.riskLevel === 'low') {
        keyRights.push(`[${c.clauseNumber}] Permitted under ${c.title}`);
      }
    });

    if (keyObligations.length === 0) {
      keyObligations.push('Comply with agreed service milestones and confidentiality obligations.');
    }
    if (keyRights.length === 0) {
      keyRights.push('Right to written notice prior to termination and receipt of agreed compensation.');
    }

    const highRisksCount = analyzedClauses.filter(c => c.riskLevel === 'high').length;
    const summary = `This ${docType} has been audited for clarity and legal risk. It contains ${analyzedClauses.length} distinct sections with an overall Risk Score of ${overallRiskScore}/100. ${
      highRisksCount > 0 
        ? `ALERT: ${highRisksCount} high-risk clauses were detected regarding indemnification, termination, or dispute rights that heavily favor the other party.`
        : 'The document appears relatively standard, but key deadlines and dispute clauses should be reviewed carefully.'
    }`;

    return {
      id: `doc-${Date.now()}`,
      title,
      docType,
      rawContent: rawText,
      sanitizedContent: piiResult.sanitizedText,
      anonymizationMap: piiResult.mapping,
      createdAt: new Date().toLocaleDateString(),
      readability,
      clauses: analyzedClauses,
      overallRiskScore,
      summary,
      keyRights: keyRights.slice(0, 4),
      keyObligations: keyObligations.slice(0, 5)
    };
  }

  /**
   * Bilateral Document Comparison: Compares Original (Doc A) vs Revised/Benchmarked (Doc B).
   */
  public static compareDocuments(
    docAText: string, 
    docBText: string, 
    nameA: string = 'Version 1 (Original)', 
    nameB: string = 'Version 2 (Revised)'
  ): DocumentComparisonResult {
    const clausesA = this.segmentClauses(docAText);
    const clausesB = this.segmentClauses(docBText);

    const diffs: ComparisonDiffClause[] = [];
    const criticalAlerts: string[] = [];
    let favorCounter = 0;

    clausesA.forEach((cA, idx) => {
      const matchInB = clausesB.find(cB => 
        cB.clauseNumber.toLowerCase() === cA.clauseNumber.toLowerCase() ||
        cB.title.toLowerCase() === cA.title.toLowerCase()
      ) || clausesB[idx];

      if (matchInB) {
        const isDifferent = cA.content.trim() !== matchInB.content.trim();
        let impact: 'more_favorable' | 'less_favorable' | 'neutral' = 'neutral';
        let explanation = 'Clauses are substantively similar.';

        if (isDifferent) {
          const aAudit = this.auditClause(cA);
          const bAudit = this.auditClause(matchInB);

          if (aAudit.riskLevel === 'high' && bAudit.riskLevel !== 'high') {
            impact = 'more_favorable';
            favorCounter++;
            explanation = `Revision ${nameB} softened or removed predatory terms (reduced risk from ${aAudit.riskLevel} to ${bAudit.riskLevel}).`;
          } else if (aAudit.riskLevel !== 'high' && bAudit.riskLevel === 'high') {
            impact = 'less_favorable';
            favorCounter--;
            explanation = `Revision ${nameB} introduced stricter obligations or higher legal exposure.`;
            criticalAlerts.push(`Increased risk in ${matchInB.title}: ${bAudit.riskReason}`);
          } else {
            impact = 'neutral';
            explanation = 'Language was modified for clarification without shifting substantial liability balance.';
          }
        }

        diffs.push({
          clauseNumber: cA.clauseNumber,
          title: cA.title,
          docAContent: cA.content,
          docBContent: matchInB.content,
          changeType: isDifferent ? 'modified' : 'unchanged',
          impactOnUser: impact,
          explanation
        });
      } else {
        diffs.push({
          clauseNumber: cA.clauseNumber,
          title: cA.title,
          docAContent: cA.content,
          docBContent: '[Clause removed in Revised Version]',
          changeType: 'removed',
          impactOnUser: 'more_favorable',
          explanation: `The clause "${cA.title}" was deleted in the revised document.`
        });
        favorCounter++;
      }
    });

    clausesB.forEach(cB => {
      const matchInA = clausesA.find(cA => 
        cA.clauseNumber.toLowerCase() === cB.clauseNumber.toLowerCase() ||
        cA.title.toLowerCase() === cB.title.toLowerCase()
      );
      if (!matchInA) {
        const bAudit = this.auditClause(cB);
        diffs.push({
          clauseNumber: cB.clauseNumber,
          title: cB.title,
          docAContent: '[Not present in Original Version]',
          docBContent: cB.content,
          changeType: 'added',
          impactOnUser: bAudit.riskLevel === 'high' ? 'less_favorable' : 'neutral',
          explanation: `New clause introduced in ${nameB}. Risk is evaluated as ${bAudit.riskLevel}.`
        });
        if (bAudit.riskLevel === 'high') {
          criticalAlerts.push(`Newly added clause in ${nameB} (${cB.title}) presents elevated risk.`);
          favorCounter--;
        }
      }
    });

    const totalClauses = Math.max(1, diffs.length);
    const unchangedCount = diffs.filter(d => d.changeType === 'unchanged').length;
    const similarityScore = Math.round((unchangedCount / totalClauses) * 100);

    let overallFairnessShift: 'favors_doc_a' | 'favors_doc_b' | 'balanced' = 'balanced';
    if (favorCounter > 1) overallFairnessShift = 'favors_doc_b';
    else if (favorCounter < -1) overallFairnessShift = 'favors_doc_a';

    const summaryOfDifferences = `Comparison shows ${diffs.filter(d => d.changeType === 'modified').length} modified sections and ${diffs.filter(d => d.changeType === 'added' || d.changeType === 'removed').length} structural alterations. The similarity between both versions is ${similarityScore}%. Overall, ${
      overallFairnessShift === 'favors_doc_b'
        ? `${nameB} significantly improves tenant/contractor protections and curtails one-sided liabilities.`
        : overallFairnessShift === 'favors_doc_a'
        ? `${nameB} increases legal obligations and risks compared to ${nameA}.`
        : 'The modifications maintain a comparable balance of rights.'
    }`;

    return {
      docAName: nameA,
      docBName: nameB,
      similarityScore,
      overallFairnessShift,
      summaryOfDifferences,
      clauseDiffs: diffs,
      criticalAlerts
    };
  }

  /**
   * Generates a Lawyer Consultation Prep Kit with actionable checklists and questions.
   */
  public static generatePrepKit(document: LegalDocument): ConsultationPrepKit {
    const highRiskClauses = document.clauses.filter(c => c.riskLevel === 'high');
    const medRiskClauses = document.clauses.filter(c => c.riskLevel === 'medium');

    const topVulnerabilities = highRiskClauses.concat(medRiskClauses).slice(0, 4).map(c => ({
      title: c.title,
      riskLevel: c.riskLevel,
      clauseNumber: c.clauseNumber,
      whyItMatters: c.riskReason
    }));

    const questionsForAttorney: string[] = [
      'Are the indemnification provisions enforceable in our jurisdiction, and how can we insert a mutual liability cap?',
      'Does the termination clause provide adequate cure periods, or could the counterparty terminate abruptly?',
      'Are the non-compete or intellectual property assignment terms legally overbroad under local employment statutes?',
      'If a dispute occurs, what would typical arbitration in the chosen venue cost relative to standard small claims court?'
    ];

    const recommendedRedlines = highRiskClauses.slice(0, 3).map(c => ({
      clauseNumber: c.clauseNumber,
      currentText: c.originalText.substring(0, 160) + '...',
      proposedChange: `Modify ${c.clauseNumber} to include mutual reciprocity, reasonable 30-day notice, and a monetary cap equal to 12 months fees.`,
      rationale: c.renegotiationTip
    }));

    const actionableChecklist = [
      {
        item: 'Do not sign until the 3 high-risk clauses (Indemnity, Termination, Liability) are reviewed.',
        priority: 'Immediate' as const,
        completed: false
      },
      {
        item: 'Request written redlines proposing mutual notice periods and liability caps.',
        priority: 'Before Signing' as const,
        completed: false
      },
      {
        item: 'Verify insurance coverage limits to determine if required indemnification is even insurable.',
        priority: 'Before Signing' as const,
        completed: false
      },
      {
        item: 'Calendar all renewal and notice deadlines (specifically the 90-day certified mail window).',
        priority: 'Post-Signing' as const,
        completed: false
      }
    ];

    return {
      executiveSummary: `Consultation dossier prepared for ${document.title}. The contract carries an Overall Risk Index of ${document.overallRiskScore}/100 with ${highRiskClauses.length} high-severity clauses requiring professional scrutiny.`,
      overallRiskVerdict: document.overallRiskScore > 50 
        ? 'High Risk: Significant un-negotiated exposure present. Consultation strongly advised before signature.' 
        : 'Moderate Risk: Standard terms with a few clauses warranting targeted clarification.',
      topVulnerabilities,
      questionsForAttorney,
      recommendedRedlines,
      actionableChecklist
    };
  }

  /**
   * Grounded Document Q&A Engine with clause citations.
   */
  public static answerQuestion(question: string, document: LegalDocument): ChatMessage {
    const qLower = question.toLowerCase();
    let bestClause: ClauseAnalysis | null = null;
    let snippet = '';

    for (const clause of document.clauses) {
      const textLower = clause.originalText.toLowerCase();
      const titleLower = clause.title.toLowerCase();

      if (
        (qLower.includes('terminat') && (textLower.includes('terminat') || titleLower.includes('term'))) ||
        ((qLower.includes('pay') || qLower.includes('fee') || qLower.includes('rent')) && (textLower.includes('pay') || textLower.includes('rent') || textLower.includes('fee'))) ||
        (qLower.includes('deposit') && textLower.includes('deposit')) ||
        ((qLower.includes('enter') || qLower.includes('entry') || qLower.includes('inspect')) && (textLower.includes('enter') || textLower.includes('entry') || textLower.includes('inspection') || titleLower.includes('entry') || titleLower.includes('inspection'))) ||
        ((qLower.includes('liab') || qLower.includes('indemn')) && (textLower.includes('liab') || textLower.includes('indemn'))) ||
        ((qLower.includes('arbitrat') || qLower.includes('dispute') || qLower.includes('jury')) && (textLower.includes('arbitrat') || textLower.includes('jury') || textLower.includes('dispute'))) ||
        ((qLower.includes('ip') || qLower.includes('intellectual') || qLower.includes('code')) && (textLower.includes('intellectual') || textLower.includes('inventions'))) ||
        ((qLower.includes('compet') || qLower.includes('solicit')) && (textLower.includes('compet') || textLower.includes('solicit')))
      ) {
        bestClause = clause;
        snippet = clause.originalText.substring(0, 180) + '...';
        break;
      }
    }

    if (bestClause) {
      return {
        id: `chat-${Date.now()}`,
        sender: 'assistant',
        content: `Based on **${bestClause.clauseNumber} (${bestClause.title})**:\n\n${bestClause.plainEnglishExplanation}\n\n**Legal Warning:** ${bestClause.riskReason}\n\n**Actionable Suggestion:** ${bestClause.renegotiationTip}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          {
            clauseNumber: bestClause.clauseNumber,
            snippet
          }
        ],
        confidence: 'high'
      };
    }

    return {
      id: `chat-${Date.now()}`,
      sender: 'assistant',
      content: `I scanned the ${document.clauses.length} clauses of "${document.title}". The document does not contain an explicit provision directly answering "${question}". You should clarify this with the counterparty in writing, as silence on this issue could defer to statutory default rules.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 'medium'
    };
  }
}
