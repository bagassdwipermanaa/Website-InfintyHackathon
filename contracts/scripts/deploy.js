const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Memulai deployment BlockRights Smart Contracts...");
  
  // Deploy BlockRightsNFT
  console.log("📝 Deploying BlockRightsNFT...");
  const BlockRightsNFT = await ethers.getContractFactory("BlockRightsNFT");
  const nftContract = await BlockRightsNFT.deploy();
  await nftContract.deployed();
  console.log("✅ BlockRightsNFT deployed to:", nftContract.address);
  
  // Deploy BlockRightsVerification
  console.log("🔍 Deploying BlockRightsVerification...");
  const BlockRightsVerification = await ethers.getContractFactory("BlockRightsVerification");
  const verificationContract = await BlockRightsVerification.deploy();
  await verificationContract.deployed();
  console.log("✅ BlockRightsVerification deployed to:", verificationContract.address);
  
  // Deploy BlockRightsMarketplace
  console.log("🏪 Deploying BlockRightsMarketplace...");
  const BlockRightsMarketplace = await ethers.getContractFactory("BlockRightsMarketplace");
  const marketplaceContract = await BlockRightsMarketplace.deploy();
  await marketplaceContract.deployed();
  console.log("✅ BlockRightsMarketplace deployed to:", marketplaceContract.address);
  
  // Simpan alamat contract ke file
  const fs = require('fs');
  const contractAddresses = {
    network: hre.network.name,
    nft: nftContract.address,
    verification: verificationContract.address,
    marketplace: marketplaceContract.address,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './deployed-addresses.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  
  console.log("\n🎉 Deployment berhasil!");
  console.log("📋 Contract Addresses:");
  console.log("NFT Contract:", nftContract.address);
  console.log("Verification Contract:", verificationContract.address);
  console.log("Marketplace Contract:", marketplaceContract.address);
  console.log("\n📄 Alamat tersimpan di: deployed-addresses.json");
  
  // Verifikasi contract jika di testnet/mainnet
  if (hre.network.name !== "hardhat") {
    console.log("\n⏳ Menunggu beberapa blok untuk verifikasi...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      console.log("🔍 Verifying contracts...");
      await hre.run("verify:verify", {
        address: nftContract.address,
        constructorArguments: [],
      });
      console.log("✅ BlockRightsNFT verified");
    } catch (error) {
      console.log("⚠️ Verifikasi NFT gagal:", error.message);
    }
    
    try {
      await hre.run("verify:verify", {
        address: verificationContract.address,
        constructorArguments: [],
      });
      console.log("✅ BlockRightsVerification verified");
    } catch (error) {
      console.log("⚠️ Verifikasi Verification gagal:", error.message);
    }
    
    try {
      await hre.run("verify:verify", {
        address: marketplaceContract.address,
        constructorArguments: [],
      });
      console.log("✅ BlockRightsMarketplace verified");
    } catch (error) {
      console.log("⚠️ Verifikasi Marketplace gagal:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment gagal:", error);
    process.exit(1);
  });
