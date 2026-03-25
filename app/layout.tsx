import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";

// Modern sans-serif font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Monospace font for code and numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "LexiChain - AI-Powered Contract Management",
    template: "%s | LexiChain",
  },
  description:
    "Intelligent BFSI contract management platform with AI-powered analysis. Manage your insurance, loan, and financial contracts with blockchain-verified security.",
  keywords: [
    "contract management",
    "insurance",
    "BFSI",
    "AI contract analysis",
    "document management",
    "blockchain",
    "smart contracts",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "LexiChain",
  metadataBase: new URL("https://lexichain.com"), // Replace with your domain
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lexichain.com",
    title: "LexiChain - AI-Powered Contract Management",
    description:
      "Intelligent contract management platform with AI analysis and blockchain verification.",
    siteName: "LexiChain",
    images: [
      {
        url: "/og-image.png", // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: "LexiChain Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LexiChain - AI-Powered Contract Management",
    description:
      "Intelligent contract management platform with AI analysis and blockchain verification.",
    images: ["/og-image.png"],
    creator: "@lexichain", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
