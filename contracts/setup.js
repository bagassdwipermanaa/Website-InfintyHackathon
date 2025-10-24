const { ethers } = require("hardhat");
const fs = require("fs");

async function setup() {
  console.log("🔧 Setting up BlockRights Smart Contracts...");
  
  // Generate a new wallet for testing
  const wallet = ethers.Wallet.createRandom();
  
  console.log("📝 Generated new wallet for testing:");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  
  // Create .env file
  const envContent = `# Private key untuk deployment (JANGAN SHARE!)
PRIVATE_KEY=${wallet.privateKey}

# BSC Testnet Configuration
TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
TESTNET_CHAIN_ID=97

# BSC Mainnet Configuration  
MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
MAINNET_CHAIN_ID=56

# BSCScan API Key untuk verifikasi contract
BSCSCAN_API_KEY=your_bscscan_api_key_here
`;

  fs.writeFileSync('.env', envContent);
  console.log("✅ Created .env file with generated private key");
  
  // Get test BNB
  console.log("\n💰 To get test BNB:");
  console.log("1. Go to: https://testnet.bnbchain.org/faucet-smart");
  console.log("2. Enter address:", wallet.address);
  console.log("3. Request test BNB");
  
  console.log("\n🚀 Ready to deploy! Run:");
  console.log("npx hardhat run scripts/deploy.js --network bscTestnet");
}

setup().catch(console.error);
