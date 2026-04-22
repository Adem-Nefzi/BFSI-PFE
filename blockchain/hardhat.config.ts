import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// ─────────────────────────────────────────────────
// Hardhat Configuration
// ─────────────────────────────────────────────────
// This file configures the Solidity compiler and
// network settings for our smart contract.
//
// Networks:
//   - hardhat (default): In-memory local blockchain, free & instant
//   - localhost: Persistent local node via `npx hardhat node`
//   - sepolia: Ethereum testnet for demo/presentation
// ─────────────────────────────────────────────────

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // Local persistent node (run `npx hardhat node` first)
    localhost: {
      url: "http://127.0.0.1:8545",
    },

    // Ethereum Sepolia testnet (free, for demo/jury presentation)
    // Requires SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY in env
    ...(process.env.SEPOLIA_RPC_URL
      ? {
          sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: process.env.DEPLOYER_PRIVATE_KEY
              ? [process.env.DEPLOYER_PRIVATE_KEY]
              : [],
            chainId: 11155111,
          },
        }
      : {}),
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
