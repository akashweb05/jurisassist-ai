import type { ReadabilityMetrics } from '../types/legal';

export const COMMON_LEGALESE_TERMS = [
  'heretofore', 'hereinafter', 'herein', 'therein', 'wherein', 'wherefore',
  'indemnify', 'indemnification', 'hold harmless', 'notwithstanding',
  'inter alia', 'mutatis mutandis', 'in perpetuity', 'ipso facto',
  'liquidated damages', 'force majeure', 'severability', 'remedy in equity',
  'covenants', 'warranties', 'representations', 'sole discretion',
  'consequential damages', 'punitive damages', 'without limitation',
  'save and except', 'construed in accordance with', 'null and void',
  'survive termination', 'prima facie', 'subrogation', 'estoppel'
];

export class ReadabilityCalculator {
  /**
   * Count syllables in an English word using phonetic heuristics.
   */
  public static countSyllables(word: string): number {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!cleanWord) return 1;
    if (cleanWord.length <= 3) return 1;

    const processed = cleanWord
      .replace(/(?:[^laeiouy]|ed|es|e)$/, '')
      .replace(/^y/, '');

    const matches = processed.match(/[aeiouy]{1,2}/g);
    return matches ? Math.max(1, matches.length) : 1;
  }

  /**
   * Calculates readability metrics based on the Flesch-Kincaid index and legalese density.
   */
  public static analyze(text: string): ReadabilityMetrics {
    if (!text || text.trim().length === 0) {
      return {
        fleschReadingEase: 100,
        fleschKincaidGrade: 0,
        gradeLevelDescription: 'Empty text',
        sentenceCount: 0,
        wordCount: 0,
        complexWordCount: 0,
        legaleseDensityPercent: 0,
      };
    }

    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const words = text
      .split(/\s+/)
      .map(w => w.replace(/[^a-zA-Z0-9]/g, '').trim())
      .filter(w => w.length > 0);

    const sentenceCount = Math.max(1, sentences.length);
    const wordCount = Math.max(1, words.length);

    let totalSyllables = 0;
    let complexWordCount = 0;

    words.forEach(word => {
      const syl = this.countSyllables(word);
      totalSyllables += syl;
      if (syl >= 3) complexWordCount++;
    });

    const wordsPerSentence = wordCount / sentenceCount;
    const syllablesPerWord = totalSyllables / wordCount;

    // Standard Flesch Reading Ease Formula
    let readingEase = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
    readingEase = Math.max(0, Math.min(100, Math.round(readingEase * 10) / 10));

    // Standard Flesch-Kincaid Grade Level Formula
    let gradeLevel = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
    gradeLevel = Math.max(1, Math.round(gradeLevel * 10) / 10);

    // Legalese density check
    const lowerText = text.toLowerCase();
    let legaleseHits = 0;
    COMMON_LEGALESE_TERMS.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) legaleseHits += matches.length;
    });

    const legaleseDensityPercent = Math.min(100, Math.round((legaleseHits / wordCount) * 1000) / 10);

    let gradeLevelDescription = 'Plain English (Middle School)';
    if (gradeLevel >= 16) {
      gradeLevelDescription = 'Post-Graduate Academic / Archaic Legalese';
    } else if (gradeLevel >= 13) {
      gradeLevelDescription = 'College Level (Complex Legal Clauses)';
    } else if (gradeLevel >= 10) {
      gradeLevelDescription = 'High School Level';
    } else if (gradeLevel >= 7) {
      gradeLevelDescription = 'Standard Conversational / Accessible';
    } else {
      gradeLevelDescription = 'Very Easy / Elementary Reading Level';
    }

    return {
      fleschReadingEase: readingEase,
      fleschKincaidGrade: gradeLevel,
      gradeLevelDescription,
      sentenceCount,
      wordCount,
      complexWordCount,
      legaleseDensityPercent,
    };
  }
}
