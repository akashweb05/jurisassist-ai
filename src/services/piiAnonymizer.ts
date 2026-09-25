/**
 * PII Sanitization & Anonymization Engine
 * Protects user confidentiality before legal documents are processed by AI models.
 * Complies with strict privacy standards (GDPR, HIPAA, and Data Protection principles).
 */

export interface AnonymizationStats {
  emailsMasked: number;
  phonesMasked: number;
  idsMasked: number;
  financialsMasked: number;
  addressesMasked: number;
  partiesMasked: number;
  totalTokensProtected: number;
}

export interface AnonymizationResult {
  sanitizedText: string;
  mapping: Record<string, string>; // placeholder -> original
  reverseMapping: Record<string, string>; // original -> placeholder
  stats: AnonymizationStats;
}

export class PiiAnonymizer {
  private static EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  private static PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  private static SSN_OR_TAX_REGEX = /\b\d{3}-\d{2}-\d{4}\b|\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b|\b\d{4}\s\d{4}\s\d{4}\b/g;
  private static CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  private static ADDRESS_REGEX = /\b\d{1,5}\s+[A-Za-z0-9\s.,#-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Sector|Noida|Delhi|Bengaluru|Bangalore|New York|CA|NY|TX|FL)\b[,\s\w\d]*/gi;

  /**
   * Scans legal text, detects sensitive identifiers, and substitutes them with safe tokens.
   */
  public static anonymize(rawText: string, customParties: string[] = []): AnonymizationResult {
    let sanitizedText = rawText;
    const mapping: Record<string, string> = {};
    const reverseMapping: Record<string, string> = {};

    let emailCount = 0;
    let phoneCount = 0;
    let idCount = 0;
    let finCount = 0;
    let addressCount = 0;
    let partyCount = 0;

    const registerToken = (original: string, placeholder: string): string => {
      const trimmed = original.trim();
      if (!reverseMapping[trimmed]) {
        reverseMapping[trimmed] = placeholder;
        mapping[placeholder] = trimmed;
      }
      return reverseMapping[trimmed];
    };

    // 1. Mask Custom Specified Parties
    customParties.forEach((party, idx) => {
      const cleanParty = party ? party.trim() : '';
      if (cleanParty.length > 1) {
        const escaped = cleanParty.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefix = /^\w/.test(cleanParty) ? '\\b' : '';
        const suffix = /\w$/.test(cleanParty) ? '\\b' : '';
        const regex = new RegExp(`${prefix}${escaped}${suffix}`, 'gi');
        sanitizedText = sanitizedText.replace(regex, (match) => {
          partyCount++;
          const token = `[PARTY_${String.fromCharCode(65 + idx)}]`;
          return registerToken(match, token);
        });
      }
    });

    // 2. Mask Credit Cards
    sanitizedText = sanitizedText.replace(this.CREDIT_CARD_REGEX, (match) => {
      finCount++;
      const token = `[CREDIT_CARD_${finCount}]`;
      return registerToken(match, token);
    });

    // 3. Mask SSN / Tax / National IDs
    sanitizedText = sanitizedText.replace(this.SSN_OR_TAX_REGEX, (match) => {
      idCount++;
      const token = `[GOV_ID_${idCount}]`;
      return registerToken(match, token);
    });

    // 4. Mask Emails
    sanitizedText = sanitizedText.replace(this.EMAIL_REGEX, (match) => {
      emailCount++;
      const token = `[EMAIL_${emailCount}]`;
      return registerToken(match, token);
    });

    // 5. Mask Phone Numbers
    sanitizedText = sanitizedText.replace(this.PHONE_REGEX, (match) => {
      phoneCount++;
      const token = `[PHONE_${phoneCount}]`;
      return registerToken(match, token);
    });

    // 6. Mask Addresses
    sanitizedText = sanitizedText.replace(this.ADDRESS_REGEX, (match) => {
      addressCount++;
      const token = `[ADDRESS_${addressCount}]`;
      return registerToken(match, token);
    });

    const total = emailCount + phoneCount + idCount + finCount + addressCount + partyCount;

    return {
      sanitizedText,
      mapping,
      reverseMapping,
      stats: {
        emailsMasked: emailCount,
        phonesMasked: phoneCount,
        idsMasked: idCount,
        financialsMasked: finCount,
        addressesMasked: addressCount,
        partiesMasked: partyCount,
        totalTokensProtected: total,
      },
    };
  }

  /**
   * Reconstitutes anonymized text back to original for private client-side display.
   */
  public static deanonymize(sanitizedText: string, mapping: Record<string, string>): string {
    let restored = sanitizedText;
    for (const [placeholder, original] of Object.entries(mapping)) {
      // Escape bracket characters for regexp
      const escaped = placeholder.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
      restored = restored.replace(new RegExp(escaped, 'g'), original);
    }
    return restored;
  }
}
