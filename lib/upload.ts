// src/lib/uploadthing.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  // Contract uploader
  contractUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    // Middleware: runs BEFORE upload
    .middleware(async () => {
      // Authenticate user
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      // Pass user ID to onUploadComplete
      return { userId };
    })
    // Callback: runs AFTER upload is complete
    .onUploadComplete(async ({ metadata, file }) => {

      // File info is available:
      // - file.url (CDN URL)
      // - file.name (original filename)
      // - file.size (bytes)
      // - file.key (unique identifier)

      // You can save to database here or return data to client
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
