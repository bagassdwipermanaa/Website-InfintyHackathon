# BlockRights - Platform NFT Marketplace

BlockRights adalah platform marketplace NFT (Non-Fungible Token) yang memungkinkan seniman untuk mengunggah, memverifikasi, dan menjual karya seni digital mereka dengan perlindungan hak cipta berbasis blockchain.

## 🚀 Fitur Utama

### Untuk Seniman
- **Upload Karya Seni**: Unggah karya seni digital dengan metadata lengkap
- **Verifikasi Blockchain**: Sistem verifikasi hash untuk memastikan keaslian karya
- **Dashboard Pribadi**: Kelola koleksi dan penjualan karya
- **Profil Lengkap**: Lengkapi profil untuk meningkatkan kredibilitas

### Untuk Pembeli
- **Marketplace**: Jelajahi dan beli karya seni digital
- **Koleksi Pribadi**: Kelola koleksi NFT yang dibeli
- **Sistem Pembayaran**: Pembayaran aman dan terintegrasi
- **Verifikasi Karya**: Pastikan keaslian karya sebelum membeli

### Untuk Admin
- **Dashboard Admin**: Kelola seluruh platform
- **Manajemen Pengguna**: Kelola akun pengguna dan seniman
- **Moderasi Karya**: Review dan approve karya yang diunggah
- **Analitik**: Statistik platform dan transaksi

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React OAuth Google** - Autentikasi Google
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database relational
- **JWT** - JSON Web Token untuk autentikasi
- **Multer** - File upload handling
- **Crypto** - Hash generation untuk verifikasi

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **Docker Compose** - Multi-container orchestration

## 📁 Struktur Proyek

```
Website-InfinityHackathon/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App Router pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # User dashboard
│   │   ├── karya/           # Artwork pages
│   │   ├── market/          # Marketplace
│   │   └── ...              # Other pages
│   ├── components/          # Reusable React components
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── backend/                 # Express.js backend API
│   ├── config/              # Database configuration
│   ├── middleware/          # Express middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   └── scripts/             # Database scripts
├── scripts/                 # Setup and deployment scripts
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
└── nginx.conf              # Nginx configuration
```

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
- Node.js 18+ 
- MySQL 8.0+
- Docker & Docker Compose (opsional)

### Setup Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd Website-InfinityHackathon
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env dengan konfigurasi database Anda
   ```

3. **Setup Database**
   ```bash
   # Buat database MySQL
   mysql -u root -p
   CREATE DATABASE blockrights;
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp env.example .env.local
   # Edit .env.local dengan konfigurasi API
   ```

5. **Jalankan Aplikasi**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

6. **Akses Aplikasi**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Setup dengan Docker

1. **Setup Environment**
   ```bash
   # Copy dan edit environment files
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env.local
   ```

2. **Jalankan dengan Docker Compose**
   ```bash
   # Development
   docker-compose -f docker-compose.dev.yml up

   # Production
   docker-compose up -d
   ```

## 🔧 Konfigurasi

### Environment Variables

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blockrights
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📱 Fitur Aplikasi

### Halaman Utama
- Hero section dengan penjelasan platform
- Fitur-fitur utama
- Cara kerja platform
- Testimoni pengguna

### Autentikasi
- Registrasi dengan email/password
- Login dengan Google OAuth
- JWT token management
- Protected routes

### Dashboard Pengguna
- Profil pengguna
- Status kelengkapan profil
- Koleksi karya yang dibeli
- Riwayat transaksi

### Upload Karya
- Form upload dengan validasi
- Preview gambar
- Metadata karya seni
- Hash verification

### Marketplace
- Grid layout karya seni
- Filter dan pencarian
- Detail karya dengan informasi lengkap
- Sistem pembayaran

### Admin Panel
- Dashboard dengan statistik
- Manajemen pengguna
- Moderasi karya seni
- Pengaturan sistem

## 🔒 Keamanan

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: bcrypt untuk enkripsi password
- **File Validation**: Validasi tipe dan ukuran file
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Cross-origin resource sharing
- **Rate Limiting**: Pembatasan request per IP

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   ```

2. **Build Applications**
   ```bash
   # Backend
   cd backend
   npm install --production

   # Frontend
   cd frontend
   npm run build
   ```

3. **Docker Deployment**
   ```bash
   docker-compose up -d
   ```

### Hosting Recommendations
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: PlanetScale, AWS RDS, Google Cloud SQL

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- **Project Link**: [https://github.com/yourusername/Website-InfinityHackathon](https://github.com/yourusername/Website-InfinityHackathon)
- **Email**: your.email@example.com

## 🙏 Acknowledgments

- Tim Infinity Hackathon
- Komunitas developer Indonesia
- Semua kontributor yang telah membantu pengembangan platform ini

---

**BlockRights** - Melindungi Kreativitas dengan Teknologi Blockchain 🎨✨
