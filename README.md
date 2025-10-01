# BlockRights - Digital Copyright Verifier

Platform blockchain revolusioner untuk verifikasi hak cipta dan kepemilikan digital karya kreatif menggunakan teknologi blockchain Ethereum.

## 🚀 Fitur Utama

### Core Features (Wajib)
- **Upload & Hashing File** → Sistem generate hash unik karya dengan SHA-256
- **Smart Contract Recording** → Hash + wallet address + timestamp disimpan on-chain
- **Dashboard Kreator** → User bisa lihat daftar karya yang sudah terdaftar
- **Digital Certificate** → Sertifikat kepemilikan otomatis (PDF/NFT)
- **Verify Work** → Publik bisa verifikasi karya via hash/QR

### Fitur "Wah" (Meyakinkan + Sexy buat Juri)
- **Timestamp Otomatis** → Bukti immutable siapa upload duluan & kapan
- **Watermark / Fingerprint Digital** → Embed metadata ke file untuk bukti tambahan
- **KYC + Wallet Binding** → Sertifikat makin sah karena terkait identitas asli
- **Soulbound NFT Certificate** → Sertifikat NFT yang non-transferable
- **QR Code Public Proof** → Scan QR langsung cek bukti kepemilikan on-chain
- **Legal Export** → Sertifikat PDF dengan tanda tangan digital

### Fitur Advanced (Kalau Mau Ambil Poin Plus)
- **Dispute System** → Kalau ada klaim ganda, sistem tandai "In Dispute"
- **Multi-Format Support** → Gambar, audio, video, kode program, desain 3D, dokumen
- **Collaborative Ownership** → Kepemilikan bersama dengan split ownership
- **License Management** → Jual lisensi pakai smart contract
- **Integration with Marketplace** → Connect ke NFT marketplace atau DeFi platform
- **Royalty Automation** → Otomatis bagi hasil tiap kali karya dipakai/dibeli
- **Offline Verification Mode** → Sertifikat bisa diverifikasi tanpa login
- **Audit Log On-Chain** → Semua aktivitas tercatat transparan

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management dan lifecycle

### Backend
- **Express.js** - Web framework untuk Node.js
- **Sequelize** - ORM untuk database operations
- **MySQL** - Relational database
- **JWT** - Authentication dan authorization
- **Multer** - File upload handling
- **Sharp** - Image processing
- **QRCode** - QR code generation
- **jsPDF** - PDF certificate generation

### Blockchain
- **Ethereum** - Smart contract platform
- **Web3.js** - Ethereum JavaScript API
- **MetaMask** - Wallet integration

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git

### Setup Development

1. **Clone repository**
```bash
git clone https://github.com/your-username/blockrights.git
cd blockrights
```

2. **Run setup script**
```bash
# Windows
npm run setup

# Unix/Linux/macOS
npm run setup:unix
```

3. **Start development servers**
```bash
# Windows
npm run dev

# Unix/Linux/macOS
npm run dev:unix
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Setup (Alternative)

1. **Install dependencies**
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

2. **Setup environment variables**
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

3. **Setup database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE blockrights_db;
```

4. **Initialize database**
```bash
npm run db:init
```

5. **Start development servers**
```bash
npm run dev
```

## 🔧 Konfigurasi

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blockrights_db

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Blockchain Configuration
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_private_key_for_gasless_transactions
CONTRACT_ADDRESS=your_smart_contract_address

# File Upload Configuration
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads

# API Configuration
API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏗️ Struktur Project

```
blockrights/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── dashboard/         # User dashboard
│   └── verify/            # Verification page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── Features.tsx       # Features section
│   ├── UploadModal.tsx    # File upload modal
│   ├── ArtworkCard.tsx    # Artwork display card
│   └── VerificationResult.tsx # Verification results
├── server/                # Express.js backend
│   ├── config/            # Configuration files
│   │   └── database.js    # Database configuration
│   ├── models/            # Sequelize models
│   │   ├── User.js        # User model
│   │   ├── Artwork.js     # Artwork model
│   │   ├── Certificate.js # Certificate model
│   │   ├── Verification.js # Verification model
│   │   └── Dispute.js     # Dispute model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── artworks.js    # Artwork management
│   │   ├── verification.js # Verification system
│   │   ├── certificates.js # Certificate generation
│   │   ├── users.js       # User management
│   │   └── disputes.js    # Dispute resolution
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # Authentication middleware
│   │   └── upload.js       # File upload middleware
│   └── server.js          # Main server file
├── uploads/               # File upload directory
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/wallet-login` - Wallet-based login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Artworks
- `POST /api/artworks/upload` - Upload artwork
- `GET /api/artworks` - Get user's artworks
- `GET /api/artworks/:id` - Get artwork details
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `GET /api/artworks/search/public` - Search public artworks

### Verification
- `GET /api/verify/hash/:hash` - Verify by hash
- `POST /api/verify/file` - Verify by file upload
- `POST /api/verify/qr` - Verify by QR code
- `GET /api/verify/stats` - Verification statistics

### Certificates
- `GET /api/certificates/:id/download` - Download certificate
- `GET /api/certificates/:id/qr` - Generate QR code
- `POST /api/certificates/:id/nft` - Create NFT certificate

### Disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes` - Get disputes (admin)
- `GET /api/disputes/my-disputes` - Get user's disputes
- `PUT /api/disputes/:id/status` - Update dispute status

## 🎯 Workflow Utama

1. **User Daftar & Login**
   - Daftar akun (email/SSO/Web3 wallet)
   - Login untuk akses fitur

2. **Upload Karya**
   - User upload karya (gambar, musik, video, dokumen, dll)
   - Sistem auto-scan metadata (EXIF, hash file, ukuran, format)

3. **Generate Hash & Proof**
   - Sistem bikin hash unik (SHA-256/keccak)
   - Hash + metadata + identitas kreator disimpan ke blockchain

4. **NFT/Certificate Creation**
   - Sistem bikin NFT/sertifikat digital sebagai bukti kepemilikan
   - User bisa download sertifikat ownership (PDF/JSON dengan QR)

5. **Verification System**
   - Orang lain bisa verifikasi kepemilikan dengan cara:
     - Upload file → hash dicek ke blockchain
     - Scan QR code sertifikat

6. **Transfer/Sell Rights**
   - Kreator bisa transfer/sell ownership via smart contract
   - Royalti otomatis kalau ada transaksi

7. **Dispute Resolution**
   - Kalau ada yang klaim dobel, sistem kasih mekanisme dispute
   - Banding → submit bukti awal (sketsa, draft, timestamp, dll)
   - Verifikasi dilakukan pakai hash history

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t blockrights .

# Run container
docker run -p 3000:3000 -p 5000:5000 blockrights
```

### Environment Setup
- Setup production database
- Configure environment variables
- Setup SSL certificates
- Configure reverse proxy (Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **Email**: contact@blockrights.com
- **Website**: https://blockrights.com
- **Twitter**: @BlockRightsApp

## 🙏 Acknowledgments

- Ethereum Foundation
- OpenZeppelin for smart contract libraries
- Next.js team for the amazing framework
- Express.js community

---

**BlockRights** - Melindungi karya kreatif dengan teknologi blockchain yang tidak dapat dipalsukan.
