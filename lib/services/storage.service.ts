// src/lib/services/storage.service.ts

export class StorageService {
  // Validate file type
  static isValidFileType(file: File): boolean {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    return allowedTypes.includes(file.type);
  }

  // Validate file size (max 10MB)
  static isValidFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }

  // Extract filename from UploadThing URL
  static extractFileName(url: string): string {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path.split("/").pop() || "unknown";
    } catch {
      return "unknown";
    }
  }

  // Extract file key from UploadThing URL for deletion
  // URL format: https://utfs.io/f/{fileKey}
  static extractFileKey(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const fileKey = pathParts[pathParts.length - 1];
      return fileKey || null;
    } catch (error) {
      console.error("Failed to extract file key from URL:", error);
      return null;
    }
  }

  // Check if URL is from UploadThing
  static isUploadThingUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("utfs.io") ||
        urlObj.hostname.includes("uploadthing")
      );
    } catch {
      return false;
    }
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}
