export const SUPPORTED_CONTRACT_TYPES = [
  "INSURANCE_AUTO",
  "INSURANCE_HOME",
  "INSURANCE_HEALTH",
  "INSURANCE_LIFE",
  "LOAN",
  "CREDIT_CARD",
  "INVESTMENT",
  "OTHER",
] as const;

export type SupportedContractType = (typeof SUPPORTED_CONTRACT_TYPES)[number];

export type AnalyzeOptions = {
  userId?: string;
  fileName?: string;
  maxRetries?: number;
  forceFallbackModelTest?: boolean;
};

export type ContactInfo = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
};

export type KeyPerson = {
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type ExplainabilityItem = {
  field: string;
  why: string;
  sourceSnippet: string;
  sourceHints?: {
    page?: string | null;
    section?: string | null;
    confidence?: number | null;
  };
};

export type NormalizedAnalysis = {
  title: string;
  type: SupportedContractType;
  provider: string | null;
  policyNumber: string | null;
  startDate: string | null;
  endDate: string | null;
  premium: number | null;
  premiumCurrency?: string | null;
  summary: string;
  keyPoints: {
    guarantees: string[];
    exclusions: string[];
    franchise: string | null;
    importantDates: string[];
    explainability?: ExplainabilityItem[];
  };
  extractedText: string;
  // New enhanced fields
  language?: string | null;
  keyPeople: KeyPerson[];
  contactInfo: ContactInfo;
  importantContacts: ContactInfo[];
  relevantDates: Array<{
    date: string;
    description: string;
    type: "EXPIRATION" | "RENEWAL" | "PAYMENT" | "REVIEW" | "OTHER";
  }>;
};

export type ContractPrecheckResult = {
  isValidContract: boolean;
  confidence: number;
  reason: string | null;
};
