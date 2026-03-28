function stripMarkdownFences(value: string): string {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function extractBalancedJson(text: string): string | null {
  let start = -1;
  let inString = false;
  let escaped = false;
  const stack: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (start === -1) {
      if (char === "{" || char === "[") {
        start = i;
        stack.push(char);
      }
      continue;
    }

    if (inString) {
      if (!escaped && char === "\\") {
        escaped = true;
        continue;
      }
      if (!escaped && char === '"') {
        inString = false;
      }
      escaped = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      const last = stack[stack.length - 1];
      const isMatch =
        (last === "{" && char === "}") || (last === "[" && char === "]");

      if (!isMatch) {
        return null;
      }

      stack.pop();

      if (stack.length === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function sanitizeLooseJson(value: string): string {
  return value
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

export function parseJsonResponse(text: string): unknown {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("AI response is empty.");
  }

  const cleaned = stripMarkdownFences(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue to robust fallback
  }

  const extracted = extractBalancedJson(cleaned);
  if (!extracted) {
    throw new Error(
      `No complete JSON object found in AI response. Preview: ${cleaned.slice(0, 220)}`,
    );
  }

  try {
    return JSON.parse(extracted);
  } catch {
    const sanitized = sanitizeLooseJson(extracted);
    try {
      return JSON.parse(sanitized);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown parse error";
      throw new Error(
        `JSON parse failed after recovery attempts: ${message}. Preview: ${sanitized.slice(0, 220)}`,
      );
    }
  }
}
