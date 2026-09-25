import { describe, it, expect } from 'vitest';
import { PiiAnonymizer } from '../services/piiAnonymizer';

describe('PiiAnonymizer Security Engine', () => {
  it('masks emails, phone numbers, and SSNs accurately', () => {
    const raw = 'Please contact tenant at john.doe@example.com or +1 (555) 234-5678. SSN: 123-45-6789.';
    const result = PiiAnonymizer.anonymize(raw);

    expect(result.sanitizedText).not.toContain('john.doe@example.com');
    expect(result.sanitizedText).not.toContain('555) 234-5678');
    expect(result.sanitizedText).not.toContain('123-45-6789');

    expect(result.sanitizedText).toContain('[EMAIL_1]');
    expect(result.sanitizedText).toContain('[PHONE_1]');
    expect(result.sanitizedText).toContain('[GOV_ID_1]');

    expect(result.stats.emailsMasked).toBe(1);
    expect(result.stats.phonesMasked).toBe(1);
    expect(result.stats.idsMasked).toBe(1);
    expect(result.stats.totalTokensProtected).toBeGreaterThanOrEqual(3);
  });

  it('masks designated custom party names', () => {
    const raw = 'This Agreement is between Acme Global Inc. and Jane Doe.';
    const result = PiiAnonymizer.anonymize(raw, ['Acme Global Inc.', 'Jane Doe']);

    expect(result.sanitizedText).toContain('[PARTY_A]');
    expect(result.sanitizedText).toContain('[PARTY_B]');
    expect(result.sanitizedText).not.toContain('Acme Global Inc.');
    expect(result.sanitizedText).not.toContain('Jane Doe');
    expect(result.stats.partiesMasked).toBe(2);
  });

  it('accurately de-anonymizes sanitized text back to original format', () => {
    const raw = 'Payment sent to alice@wonderland.org for lease at 124 Magnolia Court, Austin, TX.';
    const anonymized = PiiAnonymizer.anonymize(raw);
    const restored = PiiAnonymizer.deanonymize(anonymized.sanitizedText, anonymized.mapping);

    expect(restored).toBe(raw);
  });
});
