# LexiChain — Blockchain Module Overview

## 🔗 What does the Blockchain do here?

In the LexiChain BFSI platform, the blockchain acts as a **Digital Notary**. Its primary purpose is to provide **Proof of Existence** and **Proof of Integrity** for sensitive financial and insurance contracts.

### 1. Proof of Existence
When a contract is uploaded, its unique digital fingerprint (SHA-256 hash) is recorded on the blockchain. Because the blockchain is immutable, it provides indisputable proof that the document existed at a specific point in time.

### 2. Tamper Evidence
We don't store the actual PDF on the blockchain (for privacy and cost). We store its **Hash**. If even a single character in the PDF is changed, the hash will change, and the platform will flag the document as invalid or modified.

### 3. Zero-Knowledge Proof
Users can prove they have the original document to any third party (regulators, lawyers) by comparing the file's hash against the public blockchain record, without ever revealing the private contents of the document itself.

---

## 🛠️ The Blockchain Stack

| Technology | Role | Why we used it? |
|:---|:---|:---|
| **Solidity (0.8.24)** | **Smart Contract** | The industry-standard language for Ethereum. It allows us to write the "logic" of the registry (registration, verification, ownership) directly into the blockchain. |
| **Hardhat** | **Development Framework** | Provides a local Ethereum environment. It allows us to test transactions instantly for free and simulate real-world blockchain behavior on a developer machine. |
| **Ethers.js (v6)** | **Integration Library** | A powerful and lightweight library that bridges our Next.js backend with the Ethereum network. It handles the complex math of signing transactions and talking to the smart contract. |
| **Next.js Server Actions** | **Backend Bridge** | We use server-side logic to handle blockchain interactions. This means **users don't need MetaMask** or crypto-wallets; the platform handles the "gas fees" and signing automatically. |
| **Sepolia Testnet** | **Deployment Target** | A public Ethereum test network. It allows us to show the jury a "real" deployment on a global network with real block explorers (Etherscan) without using real money. |
| **SHA-256 Hashing** | **Security Standard** | A cryptographic algorithm that turns any file into a unique 64-character string. It is the "gold standard" for ensuring document integrity. |

---

## 🏆 Key Benefits
*   **Trustless**: You don't have to trust the database administrator; you trust the math.
*   **Transparent**: Transactions are visible to auditors via the Blockchain Explorer.
*   **Privacy-First**: No personal data or document text ever touches the public blockchain.
