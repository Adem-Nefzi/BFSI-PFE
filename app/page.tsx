import { Metadata } from "next";
import { HomePage } from "@/features/home/components/HomePage";

export const metadata: Metadata = {
  title: "LexiChain | AI-Powered Fast Contract Management",
  description: "Accelerate your BFSI contract management with AI. LexiChain is the premier blockchain-verified platform for smart contracts, loans, and insurance.",
  openGraph: {
    title: "LexiChain | AI-Powered Fast Contract Management",
    description: "Accelerate your BFSI contract management with AI. LexiChain is the premier blockchain-verified platform for smart contracts, loans, and insurance.",
  }
};

export default function Home() {
  return <HomePage />;
}
