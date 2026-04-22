/**
 * Blockchain Server Actions
 *
 * Server-side functions for blockchain operations:
 * - Register a contract document on the blockchain
 * - Verify a contract's on-chain proof
 * - Get all blockchain transactions for the user
 * - Get blockchain network stats
 *
 * These actions are called from the frontend via React Server Actions.
 * All blockchain logic runs server-side (no MetaMask needed).
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { BlockchainService } from "@/lib/services/blockchain.service";
import { NotificationService } from "@/lib/services/notification.service";
import { ContractService } from "@/lib/services/contract.service";
import type { BlockchainTransactionView, BlockchainStats } from "@/lib/services/blockchain.types";

/**
 * Register a contract's document on the blockchain.
 *
 * FLOW:
 * 1. Authenticate user
 * 2. Fetch contract from DB
 * 3. Download PDF and compute SHA-256 hash
 * 4. Send hash to the smart contract on-chain
 * 5. Store proof data (txHash, blockNumber, etc.) in PostgreSQL
 * 6. Create a BlockchainTransaction record for the explorer
 * 7. Create a notification for the user
 *
 * @param contractId - The contract ID to register
 */
export async function registerContractOnBlockchain(contractId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    // Check if blockchain is configured
    if (!BlockchainService.isConfigured()) {
      return {
        success: false,
        error: "Blockchain not configured. Start a Hardhat node and check your .env.",
      };
    }

    // Get internal user
    const user = await ContractService.getUserByClerkId(clerkId);
    if (!user) return { success: false, error: "User not found" };

    // Get the contract
    const contract = await ContractService.getById(contractId);
    if (contract.userId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if already registered
    if (contract.txHash && contract.txHash !== "already-registered") {
      return {
        success: true,
        message: "Contract already registered on blockchain",
        proof: {
          documentHash: contract.documentHash,
          txHash: contract.txHash,
          blockNumber: contract.blockNumber,
        },
      };
    }

    // Hash the document and register on-chain
    const proof = await BlockchainService.hashAndRegister(
      contract.fileUrl,
      contract.fileName
    );

    // Save proof data to the Contract record
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        documentHash: proof.documentHash,
        txHash: proof.txHash,
        blockNumber: proof.blockNumber,
        blockTimestamp: proof.blockTimestamp,
        blockchainNetwork: proof.network,
        contractAddress: proof.contractAddress,
      },
    });

    // Create a BlockchainTransaction record for the explorer
    await prisma.blockchainTransaction.create({
      data: {
        userId: user.id,
        contractId,
        documentHash: proof.documentHash,
        txHash: proof.txHash,
        blockNumber: proof.blockNumber,
        blockTimestamp: proof.blockTimestamp,
        network: proof.network,
        contractAddress: proof.contractAddress,
        status: "CONFIRMED",
      },
    });

    // Create success notification
    await NotificationService.create({
      userId: user.id,
      type: "SUCCESS",
      title: "🔗 Blockchain Verified",
      message: `"${contract.title || contract.fileName}" has been registered on-chain. Tx: ${proof.txHash.slice(0, 16)}...`,
      contractId,
      actionType: "BLOCKCHAIN_REGISTERED",
      icon: "Link2",
      expiresIn: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    revalidatePath("/contacts");
    revalidatePath("/dashboard");
    revalidatePath("/blockchain");

    return {
      success: true,
      message: "Document registered on blockchain!",
      proof: {
        documentHash: proof.documentHash,
        txHash: proof.txHash,
        blockNumber: proof.blockNumber,
        blockTimestamp: proof.blockTimestamp.toISOString(),
        network: proof.network,
        explorerUrl: proof.explorerUrl,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Blockchain registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown blockchain error",
    };
  }
}

/**
 * Verify a contract's on-chain proof by checking the blockchain directly.
 */
export async function verifyContractOnBlockchain(contractId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    if (!BlockchainService.isReadConfigured()) {
      return { success: false, error: "Blockchain not configured for verification" };
    }

    const user = await ContractService.getUserByClerkId(clerkId);
    if (!user) return { success: false, error: "User not found" };

    const contract = await ContractService.getById(contractId);
    if (contract.userId !== user.id) return { success: false, error: "Unauthorized" };

    if (!contract.documentHash) {
      return {
        success: true,
        verification: { exists: false, timestamp: 0, depositor: "" },
      };
    }

    const verification = await BlockchainService.verifyOnChain(contract.documentHash);

    return {
      success: true,
      verification: {
        exists: verification.exists,
        timestamp: verification.timestamp,
        depositor: verification.depositor,
        documentHash: contract.documentHash,
        txHash: contract.txHash,
        blockNumber: contract.blockNumber,
        network: contract.blockchainNetwork,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Blockchain verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify a raw document hash on-chain (for the verification panel).
 */
export async function verifyDocumentHashOnBlockchain(documentHash: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    if (!BlockchainService.isReadConfigured()) {
      return { success: false, error: "Blockchain not configured for verification" };
    }

    // Ensure proper format
    const rawHash = documentHash.trim();
    const hash = rawHash.startsWith("0x") ? rawHash : `0x${rawHash}`;

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      return {
        success: false,
        error: "Invalid hash format. Expected a 32-byte SHA-256 hex string.",
      };
    }

    const verification = await BlockchainService.verifyOnChain(hash);

    return {
      success: true,
      verification: {
        exists: verification.exists,
        timestamp: verification.timestamp,
        depositor: verification.depositor,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Hash verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all blockchain transactions for the authenticated user.
 * Used by the blockchain explorer page.
 */
export async function getBlockchainTransactions(): Promise<{
  success: boolean;
  transactions?: BlockchainTransactionView[];
  error?: string;
}> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    const user = await ContractService.getUserByClerkId(clerkId);
    if (!user) return { success: false, error: "User not found" };

    const txs = await prisma.blockchainTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            fileName: true,
          },
        },
      },
    });

    const transactions: BlockchainTransactionView[] = txs.map((tx) => ({
      id: tx.id,
      contractId: tx.contractId,
      contractTitle: tx.contract.title,
      contractFileName: tx.contract.fileName,
      documentHash: tx.documentHash,
      txHash: tx.txHash,
      blockNumber: tx.blockNumber,
      blockTimestamp: tx.blockTimestamp.toISOString(),
      network: tx.network,
      contractAddress: tx.contractAddress,
      status: tx.status,
      createdAt: tx.createdAt.toISOString(),
      explorerUrl:
        tx.network === "sepolia"
          ? `https://sepolia.etherscan.io/tx/${tx.txHash}`
          : null,
    }));

    return { success: true, transactions };
  } catch (error: unknown) {
    console.error("❌ Get transactions error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get blockchain network stats for the explorer page header.
 */
export async function getBlockchainStats(): Promise<{
  success: boolean;
  stats?: BlockchainStats;
  error?: string;
}> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Unauthorized" };

    const stats = await BlockchainService.getNetworkStats();
    return { success: true, stats };
  } catch (error: unknown) {
    console.error("❌ Blockchain stats error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
