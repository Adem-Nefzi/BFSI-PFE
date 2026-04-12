import { GoogleGenerativeAI } from "@google/generative-ai";

export class ApiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;
  private genAIInstance: GoogleGenerativeAI;

  constructor() {
    // Collect all provided keys
    const envKeys = [
      process.env.AI_API_KEY1,
      process.env.AI_API_KEY2,
      process.env.AI_API_KEY3,
    ]
      .map((key) => key?.trim())
      .filter(Boolean) as string[];

    this.keys = Array.from(new Set([...envKeys]));

    if (this.keys.length === 0) {
      console.error("❌ No AI API Keys are configured in the environment variables.");
      throw new Error("No Gemini API keys configured. Set AI_API_KEY1, AI_API_KEY2, AI_API_KEY3 in your .env file.");
    }

    // Initialize with the first available key
    this.genAIInstance = new GoogleGenerativeAI(this.keys[this.currentIndex]);
  }

  /**
   * Reset to the first key. Call at the start of each new top-level request
   * so that refreshed/renewed keys get a chance to be tried again.
   */
  resetKeys() {
    this.currentIndex = 0;
    this.genAIInstance = new GoogleGenerativeAI(this.keys[0]);
  }

  private rotateKey() {
    this.currentIndex++;
    if (this.currentIndex >= this.keys.length) {
      this.currentIndex = 0;
      this.genAIInstance = new GoogleGenerativeAI(this.keys[0]);
      throw new Error(
        "CRITICAL_KEY_EXHAUSTION: All available API keys have failed, expired, or run out of quota."
      );
    }
    console.warn(`⚠️ API Key failed. Swapping to backup key #${this.currentIndex + 1}...`);
    this.genAIInstance = new GoogleGenerativeAI(this.keys[this.currentIndex]);
  }

  /**
   * Wraps an SDK call. If it fails due to quota or auth errors, it automatically
   * rotates the key and retries the operation transparently.
   */
  async execute<T>(operation: (client: GoogleGenerativeAI) => Promise<T>): Promise<T> {
    while (true) {
      try {
        return await operation(this.genAIInstance);
      } catch (error: any) {
        const msg = error?.message?.toLowerCase() || "";
        const isAuthOrQuotaError =
          msg.includes("429") ||
          msg.includes("too many requests") ||
          msg.includes("401") ||
          msg.includes("403") ||
          msg.includes("unauthorized") ||
          msg.includes("forbidden") ||
          msg.includes("api key not valid") ||
          msg.includes("api_key_invalid") ||
          msg.includes("quota") ||
          msg.includes("exhausted") ||
          msg.includes("resource has been exhausted") ||
          msg.includes("limit exceeded") ||
          msg.includes("rate limit") ||
          msg.includes("permission denied") ||
          msg.includes("billing") ||
          msg.includes("exceeded your current quota") ||
          error?.status === 429 ||
          error?.status === 403 ||
          error?.status === 401;

        if (isAuthOrQuotaError) {
          const failedKeyIndex = this.currentIndex;
          const failedKeyHint = this.keys[failedKeyIndex]?.slice(0, 10) + "...";
          console.warn(`⚠️ Key #${failedKeyIndex + 1} (${failedKeyHint}) failed: ${msg.slice(0, 120)}`);
          this.rotateKey(); 
          continue; 
        }

        throw error;
      }
    }
  }
}

// Export a robust singleton instance to be shared across services
export const keyManager = new ApiKeyManager();
