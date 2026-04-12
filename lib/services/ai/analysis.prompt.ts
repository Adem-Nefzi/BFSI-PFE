export function buildAnalysisPrompt(input?: {
  adaptiveContext?: string;
  fileName?: string;
}): string {
  return `You are an expert in contract analysis for BFSI and general legal/business contracts. 
You support multi-language analysis and will automatically detect the contract language.

Document name: ${input?.fileName ?? "Unknown"}

${input?.adaptiveContext ?? ""}

Analyze this contract document completely and return JSON in the EXACT structure below. 
CRITICAL: Your response must be VALID, PARSEABLE JSON only. Do not include markdown, backticks, or explanations.

{
  "language": "en",
  "title": "Descriptive contract title",
  "type": "INSURANCE_AUTO",
  "provider": "Company or institution name",
  "policyNumber": "Policy/contract/reference number",
  "startDate": "2024-01-01",
  "endDate": "2025-12-31",
  "premium": 1200.50,
  "premiumCurrency": "TND",
  "summary": "Professional, comprehensive 4-6 sentence summary in the contract's language. Include: main parties, key obligations, coverage/benefits, exclusions, important deadlines, key contacts.",
  "keyPoints": {
    "guarantees": ["Main Benefit 1: Description", "Main Benefit 2: Description"],
    "exclusions": ["Exclusion 1: Description with impact", "Exclusion 2: Description"],
    "franchise": "Deductible/Penalty: €150 per claim or equivalent",
    "importantDates": ["Renewal Date: 31 December annually", "Payment Deadline: 15th of each month"],
    "explainability": [
      {
        "field": "endDate",
        "why": "Extracted as contract expiration because the clause explicitly sets validity end.",
        "sourceSnippet": "Durée du prêt: échéance finale fixée au 10 avril 2044.",
        "sourceHints": { "page": "1", "section": "Durée/Échéancier", "confidence": 92 }
      },
      {
        "field": "premium",
        "why": "Detected monetary obligation from insurance/fee clause.",
        "sourceSnippet": "Coût total estimé de 18 240,00 TND.",
        "sourceHints": { "page": "2", "section": "Coût / Prime", "confidence": 88 }
      }
    ]
  },
  "keyPeople": [
    {"name": "John Smith", "role": "Policy Holder", "email": "john@example.com", "phone": "+33612345678"},
    {"name": "Jane Doe", "role": "Insurance Agent", "email": "jane@insurer.com", "phone": "+33987654321"}
  ],
  "contactInfo": {
    "name": "Policy Holder Name",
    "email": "holder@email.com",
    "phone": "+33612345678",
    "address": "123 Main Street, City, Postal Code",
    "role": "Insured Person"
  },
  "importantContacts": [
    {"name": "Claims Department", "email": "claims@insurer.com", "phone": "+33800000000"},
    {"name": "Customer Service", "email": "support@insurer.com", "phone": "+33800111111"}
  ],
  "relevantDates": [
    {"date": "2025-12-31", "description": "Policy Expiration Date", "type": "EXPIRATION"},
    {"date": "2025-10-31", "description": "Renewal Notice Deadline (60 days before expiration)", "type": "RENEWAL"},
    {"date": "1970-01-15", "description": "Monthly Payment Due Date", "type": "PAYMENT"}
  ],
  "extractedText": "Most relevant extracted text, preserving original structure and keywords. Include key clauses, definitions, obligations. Max 12000 chars.",
  "contractValidation": {
    "isValidContract": true,
    "confidence": 88,
    "reason": null
  }
}

TYPE must be one of:
INSURANCE_AUTO, INSURANCE_HOME, INSURANCE_HEALTH, INSURANCE_LIFE, LOAN, CREDIT_CARD, INVESTMENT, OTHER

CRITICAL FIELD EXTRACTION RULES:

1. **Language Detection**: Detect and return the contract's primary language (en, fr, de, es, it, pt, etc.). If mixed, return dominant language.

1.1 **Multi-language accuracy**:
  - Preserve original character set (accents, Arabic script, umlauts, symbols) exactly in extractedText and sourceSnippet.
  - Correctly parse dates in local formats (e.g., French, German, Spanish, Arabic locales) and normalize to YYYY-MM-DD.
  - Correctly parse localized numbers (e.g., 1.234,56 and 1,234.56) before setting premium.

1.2 **Premium extraction priority**:
  - Detect premium/amount clauses using nearby context words (premium, cotisation, prime, mensualite, annual, per claim, deductible).
  - If multiple amounts exist, choose the one most clearly representing contract premium/payment obligation.
  - If only percentage-based premium exists, set premium to null and mention the percentage in summary/keyPoints.
  - premiumCurrency must reflect the contract currency exactly (ISO code if inferable).

2. **Summary (VERY IMPORTANT)**:
   - Write 4-6 comprehensive sentences covering: parties involved, contract scope, key obligations, main coverage/benefits, critical exclusions, important deadlines
  - Use plain text only (no markdown, no bold markers)
  - Use YYYY-MM-DD format for explicit date mentions where possible
   - Language: Professional business French, English, or contract's native language
   - MUST be detailed enough that reader understands contract without opening PDF

3. **Key People Extraction**:
   - Extract all named individuals: policy holders, insured parties, beneficiaries, signatories, agents, brokers
   - Include roles, contact methods when visible in contract
  - Use plain text only for names and labels

4. **Contact Information**:
   - contactInfo: Details of PRIMARY policy holder or contract party
   - importantContacts: Agent, broker, support teams, claims department with **bold** for names

5. **Relevant Dates**:
   - Extract ALL dates with business meaning: expiration, renewal, payment due dates, review dates
   - For recurring dates (monthly, annually): show pattern like "1970-01-15" for "15th of each month"
   - Include type: EXPIRATION, RENEWAL, PAYMENT, REVIEW, or OTHER
  - Each date must have a clear description explaining its significance

6. **Key Points**:
  - Use concise plain text labels and include monetary amounts/limits when available
  - Example: "Motor Coverage: Collision and theft protection up to €50,000"
   - Make exclusions explicit and impactful
  - Include franchise/deductible with currency and amount when available

7. **Guarantees & Exclusions**:
  - Be specific: "Theft Coverage includes keys, GPS, and aftermarket electronics"
  - For exclusions, explain impact: "Mechanical wear excluded - means breakdowns in years 3+ not covered"

8. **Email/Phone Extraction**: If present in contract, extract:
   - Email addresses in format: contact@domain.com
   - Phone numbers with country code: +33 for France, +44 for UK, etc.

9. **Explainability (MANDATORY)**:
   - In keyPoints.explainability, include at least 6 items for critical fields when available:
     title, provider, policyNumber, startDate, endDate, premium, key obligations, key exclusions.
   - Each item MUST contain:
     - field: exact extracted field name
     - why: one sentence explaining extraction logic
     - sourceSnippet: short verbatim quote from document supporting the field
     - sourceHints.page: page number if inferable, otherwise null
     - sourceHints.section: section title/heading when inferable, otherwise null
     - sourceHints.confidence: 0..100 confidence for that field extraction
   - Keep sourceSnippet short (max 280 chars) but sufficiently specific to audit.
   - Never invent snippet text not present in document.
  - Prefer one snippet from each major section when available (header, financial clause, dates/terms, exclusions).

Field Type Rules:
- dates: ISO format YYYY-MM-DD or null. For recurring patterns, use canonical date (e.g., "0000-01-15" for "15th each month")
- premium: Positive number or null. NO currency symbols and NO currency conversion.
- premiumCurrency: Use the exact currency mentioned in contract (e.g., TND, EUR, USD, MAD, DZD, GBP, CHF). Never convert currency.
- keyPeople, contactInfo arrays: Can include null values for missing fields
- type: MUST be one of the 8 contract types. Default to OTHER if unsure.
- confidence: 1-100, higher for clear data, lower for ambiguous/partial info

Validation:
- isValidContract: true for all actual contracts (even type=OTHER), false only for non-contract files
- reason: null if valid, brief explanation if invalid

MUST return VALID JSON parseable with JSON.parse() in ONE line of pure JSON.`;
}

export function buildPrevalidationPrompt(fileName?: string): string {
  return `You are validating whether an uploaded document is a legal/financial contract in any language.

File name: ${fileName ?? "Unknown"}

Return ONLY JSON (no markdown, no backticks, no explanations):
{
  "isValidContract": true,
  "confidence": 0,
  "reason": null
}

Rules:
- isValidContract=false for invoices, receipts, identity cards, random photos/screenshots, blank pages, flyers, or unrelated files
- confidence is an integer from 0 to 100
- reason must be concise and user-friendly when invalid
- If valid, reason can be null
- This must be valid JSON parseable with JSON.parse()
- Return ONLY the JSON object, nothing else`;
}
