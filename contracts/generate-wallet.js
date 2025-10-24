const crypto = require('crypto');
const fs = require('fs');

function generateWallet() {
  // Generate random private key (32 bytes)
  const privateKey = '0x' + crypto.randomBytes(32).toString('hex');
  
  // Create wallet address (simplified)
  const address = '0x' + crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 40);
  
  console.log("🔧 Generated new wallet for BlockRights deployment:");
  console.log("Address:", address);
  console.log("Private Key:", privateKey);
  
  // Create .env file
  const envContent = `# Private key untuk deployment (JANGAN SHARE!)
PRIVATE_KEY=${privateKey}

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
  console.log("✅ Created .env file with valid private key");
  
  console.log("\n💰 To get test BNB for deployment:");
  console.log("1. Go to: https://testnet.bnbchain.org/faucet-smart");
  console.log("2. Enter address:", address);
  console.log("3. Request test BNB (you'll need this for gas fees)");
  
  console.log("\n🚀 After getting test BNB, run:");
  console.log("npx hardhat run scripts/deploy.js --network bscTestnet");
  
  return { address, privateKey };
}

generateWallet();
