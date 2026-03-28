// src/types/contract.types.ts

export type ContractType =
  | "INSURANCE_AUTO"
  | "INSURANCE_HOME"
  | "INSURANCE_HEALTH"
  | "INSURANCE_LIFE"
  | "LOAN"
  | "CREDIT_CARD"
  | "INVESTMENT"
  | "OTHER";

export type ContractStatus = "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Contract {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;

  // AI-determined
  title: string | null;
  type: ContractType | null;
  provider: string | null;
  policyNumber: string | null;
  startDate: Date | null;
  endDate: Date | null;
  premium: number | null;

  status: ContractStatus;

  extractedText: string | null;
  summary: string | null;
  keyPoints: {
    guarantees?: string[];
    exclusions?: string[];
    franchise?: string;
    importantDates?: string[];
    explainability?: Array<{
      field: string;
      why: string;
      sourceSnippet: string;
      sourceHints?: {
        page?: string | null;
        section?: string | null;
        confidence?: number | null;
      };
    }>;
  } | null;

  documentHash: string | null;
  txHash: string | null;
  ipfsUrl: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface UploadContractInput {
  file: File;
}

export interface ContractFilters {
  type?: ContractType;
  status?: ContractStatus;
  search?: string;
}

export interface ContractStats {
  total: number;
  active: number;
  expired: number;
  expiringSoon: number;
}

export interface AIAnalysisResult {
  title: string;
  type: ContractType;
  provider?: string;
  policyNumber?: string;
  startDate?: Date;
  endDate?: Date;
  premium?: number;
  summary: string;
  keyPoints: {
    guarantees?: string[];
    exclusions?: string[];
    franchise?: string;
    importantDates?: string[];
    explainability?: Array<{
      field: string;
      why: string;
      sourceSnippet: string;
      sourceHints?: {
        page?: string | null;
        section?: string | null;
        confidence?: number | null;
      };
    }>;
  };
}
