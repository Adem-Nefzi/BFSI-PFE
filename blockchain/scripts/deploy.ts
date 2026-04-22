import { ethers } from "hardhat";

/**
 * Deployment Script for DocumentRegistry
 *
 * Usage:
 *   Local:   npx hardhat run scripts/deploy.ts --network localhost
 *   Sepolia: npx hardhat run scripts/deploy.ts --network sepolia
 *
 * After deployment, copy the contract address into your .env file:
 *   BLOCKCHAIN_CONTRACT_ADDRESS=0x...
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 Deploying DocumentRegistry...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} ETH`);

  // Deploy the contract
  const DocumentRegistryFactory = await ethers.getContractFactory("DocumentRegistry");
  const registry = await DocumentRegistryFactory.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ DocumentRegistry deployed to: ${address}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("📋 Next steps:");
  console.log(`   1. Add to your .env file:`);
  console.log(`      BLOCKCHAIN_CONTRACT_ADDRESS=${address}`);
  console.log(`   2. The contract is ready to register documents!`);
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
