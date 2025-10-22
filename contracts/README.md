# BlockRights Smart Contracts

Smart contracts untuk platform NFT marketplace BlockRights yang memungkinkan seniman untuk mengunggah, memverifikasi, dan menjual karya seni digital mereka dengan perlindungan hak cipta berbasis blockchain.

## 📁 Struktur Smart Contracts

```
contracts/
├── BlockRightsNFT.sol           # Contract NFT utama dengan ERC-721 standard
├── BlockRightsMarketplace.sol   # Contract marketplace untuk jual beli NFT
├── BlockRightsVerification.sol   # Contract verifikasi hash dan kepemilikan
├── scripts/
│   └── deploy.js               # Script deployment contracts
├── test/
│   └── BlockRights.test.js     # Unit tests untuk contracts
├── hardhat.config.js           # Konfigurasi Hardhat
├── package.json               # Dependencies dan scripts
└── .env.example              # Template environment variables
```

## 🚀 Fitur Smart Contracts

### BlockRightsNFT.sol
- **ERC-721 Standard**: Implementasi NFT standard dengan metadata
- **Minting**: Mint NFT baru untuk artwork dengan metadata lengkap
- **Verification**: Sistem verifikasi artwork oleh admin
- **Royalty System**: Sistem royalty untuk artist (maksimal 10%)
- **Ownership Tracking**: Tracking history kepemilikan NFT
- **Platform Fee**: Fee platform untuk transaksi (2.5%)

### BlockRightsMarketplace.sol
- **Listing System**: Sistem listing NFT untuk dijual
- **Buy/Sell**: Transaksi jual beli NFT dengan escrow
- **Price Management**: Update harga dan durasi listing
- **Fee Distribution**: Distribusi fee ke platform dan artist
- **Pagination**: Sistem pagination untuk listing aktif

### BlockRightsVerification.sol
- **Hash Verification**: Verifikasi SHA-256 hash file
- **Ownership Proof**: Bukti kepemilikan karya seni
- **Transfer Rights**: Transfer hak kepemilikan
- **Metadata Storage**: Penyimpanan metadata karya
- **Fee System**: Sistem fee untuk verifikasi

## 🛠️ Setup dan Installation

### Prasyarat
- Node.js 16+
- npm atau yarn
- Hardhat
- MetaMask atau wallet lainnya

### Installation

1. **Install Dependencies**
   ```bash
   cd contracts
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi Anda
   ```

3. **Compile Contracts**
   ```bash
   npm run compile
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🚀 Deployment

### Local Network
```bash
# Start local Hardhat node
npm run node

# Deploy ke local network (terminal baru)
npm run deploy:local
```

### Testnet (BSC Testnet)
```bash
npm run deploy:testnet
```

### Mainnet (BSC Mainnet)
```bash
npm run deploy:mainnet
```

## 📋 Environment Variables

```env
# Private key untuk deployment
PRIVATE_KEY=your_private_key_here

# RPC URLs
TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
MAINNET_RPC_URL=https://bsc-dataseed.binance.org/

# Chain IDs
TESTNET_CHAIN_ID=97
MAINNET_CHAIN_ID=56

# BSCScan API Key
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

## 🔧 Contract Functions

### BlockRightsNFT

#### Minting
```solidity
function mintArtwork(
    address to,
    ArtworkMetadata memory metadata,
    uint256 royalty
) public onlyOwner returns (uint256)
```

#### Verification
```solidity
function verifyArtwork(uint256 tokenId, bool verified) public onlyOwner
```

#### Marketplace Integration
```solidity
function listForSale(uint256 tokenId, uint256 price) public
function buyArtwork(uint256 tokenId) public payable
```

### BlockRightsMarketplace

#### Listing Management
```solidity
function createListing(
    uint256 tokenId,
    uint256 price,
    uint256 duration
) public

function updateListing(
    uint256 listingId,
    uint256 newPrice,
    uint256 newDuration
) public

function cancelListing(uint256 listingId) public
```

#### Buying
```solidity
function buyItem(uint256 listingId) public payable
```

### BlockRightsVerification

#### Verification
```solidity
function createVerification(
    string memory fileHash,
    string memory title,
    string memory description,
    string memory fileType,
    uint256 fileSize,
    string memory metadataURI
) public payable

function verifyRecord(uint256 verificationId, bool verified) public onlyOwner
```

#### Ownership
```solidity
function transferOwnership(string memory fileHash, address newOwner) public
```

## 🧪 Testing

```bash
# Run semua tests
npm test

# Run test dengan coverage
npx hardhat coverage

# Run test specific contract
npx hardhat test test/BlockRights.test.js
```

## 🔍 Verification

Setelah deployment, verify contracts di BSCScan:

```bash
# Verify NFT contract
npx hardhat verify --network testnet <NFT_CONTRACT_ADDRESS>

# Verify Marketplace contract
npx hardhat verify --network testnet <MARKETPLACE_CONTRACT_ADDRESS> <NFT_CONTRACT_ADDRESS>

# Verify Verification contract
npx hardhat verify --network testnet <VERIFICATION_CONTRACT_ADDRESS>
```

## 📊 Gas Optimization

Contracts sudah dioptimasi dengan:
- **OpenZeppelin**: Library yang sudah teroptimasi
- **ReentrancyGuard**: Perlindungan dari reentrancy attacks
- **Efficient Storage**: Penggunaan storage yang efisien
- **Batch Operations**: Operasi batch untuk efisiensi gas

## 🔒 Security Features

- **Access Control**: Hanya owner yang bisa melakukan operasi admin
- **Reentrancy Protection**: Perlindungan dari reentrancy attacks
- **Input Validation**: Validasi input untuk mencegah error
- **Safe Math**: Penggunaan SafeMath untuk operasi matematika
- **Ownership Verification**: Verifikasi ownership sebelum transfer

## 🌐 Network Support

- **BSC Mainnet**: Binance Smart Chain Mainnet
- **BSC Testnet**: Binance Smart Chain Testnet
- **Local Network**: Hardhat local network untuk development

## 📈 Monitoring

Setelah deployment, monitor contracts menggunakan:
- **BSCScan**: Untuk melihat transaksi dan events
- **Hardhat Console**: Untuk interaksi langsung dengan contracts
- **Event Logs**: Untuk tracking aktivitas platform

## 🤝 Integration dengan Frontend

Smart contracts terintegrasi dengan:
- **Web3.js**: Untuk interaksi dengan blockchain
- **MetaMask**: Untuk wallet connection
- **IPFS**: Untuk penyimpanan metadata off-chain

## 📞 Support

Untuk pertanyaan atau bantuan:
- **GitHub Issues**: Laporkan bug atau request fitur
- **Documentation**: Lihat dokumentasi lengkap di README.md
- **Community**: Bergabung dengan komunitas BlockRights

---

**BlockRights Smart Contracts** - Melindungi Kreativitas dengan Teknologi Blockchain 🎨✨
