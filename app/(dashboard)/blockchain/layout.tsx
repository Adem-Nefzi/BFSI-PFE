import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockchain Explorer | LexiChain",
  description: "View on-chain proofs and verify document integrity",
};

export default function BlockchainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
