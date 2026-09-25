import { describe, it, expect } from 'vitest';
import { ReadabilityCalculator } from '../services/readabilityCalculator';

describe('ReadabilityCalculator Analysis Engine', () => {
  it('correctly assesses plain, simple English with high reading ease', () => {
    const simple = 'The cat sat on the mat. Dogs like to play in the yard. We walk every day.';
    const metrics = ReadabilityCalculator.analyze(simple);

    expect(metrics.fleschReadingEase).toBeGreaterThan(70);
    expect(metrics.fleschKincaidGrade).toBeLessThanOrEqual(6);
    expect(metrics.legaleseDensityPercent).toBe(0);
  });

  it('correctly assesses dense legalese with high grade level and legalese density', () => {
    const denseLegal = `Notwithstanding anything to the contrary contained herein, Tenant shall defend, 
indemnify, and hold harmless Landlord in perpetuity against all claims, liquidated damages, and liabilities heretofore accrued.`;
    const metrics = ReadabilityCalculator.analyze(denseLegal);

    expect(metrics.legaleseDensityPercent).toBeGreaterThan(10);
    expect(metrics.fleschKincaidGrade).toBeGreaterThanOrEqual(10);
    expect(metrics.fleschReadingEase).toBeLessThan(50);
  });

  it('handles empty input gracefully without dividing by zero', () => {
    const metrics = ReadabilityCalculator.analyze('');
    expect(metrics.wordCount).toBe(0);
    expect(metrics.sentenceCount).toBe(0);
    expect(metrics.fleschReadingEase).toBe(100);
    expect(metrics.fleschKincaidGrade).toBe(0);
  });
});
