import { describe, it, expect } from 'vitest';
import { LegalAnalyzer } from '../services/legalAnalyzer';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

describe('LegalAnalyzer Intelligence & Auditing Engine', () => {
  const leaseSample = SAMPLE_CONTRACTS[0];

  it('correctly segments contract text into distinct numbered clauses', () => {
    const clauses = LegalAnalyzer.segmentClauses(leaseSample.content);
    expect(clauses.length).toBeGreaterThanOrEqual(5);
    expect(clauses.some(c => c.clauseNumber.includes('Section'))).toBe(true);
  });

  it('identifies predatory indemnification as high risk', () => {
    const indemnityClause = {
      clauseNumber: 'Section 6',
      title: 'INDEMNIFICATION & HOLD HARMLESS',
      content: 'Tenant covenants to defend, indemnify, and hold harmless Landlord even if caused by the sole negligence of Landlord.'
    };
    const audit = LegalAnalyzer.auditClause(indemnityClause);
    expect(audit.riskLevel).toBe('high');
    expect(audit.category).toBe('Liability & Indemnification');
    expect(audit.renegotiationTip).toContain('mutual indemnification');
  });

  it('generates a full document analysis with aggregate risk score', () => {
    const analyzed = LegalAnalyzer.analyzeDocument(leaseSample.content, leaseSample.name, leaseSample.docType);
    expect(analyzed.overallRiskScore).toBeGreaterThanOrEqual(50);
    expect(analyzed.clauses.length).toBeGreaterThan(0);
    expect(analyzed.keyObligations.length).toBeGreaterThan(0);
    expect(analyzed.keyRights.length).toBeGreaterThan(0);
  });

  it('performs bilateral comparison detecting favorable shifts in tenant revisions', () => {
    const comp = LegalAnalyzer.compareDocuments(
      leaseSample.content,
      leaseSample.revisedVersion || '',
      'Original',
      'Revised'
    );
    expect(comp.overallFairnessShift).toBe('favors_doc_b');
    expect(comp.clauseDiffs.length).toBeGreaterThan(0);
    expect(comp.similarityScore).toBeLessThan(100);
  });

  it('creates an attorney consultation prep kit with prioritized checklists', () => {
    const analyzed = LegalAnalyzer.analyzeDocument(leaseSample.content, leaseSample.name, leaseSample.docType);
    const prepKit = LegalAnalyzer.generatePrepKit(analyzed);
    expect(prepKit.topVulnerabilities.length).toBeGreaterThan(0);
    expect(prepKit.questionsForAttorney.length).toBeGreaterThanOrEqual(3);
    expect(prepKit.actionableChecklist.length).toBeGreaterThanOrEqual(3);
  });

  it('answers grounded document questions with clause references', () => {
    const analyzed = LegalAnalyzer.analyzeDocument(leaseSample.content, leaseSample.name, leaseSample.docType);
    const answer = LegalAnalyzer.answerQuestion('What are the rules regarding landlord entry?', analyzed);
    expect(answer.citations).toBeDefined();
    expect(answer.citations?.[0].clauseNumber).toBeDefined();
    expect(answer.content).toContain('Based on');
  });
});
