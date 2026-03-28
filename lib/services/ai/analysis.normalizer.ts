import {
  NormalizedAnalysis,
  SUPPORTED_CONTRACT_TYPES,
  SupportedContractType,
  ContactInfo,
  KeyPerson,
  ExplainabilityItem,
} from "./analysis.types";

function mapContractType(rawType: unknown): SupportedContractType {
  const value = String(rawType ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (SUPPORTED_CONTRACT_TYPES.includes(value as SupportedContractType)) {
    return value as SupportedContractType;
  }

  const aliases: Record<string, SupportedContractType> = {
    AUTO_INSURANCE: "INSURANCE_AUTO",
    HOME_INSURANCE: "INSURANCE_HOME",
    HEALTH_INSURANCE: "INSURANCE_HEALTH",
    LIFE_INSURANCE: "INSURANCE_LIFE",
    MORTGAGE: "LOAN",
    CREDIT: "LOAN",
    CARD_CREDIT: "CREDIT_CARD",
  };

  return aliases[value] ?? "OTHER";
}

function toStringOrNull(value: unknown): string | null {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeCurrency(value: unknown): string | null {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase();
  if (!raw) return null;

  const symbolMap: Record<string, string> = {
    "€": "EUR",
    $: "USD",
    "£": "GBP",
  };

  if (symbolMap[raw]) {
    return symbolMap[raw];
  }

  // Accept ISO-like 3-letter currencies and common BFSI currencies.
  if (/^[A-Z]{3}$/.test(raw)) {
    return raw;
  }

  return null;
}

function toDateOrNull(value: unknown): string | null {
  const candidate = String(value ?? "").trim();
  if (!candidate) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    return candidate;
  }

  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10);
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter((item) => item.length > 0)
    .slice(0, 25);
}

function parseContactInfo(input: any): ContactInfo {
  return {
    name: toStringOrNull(input?.name),
    email: toStringOrNull(input?.email),
    phone: toStringOrNull(input?.phone),
    address: toStringOrNull(input?.address),
    role: toStringOrNull(input?.role),
  };
}

function parseKeyPeople(input: any): KeyPerson[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 10).map((person) => ({
    name: String(person?.name ?? "").trim() || "Unknown",
    role: toStringOrNull(person?.role),
    email: toStringOrNull(person?.email),
    phone: toStringOrNull(person?.phone),
  }));
}

function parseRelevantDates(input: any): Array<{
  date: string;
  description: string;
  type: "EXPIRATION" | "RENEWAL" | "PAYMENT" | "REVIEW" | "OTHER";
}> {
  if (!Array.isArray(input)) return [];

  return input.slice(0, 15).map((dateObj) => {
    const dateStr = toDateOrNull(dateObj?.date);
    const type = String(dateObj?.type ?? "OTHER").toUpperCase();
    const isValidType = [
      "EXPIRATION",
      "RENEWAL",
      "PAYMENT",
      "REVIEW",
      "OTHER",
    ].includes(type);

    return {
      date: dateStr || "0000-01-01",
      description:
        String(dateObj?.description ?? "")
          .trim()
          .slice(0, 200) || "Important date",
      type: (isValidType ? type : "OTHER") as
        | "EXPIRATION"
        | "RENEWAL"
        | "PAYMENT"
        | "REVIEW"
        | "OTHER",
    };
  });
}

function parseExplainability(input: any): ExplainabilityItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .slice(0, 30)
    .map((item) => {
      const field = String(item?.field ?? "").trim();
      const why = String(item?.why ?? "").trim();
      const sourceSnippet = String(item?.sourceSnippet ?? "").trim();

      if (!field || !why || !sourceSnippet) return null;

      const confidenceRaw = Number(item?.sourceHints?.confidence);
      const confidence = Number.isFinite(confidenceRaw)
        ? Math.max(0, Math.min(100, Math.round(confidenceRaw)))
        : null;

      return {
        field: field.slice(0, 80),
        why: why.slice(0, 260),
        sourceSnippet: sourceSnippet.slice(0, 480),
        sourceHints: {
          page: toStringOrNull(item?.sourceHints?.page),
          section: toStringOrNull(item?.sourceHints?.section),
          confidence,
        },
      } as ExplainabilityItem;
    })
    .filter((value): value is ExplainabilityItem => value !== null);
}

export function normalizeAnalysis(input: any): NormalizedAnalysis {
  const title = String(input?.title || "").trim() || "Untitled Contract";
  const summary = String(input?.summary || "").trim();
  const extractedText = String(input?.extractedText || "").trim();

  if (summary.length < 10) {
    throw new Error("Summary is missing or too short.");
  }

  if (extractedText.length < 30) {
    throw new Error("Extracted text is missing or too short.");
  }

  const premiumValue =
    input?.premium === null || input?.premium === undefined
      ? null
      : Number(input.premium);

  const premium =
    premiumValue !== null && Number.isFinite(premiumValue) && premiumValue >= 0
      ? Number(premiumValue.toFixed(2))
      : null;

  const language = toStringOrNull(input?.language) || "en";

  return {
    title,
    type: mapContractType(input?.type),
    provider: toStringOrNull(input?.provider),
    policyNumber: toStringOrNull(input?.policyNumber),
    startDate: toDateOrNull(input?.startDate),
    endDate: toDateOrNull(input?.endDate),
    premium,
    premiumCurrency: normalizeCurrency(input?.premiumCurrency),
    summary,
    keyPoints: {
      guarantees: toStringList(input?.keyPoints?.guarantees),
      exclusions: toStringList(input?.keyPoints?.exclusions),
      franchise: toStringOrNull(input?.keyPoints?.franchise),
      importantDates: toStringList(input?.keyPoints?.importantDates),
      explainability: parseExplainability(input?.keyPoints?.explainability),
    },
    extractedText: extractedText.slice(0, 12000),
    language,
    keyPeople: parseKeyPeople(input?.keyPeople),
    contactInfo: parseContactInfo(input?.contactInfo),
    importantContacts: Array.isArray(input?.importantContacts)
      ? input.importantContacts
          .slice(0, 10)
          .map((c: any) => parseContactInfo(c))
      : [],
    relevantDates: parseRelevantDates(input?.relevantDates),
  };
}
