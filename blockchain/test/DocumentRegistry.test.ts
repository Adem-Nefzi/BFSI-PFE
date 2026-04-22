import { expect } from "chai";
import { ethers } from "hardhat";
import { DocumentRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * DocumentRegistry Smart Contract Tests
 *
 * These tests verify all core functionality:
 * 1. Document registration with timestamp
 * 2. Document verification
 * 3. Duplicate prevention
 * 4. Non-existent document handling
 * 5. Depositor document tracking
 * 6. Ownership controls
 */
describe("DocumentRegistry", function () {
  let registry: DocumentRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  // Sample document hashes (simulating SHA-256 hashes)
  const docHash1 = ethers.keccak256(ethers.toUtf8Bytes("contract-insurance-auto-2024.pdf"));
  const docHash2 = ethers.keccak256(ethers.toUtf8Bytes("contract-home-loan-2024.pdf"));
  const docHash3 = ethers.keccak256(ethers.toUtf8Bytes("contract-health-insurance.pdf"));

  beforeEach(async function () {
    // Get test accounts (Hardhat provides 20 free accounts)
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy new contract instance before each test
    const DocumentRegistryFactory = await ethers.getContractFactory("DocumentRegistry");
    registry = await DocumentRegistryFactory.deploy();
    await registry.waitForDeployment();
  });

  // ═══════════════════════════════════════════════════
  // DEPLOYMENT TESTS
  // ═══════════════════════════════════════════════════

  describe("Deployment", function () {
    it("should set the deployer as owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("should start with zero documents", async function () {
      expect(await registry.totalDocuments()).to.equal(0);
    });
  });

  // ═══════════════════════════════════════════════════
  // REGISTRATION TESTS
  // ═══════════════════════════════════════════════════

  describe("Document Registration", function () {
    it("should register a document and emit event", async function () {
      const tx = await registry.registerDocument(docHash1);
      const receipt = await tx.wait();

      // Verify event was emitted
      await expect(tx)
        .to.emit(registry, "DocumentRegistered")
        .withArgs(docHash1, (await ethers.provider.getBlock(receipt!.blockNumber))!.timestamp, owner.address);
    });

    it("should store correct timestamp", async function () {
      const tx = await registry.registerDocument(docHash1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);

      const timestamp = await registry.getTimestamp(docHash1);
      expect(timestamp).to.equal(block!.timestamp);
    });

    it("should increment totalDocuments counter", async function () {
      await registry.registerDocument(docHash1);
      expect(await registry.totalDocuments()).to.equal(1);

      await registry.registerDocument(docHash2);
      expect(await registry.totalDocuments()).to.equal(2);
    });

    it("should prevent duplicate registration (same hash)", async function () {
      await registry.registerDocument(docHash1);

      await expect(
        registry.registerDocument(docHash1)
      ).to.be.revertedWith("Document already registered on-chain");
    });

    it("should prevent non-owners from registering documents", async function () {
      await expect(
        registry.connect(user1).registerDocument(docHash1)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  // ═══════════════════════════════════════════════════
  // VERIFICATION TESTS
  // ═══════════════════════════════════════════════════

  describe("Document Verification", function () {
    it("should verify a registered document", async function () {
      await registry.registerDocument(docHash1);

      const [exists, timestamp, depositor] = await registry.verifyDocument(docHash1);
      expect(exists).to.be.true;
      expect(timestamp).to.be.greaterThan(0);
      expect(depositor).to.equal(owner.address);
    });

    it("should return false for unregistered document", async function () {
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("non-existent.pdf"));

      const [exists, timestamp, depositor] = await registry.verifyDocument(fakeHash);
      expect(exists).to.be.false;
      expect(timestamp).to.equal(0);
      expect(depositor).to.equal(ethers.ZeroAddress);
    });
  });

  // ═══════════════════════════════════════════════════
  // DEPOSITOR TRACKING TESTS
  // ═══════════════════════════════════════════════════

  describe("Depositor Tracking", function () {
    it("should track all documents by a depositor", async function () {
      await registry.registerDocument(docHash1);
      await registry.registerDocument(docHash2);

      const docs = await registry.getDocumentsByDepositor(owner.address);
      expect(docs.length).to.equal(2);
      expect(docs[0]).to.equal(docHash1);
      expect(docs[1]).to.equal(docHash2);
    });

    it("should return correct document count", async function () {
      await registry.registerDocument(docHash1);
      await registry.registerDocument(docHash2);
      await registry.registerDocument(docHash3);

      expect(await registry.getDocumentCount(owner.address)).to.equal(3);
      expect(await registry.getDocumentCount(user2.address)).to.equal(0);
    });
  });

  // ═══════════════════════════════════════════════════
  // OWNERSHIP TESTS
  // ═══════════════════════════════════════════════════

  describe("Ownership", function () {
    it("should transfer ownership", async function () {
      await registry.transferOwnership(user1.address);
      expect(await registry.owner()).to.equal(user1.address);
    });

    it("should prevent non-owner from transferring ownership", async function () {
      await expect(
        registry.connect(user1).transferOwnership(user2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("should prevent transfer to zero address", async function () {
      await expect(
        registry.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });
  });
});
