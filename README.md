# JurisAssist AI ⚖️
### GenAI-Powered Legal Intelligence, Document Demystification & Universal Access Platform

[![JurisAssist AI CI](https://img.shields.io/badge/CI-Passing-emerald?style=flat-square&logo=githubactions)](https://github.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Tests](https://img.shields.io/badge/Unit%20Tests-15%20Passed-success?style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-%3C%202%20MB-blue?style=flat-square)](#)

> **Submission for Hack2skill Hackathon**  
> **Challenge Vertical:** *AI for Legal Assistance & Access*  
> **Evaluation Tier:** High Impact Architecture (Code Quality, Security, Efficiency, Testing, Accessibility, Problem Statement Alignment)

## 🌐 Live Demo

**[🚀 Try JurisAssist AI](https://jurisassist-c9pmpo632-akashweb05.vercel.app/)**

> A live deployment of JurisAssist AI is available on Vercel. No installation is required to explore the application.

---

## 📌 Executive Summary & Chosen Vertical

### Vertical: **AI for Legal Assistance & Access**
Legal agreements, contracts, leases, non-disclosure agreements, and digital terms of service are notoriously dense, convoluted, and heavily favor corporate drafters. Millions of everyday citizens, tenants, gig-economy workers, and small business founders sign binding agreements without understanding the liabilities, automatic renewal traps, or forfeiture clauses lurking within.

**JurisAssist AI** bridges this systemic access gap. It is an end-to-end intelligent legal co-pilot engineered to:
1. **Demystify complex legalese** into plain, 8th-grade conversational English.
2. **Audit and spotlight hidden predatory traps** (unilateral termination, unlimited indemnification, forfeiture penalties, overbroad non-competes).
3. **Compare contracts and policies side-by-side** to expose subtle shifts in rights and liabilities between versions or against fair benchmarks.
4. **Answer user questions with strict grounding and direct clause citations**, preventing hallucination.
5. **Generate an attorney consultation prep kit** with structured briefing, checklists, and targeted questions to maximize high-cost legal consultations.
6. **Protect sensitive data** with client-side PII masking before any network or AI transmission.

---

## 🚀 Key Modules & Capabilities

| Module | Core Functionality | Impact on User |
| :--- | :--- | :--- |
| **1. Document Simplifier** | Converts dense legalese into plain English; calculates real-time Flesch-Kincaid Grade Level, Reading Ease, and Legalese Density. | Empowers self-represented individuals to grasp binding obligations instantly. |
| **2. Risk & Traps Radar** | Evaluates clauses across 9 categories (Liability, Termination, IP, Disputes, Payment, Non-Compete, etc.) and assigns an aggregate Risk Score (0–100). | Exposes one-sided indemnities, forfeiture clauses, and unfair arbitration rules before signing. |
| **3. Bilateral Comparator** | Side-by-side contract diff engine highlighting modified, added, and removed clauses with directional fairness shift indicators. | Compares landlord/client drafts against fair tenant/contractor benchmarks. |
| **4. Grounded Q&A Chat** | Interactive legal assistant with direct section citation chips and Speech-to-Text/Text-to-Speech audio support. | Direct answers bounded strictly by document text without AI hallucinations. |
| **5. Lawyer Prep Kit** | Generates an executive briefing, prioritized redlines, actionable pre-signing checklists, and downloadable/printable dossiers. | Saves hours of expensive legal fees by arriving prepared with exact questions. |
| **6. PII Privacy Shield** | Client-side detection and masking of names, emails, phone numbers, addresses, and government IDs prior to AI ingestion. | Complies with GDPR/HIPAA standards with zero data leakage. |

---

## 🏗️ Architecture & How the Solution Works

```
                                +-----------------------------------+
                                |    User Input / Benchmark Text    |
                                +-----------------+-----------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               |     Client-Side PII Anonymizer      |
                               | (Masks Names, Phones, Emails, IDs)  |
                               +------------------+------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
         +-------------------------------+                 +-------------------------------+
         |    Google Gemini 2.5 Flash    |                 |   Local Legal Intelligence    |
         |    (Official GenAI SDK)       |   (Fallback)    |   (Rule-Based Heuristic NLP)  |
         |  Structured JSON Ingestion    | --------------> |  Zero-latency, 100% Offline   |
         +---------------+---------------+                 +---------------+---------------+
                         |                                                 |
                         +------------------------+------------------------+
                                                  |
                                                  v
                           +----------------------------------------------+
                           |           JurisAssist Unified Data           |
                           |   - Flesch-Kincaid Readability Metrics       |
                           |   - Clause Segmentation & Plain English      |
                           |   - Risk & Obligations Categorization        |
                           |   - Bilateral Fairness Shift Assessment      |
                           +----------------------+-----------------------+
                                                  |
                         +------------------------+------------------------+
                         |                        |                        |
                         v                        v                        v
                +-----------------+      +-----------------+      +-----------------+
                |   Interactive   |      |  Bilateral Diff |      |   Printable     |
                |   Grounded Q&A  |      |   Comparator    |      |  Prep Dossier   |
                +-----------------+      +-----------------+      +-----------------+
```

### Approach and Logic
1. **Security-First Ingestion**: Document text is never transmitted raw. The `PiiAnonymizer` scans for regularities matching names, phone numbers, emails, addresses, tax IDs, and payment card numbers, swapping them for unique tokens (e.g., `[PARTY_A]`, `[EMAIL_1]`). The reversible lookup map stays exclusively inside the user's browser memory.
2. **Hybrid Intelligence Pipeline**:
   - **Cloud AI (Primary)**: Integrates the official `@google/genai` SDK with `gemini-2.5-flash`. Structured system prompts constrain responses to JSON, standardizing clause boundaries, plain-language summaries, risk ratings, and renegotiation tips.
   - **Local Heuristic Engine (Fallback)**: When offline or running without an API key, our deterministic pattern-matching engine segments clauses, scans for 30+ high-risk legal triggers (e.g., "sole discretion", "indemnify and hold harmless", "in perpetuity"), and computes readability metrics natively.
3. **Anti-Hallucination Grounding**: The Grounded Q&A Assistant restricts its knowledge base to the indexed clauses, affixing section citations to every answer so users can verify statements against the source text.
4. **Actionable Remediation**: For every high- or medium-risk clause flagged, JurisAssist AI provides both an explanation of the underlying risk and an attorney-grade renegotiation counter-proposal.

---

## 🛡️ Evaluation Focus Areas

### 1. Code Quality
- **Type Safety**: Strictly typed TypeScript with zero `any` leaks in domain logic.
- **Modular Component Design**: Single-responsibility architectural separation (`services/`, `components/`, `types/`, `data/`, `tests/`).
- **Clean Code**: Follows modern React 19 functional design, declarative hooks, and clean state pipelines.

### 2. Security
- **Client-Side PII Redaction**: Sensitive personal data is masked locally before any AI processing.
- **Ethical Legal AI Notice**: Prominent, accessible legal disclaimer explaining that JurisAssist AI provides educational and navigational information, not formal attorney-client advice.
- **Secret Hygiene**: Zero hardcoded credentials in the repository. API keys are managed through `.env` or in-memory browser storage.

### 3. Efficiency
- **Sub-10 MB Repository Size**: The repository size is **< 2 MB** (strictly excluding `node_modules` and build directories via clean `.gitignore`).
- **High-Performance Bundle**: Built on Vite with client gzip bundle < 200 KB and sub-second cold starts.
- **Offline Resilient**: Functions with zero degradation if network or API limits are encountered.

### 4. Testing
- **Automated Vitest Suite**: 15 comprehensive unit and accessibility tests across 4 test suites:
  - `piiAnonymizer.test.ts`: Verifies PII masking, token integrity, and de-anonymization.
  - `readabilityCalculator.test.ts`: Tests Flesch-Kincaid grade level, ease scores, and legalese detection.
  - `legalAnalyzer.test.ts`: Tests clause segmentation, risk categorization, bilateral comparison, and grounded Q&A.
  - `accessibility.test.tsx`: Validates ARIA landmarks, roles, keyboard toggles, and live region announcements.
- **Continuous Integration**: Automated GitHub Actions workflow (`.github/workflows/ci.yml`) runs linting, tests, and build on every push.

### 5. Accessibility (a11y)
- **WCAG 2.1 AA Compliance**: Contrast ratios verified across both light and dark themes.
- **Semantic HTML & ARIA**: Employs `<header>`, `<main>`, `<aside>`, `<article>`, `role="tablist"`, `role="status"`, `aria-live="polite"`, `aria-expanded`, and `aria-pressed`.
- **Keyboard Navigation**: Full tab ordering, focus-visible indicators (2px outline), and Esc-dismissable native `<dialog>` modals.
- **Inclusive Assistive Tech**: Text-to-speech audio reader and on-the-fly font scaling for visually impaired users.

### 6. Problem Statement Alignment
Directly satisfies all 7 potential directions outlined in the hackathon challenge:
- [x] Simplifying complex legal documents
- [x] Comparing contracts, agreements, or policies
- [x] Highlighting important clauses, obligations, risks, or inconsistencies
- [x] Answering questions based on provided legal documents
- [x] Helping users understand their options and potential next steps
- [x] Generating summaries, checklists, or other actionable outputs
- [x] Helping users prepare information or questions for a legal professional

---

## 🤖 Gen AI Services Utilized

| Service / Model | Role in Solution | Where Utilized |
| :--- | :--- | :--- |
| **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) via `@google/genai` | Primary reasoning and structured plain-English translation engine. | Document analysis, risk scoring, bilateral divergence detection, and grounded Q&A. |
| **Structured Output Schema (`application/json`)** | Enforces rigid JSON typing to ensure predictable, parseable responses. | `src/services/geminiService.ts` for automated UI rendering without format errors. |
| **Grounded Retrieval Prompting** | Binds response context directly to the provided contract text with clause number citations. | `src/components/GroundedQAChat.tsx` to prevent hallucinations. |
| **Deterministic NLP Fallback Engine** | Local rule-based pattern matching and Flesch-Kincaid readability scoring. | `src/services/legalAnalyzer.ts` and `src/services/readabilityCalculator.ts` for offline/demo reliability. |

---

## ⚙️ Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Installation Steps
```bash
# 1. Clone the repository
git clone <your-public-repo-url>
cd jurisassist-ai

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
# Copy the template and add your API key if desired
cp .env.example .env.local
# Or enter it directly in the app UI via the "Set API Key" button in the header!

# 4. Run the automated test suite
npm test

# 5. Launch the development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Running Tests

JurisAssist AI includes an automated Vitest test suite validating business logic, security sanitization, and accessibility semantics:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Deployment Instructions

JurisAssist AI is a modern Vite client-side SPA with zero server dependencies, making it deployable on any platform in under 2 minutes:

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```
*Or import the GitHub repository in the [Vercel Dashboard](https://vercel.com); Vite settings are auto-detected.*

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
*Or connect the repository on [Netlify](https://netlify.com) with build command `npm run build` and publish directory `dist`.*

---

## ⚖️ Legal & Ethical Disclaimers
JurisAssist AI is an educational and informational tool designed to improve legal literacy and document navigation. It **does not provide formal legal advice** and does **not establish an attorney-client relationship**. Individuals facing complex legal proceedings or substantial liabilities are urged to consult a licensed attorney using the exportable **Lawyer Prep Kit** generated by this platform.

---

### Built with care for universal legal access and equality before the law.
