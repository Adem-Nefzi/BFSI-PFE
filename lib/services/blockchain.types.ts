// ═══════════════════════════════════════════════════════════════
// Blockchain Types
// ═══════════════════════════════════════════════════════════════
// TypeScript interfaces for all blockchain-related data structures
// used across the service layer, server actions, and UI components.
// ═══════════════════════════════════════════════════════════════

/**
 * Represents the on-chain proof data for a registered document.
 * This is what gets stored in PostgreSQL after a successful blockchain tx.
 */
export interface BlockchainProof {
  documentHash: string;
  txHash: string;
  blockNumber: number;
  blockTimestamp: Date;
  network: "hardhat" | "sepolia";
  contractAddress: string;
  explorerUrl: string | null; // Sepolia etherscan link (null for hardhat)
}

/**
 * Result of verifying a document hash on-chain.
 */
export interface BlockchainVerification {
  exists: boolean;
  timestamp: number; // Unix timestamp (seconds)
  depositor: string; // Ethereum address
}

/**
 * Serialized blockchain transaction for frontend display.
 * All dates are ISO strings for safe JSON serialization across server/client.
 */
export interface BlockchainTransactionView {
  id: string;
  contractId: string;
  contractTitle: string | null;
  contractFileName: string;
  documentHash: string;
  txHash: string;
  blockNumber: number;
  blockTimestamp: string; // ISO string
  network: string;
  contractAddress: string;
  status: string;
  createdAt: string; // ISO string
  explorerUrl: string | null;
}

/**
 * Stats displayed at the top of the blockchain explorer page.
 */
export interface BlockchainStats {
  totalVerified: number;
  latestBlockNumber: number | null;
  networkName: string;
  networkStatus: "connected" | "disconnected";
  walletAddress: string;
  chainId?: number;
}
