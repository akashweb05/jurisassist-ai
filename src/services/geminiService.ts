import { GoogleGenAI } from '@google/genai';
import type { LegalDocument, DocumentComparisonResult, ConsultationPrepKit, ChatMessage } from '../types/legal';
import { LegalAnalyzer } from './legalAnalyzer';
import { PiiAnonymizer } from './piiAnonymizer';

export class GeminiService {
  private static apiKeyStorageKey = 'jurisassist_gemini_key';

  public static getApiKey(): string {
    const localKey = localStorage.getItem(this.apiKeyStorageKey);
    if (localKey && localKey.trim()) return localKey.trim();
    return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  }

  public static setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(this.apiKeyStorageKey, key.trim());
    } else {
      localStorage.removeItem(this.apiKeyStorageKey);
    }
  }

  public static isConfigured(): boolean {
    return !!this.getApiKey();
  }

  /**
   * Simplifies and audits a legal document using Google Gemini or the built-in local engine.
   */
  public static async analyzeDocument(
    rawText: string,
    title: string,
    docType: LegalDocument['docType'] = 'Contract',
    customParties: string[] = []
  ): Promise<{ document: LegalDocument; engineUsed: 'gemini' | 'local' }> {
    const key = this.getApiKey();

    const pii = PiiAnonymizer.anonymize(rawText, customParties);

    if (!key) {
      const doc = LegalAnalyzer.analyzeDocument(rawText, title, docType, customParties);
      return { document: doc, engineUsed: 'local' };
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `You are JurisAssist AI, an expert in legal accessibility, contract law, and plain-English translation.
Analyze the following legal document to make it clear, safe, and understandable to everyday people.

DOCUMENT TITLE: ${title}
TYPE: ${docType}
ANONYMIZED TEXT:
"""
${pii.sanitizedText}
"""

Please return a strictly valid JSON object with the following structure:
{
  "summary": "Clear, accessible 2-sentence summary of the document and major risks.",
  "overallRiskScore": <number between 10 and 100>,
  "keyRights": ["Right 1", "Right 2", "Right 3"],
  "keyObligations": ["Obligation 1", "Obligation 2", "Obligation 3"],
  "clauses": [
    {
      "clauseNumber": "Section 1",
      "title": "Section Title",
      "originalText": "Verbatim text",
      "plainEnglishExplanation": "8th grade reading level breakdown",
      "category": "Liability & Indemnification",
      "riskLevel": "high",
      "riskReason": "Why this is dangerous or disadvantageous",
      "renegotiationTip": "Specific counter-proposal",
      "isObligation": true,
      "affectedParty": "User/Signee"
    }
  ]
}
Return only JSON without markdown fences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim().replace(/```json/g, '').replace(/```/g, ''));

      const localDoc = LegalAnalyzer.analyzeDocument(rawText, title, docType, customParties);

      const enhancedDoc: LegalDocument = {
        id: `doc-${Date.now()}`,
        title,
        docType,
        rawContent: rawText,
        sanitizedContent: pii.sanitizedText,
        anonymizationMap: pii.mapping,
        createdAt: new Date().toLocaleDateString(),
        readability: localDoc.readability,
        clauses: Array.isArray(parsed.clauses) && parsed.clauses.length > 0 
          ? parsed.clauses.map((c: any, i: number) => ({
              id: `c-${i}`,
              clauseNumber: c.clauseNumber || `Section ${i + 1}`,
              title: c.title || 'Clause',
              originalText: c.originalText || '',
              plainEnglishExplanation: c.plainEnglishExplanation || '',
              category: c.category || 'General Provisions',
              riskLevel: c.riskLevel || 'low',
              riskReason: c.riskReason || '',
              renegotiationTip: c.renegotiationTip || '',
              isObligation: !!c.isObligation,
              affectedParty: c.affectedParty || 'User/Signee'
            }))
          : localDoc.clauses,
        overallRiskScore: typeof parsed.overallRiskScore === 'number' ? parsed.overallRiskScore : localDoc.overallRiskScore,
        summary: parsed.summary || localDoc.summary,
        keyRights: Array.isArray(parsed.keyRights) ? parsed.keyRights : localDoc.keyRights,
        keyObligations: Array.isArray(parsed.keyObligations) ? parsed.keyObligations : localDoc.keyObligations,
      };

      return { document: enhancedDoc, engineUsed: 'gemini' };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local heuristic legal analyzer:', err);
      const doc = LegalAnalyzer.analyzeDocument(rawText, title, docType, customParties);
      return { document: doc, engineUsed: 'local' };
    }
  }

  /**
   * Compares two documents using Gemini or local analyzer.
   */
  public static async compareDocuments(
    docA: string, 
    docB: string, 
    nameA: string, 
    nameB: string
  ): Promise<{ comparison: DocumentComparisonResult; engineUsed: 'gemini' | 'local' }> {
    const key = this.getApiKey();

    if (!key) {
      return {
        comparison: LegalAnalyzer.compareDocuments(docA, docB, nameA, nameB),
        engineUsed: 'local'
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `Compare these two legal agreements and detail all modifications, additions, and deletions with an emphasis on how rights and liabilities shifted for the user/signee.
ORIGINAL:
"""
${docA.substring(0, 3000)}
"""
REVISED:
"""
${docB.substring(0, 3000)}
"""

Return strictly a JSON object:
{
  "similarityScore": <number 0-100>,
  "overallFairnessShift": "favors_doc_a" | "favors_doc_b" | "balanced",
  "summaryOfDifferences": "Concise summary",
  "criticalAlerts": ["Alert 1", "Alert 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse((response.text || '{}').trim().replace(/```json/g, '').replace(/```/g, ''));
      const localComp = LegalAnalyzer.compareDocuments(docA, docB, nameA, nameB);

      return {
        comparison: {
          ...localComp,
          similarityScore: parsed.similarityScore ?? localComp.similarityScore,
          overallFairnessShift: parsed.overallFairnessShift ?? localComp.overallFairnessShift,
          summaryOfDifferences: parsed.summaryOfDifferences ?? localComp.summaryOfDifferences,
          criticalAlerts: parsed.criticalAlerts ?? localComp.criticalAlerts,
        },
        engineUsed: 'gemini'
      };
    } catch (err) {
      console.warn('Gemini comparison fallback:', err);
      return {
        comparison: LegalAnalyzer.compareDocuments(docA, docB, nameA, nameB),
        engineUsed: 'local'
      };
    }
  }

  /**
   * Generates consultation prep kit using Gemini or local analyzer.
   */
  public static async generatePrepKit(document: LegalDocument): Promise<ConsultationPrepKit> {
    const key = this.getApiKey();
    if (!key) {
      return LegalAnalyzer.generatePrepKit(document);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `Generate a comprehensive "Attorney Consultation Prep Kit" for this agreement:
Title: ${document.title}
Clauses: ${JSON.stringify(document.clauses.map(c => ({ num: c.clauseNumber, title: c.title, risk: c.riskLevel })))}

Return strictly JSON:
{
  "executiveSummary": "Executive briefing for legal counsel",
  "overallRiskVerdict": "Assessment of risks",
  "questionsForAttorney": ["Strategic question 1", "Strategic question 2", "Strategic question 3"],
  "actionableChecklist": [
    { "item": "Step to take", "priority": "Immediate", "completed": false }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse((response.text || '{}').trim().replace(/```json/g, '').replace(/```/g, ''));
      const localKit = LegalAnalyzer.generatePrepKit(document);

      return {
        ...localKit,
        executiveSummary: parsed.executiveSummary || localKit.executiveSummary,
        overallRiskVerdict: parsed.overallRiskVerdict || localKit.overallRiskVerdict,
        questionsForAttorney: parsed.questionsForAttorney || localKit.questionsForAttorney,
        actionableChecklist: parsed.actionableChecklist || localKit.actionableChecklist,
      };
    } catch {
      return LegalAnalyzer.generatePrepKit(document);
    }
  }

  /**
   * Grounded interactive Q&A.
   */
  public static async answerQuestion(question: string, document: LegalDocument): Promise<ChatMessage> {
    const key = this.getApiKey();
    if (!key) {
      return LegalAnalyzer.answerQuestion(question, document);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `You are a helpful legal information assistant. Answer the user's question STRICTLY based on the provided document clauses.
Do NOT give formal legal advice. Explain what the document states in plain, understandable English. Include the specific clause section in citations.

DOCUMENT TITLE: ${document.title}
CLAUSES:
${document.clauses.map(c => `[${c.clauseNumber}: ${c.title}]: ${c.originalText}`).join('\n\n')}

USER QUESTION: "${question}"

Provide a direct, helpful plain-English answer. If the document does not cover it, clearly state that.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const content = response.text || '';
      const localAnswer = LegalAnalyzer.answerQuestion(question, document);

      return {
        id: `chat-${Date.now()}`,
        sender: 'assistant',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: localAnswer.citations,
        confidence: 'high'
      };
    } catch {
      return LegalAnalyzer.answerQuestion(question, document);
    }
  }
}
