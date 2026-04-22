"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Link2,
  Shield,
  Activity,
  Hash,
  Clock,
  FileText,
  CheckCircle2,
  Search,
  RefreshCw,
  ExternalLink,
  Blocks,
  Copy,
  Check,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBlockchainTransactions,
  getBlockchainStats,
  verifyDocumentHashOnBlockchain,
  registerContractOnBlockchain,
} from "@/features/blockchain/api/blockchain.action";
import { getContracts } from "@/features/contracts/api/contract.action";
import type {
  BlockchainTransactionView,
  BlockchainStats,
} from "@/lib/services/blockchain.types";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// Blockchain Explorer Page
// ═══════════════════════════════════════════════════════════════

export default function BlockchainExplorerPage() {
  const [transactions, setTransactions] = useState<BlockchainTransactionView[]>([]);
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<{
    exists: boolean;
    timestamp: number;
    depositor: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [unregisteredContracts, setUnregisteredContracts] = useState<
    Array<{ id: string; title: string | null; fileName: string }>
  >([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txResult, statsResult, contractsResult] = await Promise.all([
        getBlockchainTransactions(),
        getBlockchainStats(),
        getContracts({ status: "COMPLETED" }),
      ]);

      if (txResult.success && txResult.transactions) {
        setTransactions(txResult.transactions);
      }
      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }

      // Find contracts not yet on blockchain
      if (contractsResult.success && contractsResult.contracts) {
        const registered = new Set(
          txResult.transactions?.map((tx) => tx.contractId) ?? []
        );
        const unregistered = contractsResult.contracts
          .filter(
            (c: { id: string; txHash?: string | null; status: string }) =>
              !c.txHash && !registered.has(c.id) && c.status === "COMPLETED"
          )
          .map((c: { id: string; title: string | null; fileName: string }) => ({
            id: c.id,
            title: c.title,
            fileName: c.fileName,
          }));
        setUnregisteredContracts(unregistered);
      }
    } catch (error) {
      console.error("Failed to load blockchain data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVerify = async () => {
    if (!verifyHash.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyDocumentHashOnBlockchain(verifyHash.trim());
      if (result.success && result.verification) {
        setVerifyResult(result.verification);
      } else {
        toast.error(result.error || "Verification failed");
      }
    } catch {
      toast.error("Failed to verify hash");
    } finally {
      setVerifying(false);
    }
  };

  const handleRegister = async (contractId: string) => {
    setRegisteringId(contractId);
    try {
      const result = await registerContractOnBlockchain(contractId);
      if (result.success) {
        toast.success("Contract registered on blockchain!");
        await loadData();
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch {
      toast.error("Failed to register on blockchain");
    } finally {
      setRegisteringId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString();
  };

  const truncateHash = (hash: string, chars = 8) => {
    if (!hash || hash.length <= chars * 2 + 3) return hash;
    return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Blocks className="w-6 h-6 text-primary" />
            </div>
            Blockchain Explorer
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View on-chain proofs and verify document integrity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          icon={<Shield className="w-5 h-5" />}
          label="Verified Documents"
          value={stats?.totalVerified?.toString() ?? "0"}
          color="emerald"
        />
        <StatsCard
          icon={<Blocks className="w-5 h-5" />}
          label="Latest Block"
          value={stats?.latestBlockNumber ? `#${stats.latestBlockNumber.toLocaleString()}` : "—"}
          color="blue"
        />
        <StatsCard
          icon={<Activity className="w-5 h-5" />}
          label="Network"
          value={stats?.networkName ? `${stats.networkName} ${stats.chainId ? `(Chain ${stats.chainId})` : ""}` : "Not Configured"}
          color={stats?.networkStatus === "connected" ? "emerald" : "red"}
          badge={stats?.networkStatus === "connected" ? "● Live" : "● Offline"}
        />
        <StatsCard
          icon={<Hash className="w-5 h-5" />}
          label="Wallet"
          value={stats?.walletAddress ? truncateHash(stats.walletAddress, 6) : "—"}
          color="violet"
        />
      </motion.div>

      {/* Unregistered contracts */}
      {unregisteredContracts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Upload className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {unregisteredContracts.length} contract{unregisteredContracts.length > 1 ? "s" : ""} not yet on blockchain
            </h3>
          </div>
          <div className="space-y-2">
            {unregisteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between rounded-xl bg-background/60 border border-border/40 px-4 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">
                    {contract.title || contract.fileName}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs shrink-0 ml-3"
                  disabled={registeringId === contract.id}
                  onClick={() => handleRegister(contract.id)}
                >
                  {registeringId === contract.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Link2 className="w-3 h-3" />
                  )}
                  Register
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl overflow-hidden"
        >
          <div className="p-5 border-b border-border/40">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              Transaction History
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              All documents registered on the blockchain
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Blocks className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No transactions yet</p>
              <p className="text-xs mt-1">
                Upload and analyze a contract to register it on-chain
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {transactions.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {tx.contractTitle || tx.contractFileName}
                        </span>
                        <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground group">
                          <Shield className="w-3 h-3 shrink-0 text-emerald-500/70" />
                          <span className="font-mono text-[10px]">Fingerprint: {truncateHash(tx.documentHash, 12)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.documentHash)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
                            title="Copy Document Fingerprint"
                          >
                            {copiedTx === tx.documentHash ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="w-3 h-3 shrink-0" />
                          <span className="font-mono">Tx: {truncateHash(tx.txHash, 12)}</span>
                          <button
                            onClick={() => copyToClipboard(tx.txHash)}
                            className="hover:text-foreground transition-colors"
                            title="Copy Transaction Hash"
                          >
                            {copiedTx === tx.txHash ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Blocks className="w-3 h-3 shrink-0" />
                          Block #{tx.blockNumber.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatTimestamp(tx.blockTimestamp)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {tx.network === "sepolia" ? "Sepolia" : "Hardhat"}
                      </span>
                      {tx.explorerUrl && (
                        <a
                          href={tx.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Etherscan
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Verification Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl h-fit"
        >
          <div className="p-5 border-b border-border/40">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Verify Document
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Check if a document hash exists on-chain
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Document Hash (SHA-256)
              </label>
              <textarea
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-xs font-mono resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!verifyHash.trim() || verifying}
              className="w-full gap-2"
              size="sm"
            >
              {verifying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Verify On-Chain
            </Button>

            {/* Verification Result */}
            {verifyResult !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl border p-4 ${
                  verifyResult.exists
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {verifyResult.exists ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      verifyResult.exists
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {verifyResult.exists
                      ? "✓ Document Verified"
                      : "✗ Not Found"}
                  </span>
                </div>

                {verifyResult.exists && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp</span>
                      <span className="font-mono">
                        {new Date(verifyResult.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depositor</span>
                      <span className="font-mono">
                        {truncateHash(verifyResult.depositor, 6)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Stats Card Sub-Component
// ─────────────────────────────────────────────────

function StatsCard({
  icon,
  label,
  value,
  color,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  badge?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    violet: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    red: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  };

  const iconColors: Record<string, string> = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    violet: "text-violet-500",
    red: "text-red-500",
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
          <span className={iconColors[color]}>{icon}</span>
        </div>
        {badge && (
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              badge.includes("Live")
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : "text-red-600 dark:text-red-400 bg-red-500/10"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground mt-0.5 truncate">{value}</p>
    </div>
  );
}
