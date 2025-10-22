const hre = require("hardhat");

async function main() {
  console.log("🚀 Memulai deployment BlockRights Smart Contracts...\n");

  // Get the contract factories
  const BlockRightsNFT = await hre.ethers.getContractFactory("BlockRightsNFT");
  const BlockRightsMarketplace = await hre.ethers.getContractFactory("BlockRightsMarketplace");
  const BlockRightsVerification = await hre.ethers.getContractFactory("BlockRightsVerification");

  // Deploy BlockRightsNFT
  console.log("📝 Deploying BlockRightsNFT...");
  const nftContract = await BlockRightsNFT.deploy();
  await nftContract.deployed();
  console.log("✅ BlockRightsNFT deployed to:", nftContract.address);

  // Deploy BlockRightsMarketplace
  console.log("🏪 Deploying BlockRightsMarketplace...");
  const marketplaceContract = await BlockRightsMarketplace.deploy(nftContract.address);
  await marketplaceContract.deployed();
  console.log("✅ BlockRightsMarketplace deployed to:", marketplaceContract.address);

  // Deploy BlockRightsVerification
  console.log("🔍 Deploying BlockRightsVerification...");
  const verificationContract = await BlockRightsVerification.deploy();
  await verificationContract.deployed();
  console.log("✅ BlockRightsVerification deployed to:", verificationContract.address);

  // Set marketplace contract sebagai operator untuk NFT contract
  console.log("🔗 Setting marketplace as operator...");
  await nftContract.setApprovalForAll(marketplaceContract.address, true);
  console.log("✅ Marketplace set as operator");

  // Display deployment summary
  console.log("\n📋 Deployment Summary:");
  console.log("=" .repeat(50));
  console.log(`BlockRightsNFT: ${nftContract.address}`);
  console.log(`BlockRightsMarketplace: ${marketplaceContract.address}`);
  console.log(`BlockRightsVerification: ${verificationContract.address}`);
  console.log("=" .repeat(50));

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      BlockRightsNFT: {
        address: nftContract.address,
        transactionHash: nftContract.deployTransaction.hash,
      },
      BlockRightsMarketplace: {
        address: marketplaceContract.address,
        transactionHash: marketplaceContract.deployTransaction.hash,
      },
      BlockRightsVerification: {
        address: verificationContract.address,
        transactionHash: verificationContract.deployTransaction.hash,
      },
    },
  };

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "deployments");
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Verification instructions
  console.log("\n🔍 Verification Instructions:");
  console.log("=" .repeat(50));
  console.log("Untuk verify contracts di BSCScan, jalankan:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${nftContract.address}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${marketplaceContract.address} "${nftContract.address}"`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${verificationContract.address}`);
  console.log("=" .repeat(50));

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
