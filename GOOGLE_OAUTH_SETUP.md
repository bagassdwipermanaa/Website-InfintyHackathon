# Panduan Setup Google OAuth untuk BlockRights

Dokumen ini menjelaskan cara mengaktifkan fitur "Masuk dengan Google" di aplikasi BlockRights.

## 📋 Prasyarat

- Akun Google (untuk mengakses Google Cloud Console)
- Aplikasi BlockRights sudah terinstall dan berjalan

## 🚀 Langkah-langkah Setup

### 1. Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik dropdown project di atas, lalu klik **"New Project"**
3. Beri nama project (contoh: "BlockRights OAuth")
4. Klik **"Create"**

### 2. Enable Google+ API

1. Pilih project yang baru dibuat
2. Buka menu **"APIs & Services"** > **"Library"**
3. Cari **"Google+ API"** atau **"Google Identity"**
4. Klik **"Enable"**

### 3. Konfigurasi OAuth Consent Screen

1. Buka **"APIs & Services"** > **"OAuth consent screen"**
2. Pilih **"External"** sebagai User Type
3. Klik **"Create"**
4. Isi form:
   - **App name**: BlockRights
   - **User support email**: email Anda
   - **Developer contact information**: email Anda
5. Klik **"Save and Continue"**
6. Di halaman **Scopes**, klik **"Add or Remove Scopes"**
7. Pilih:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Klik **"Save and Continue"**
9. Di halaman **Test users**, tambahkan email untuk testing (opsional untuk development)
10. Klik **"Save and Continue"**

### 4. Buat OAuth 2.0 Client ID

1. Buka **"APIs & Services"** > **"Credentials"**
2. Klik **"+ Create Credentials"** > **"OAuth client ID"**
3. Pilih **"Web application"** sebagai Application type
4. Isi form:
   - **Name**: BlockRights Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (untuk development)
     - `https://yourdomain.com` (untuk production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (untuk development)
     - `https://yourdomain.com` (untuk production)
5. Klik **"Create"**
6. **PENTING**: Salin **Client ID** yang muncul (format: `xxxxx.apps.googleusercontent.com`)

### 5. Setup Environment Variables

#### Frontend (.env.local)

1. Buat file `.env.local` di folder `frontend/` (jika belum ada)
2. Tambahkan:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000/api

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com

# Blockchain Configuration (opsional)
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_smart_contract_address

# Development
NODE_ENV=development
```

3. Ganti `your_client_id_here.apps.googleusercontent.com` dengan **Client ID** yang Anda salin sebelumnya

#### Backend (.env)

Backend tidak memerlukan konfigurasi tambahan untuk Google OAuth karena validasi dilakukan di frontend.

### 6. Restart Aplikasi

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Test Login dengan Google

1. Buka `http://localhost:3000/login`
2. Klik tombol **"Sign in with Google"**
3. Pilih akun Google Anda
4. Berikan izin yang diminta
5. Anda akan diarahkan ke dashboard jika berhasil

## 🔒 Keamanan

### Untuk Production:

1. **Update Authorized Origins & Redirect URIs**:
   - Hapus URL localhost
   - Tambahkan domain production Anda

2. **Publish OAuth Consent Screen**:
   - Kembali ke OAuth consent screen
   - Klik **"Publish App"**
   - Submit untuk review jika diperlukan

3. **Environment Variables**:
   - Jangan commit file `.env.local` ke Git
   - Gunakan secret management di hosting (Vercel Secrets, Railway Variables, dll)

## ❓ Troubleshooting

### Error: "redirect_uri_mismatch"
- Pastikan URL di Authorized redirect URIs sama persis dengan URL aplikasi Anda
- Termasuk protocol (http/https) dan port

### Error: "Access blocked: This app's request is invalid"
- Pastikan OAuth consent screen sudah dikonfigurasi dengan benar
- Tambahkan scope yang diperlukan

### Google button tidak muncul
- Pastikan `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sudah diset dengan benar
- Restart development server setelah menambahkan env variable
- Check console browser untuk error

### Token tidak valid
- Pastikan Client ID sama dengan yang di Google Console
- Pastikan waktu sistem Anda sudah benar

## 📚 Referensi

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In for Websites](https://developers.google.com/identity/gsi/web/guides/overview)
- [React OAuth Google Library](https://www.npmjs.com/package/@react-oauth/google)

## 🆘 Bantuan

Jika mengalami masalah, silakan:
1. Check console browser (F12) untuk error messages
2. Check terminal backend untuk error logs
3. Verifikasi semua environment variables sudah benar
4. Pastikan Google Cloud project sudah aktif dan billing enabled (untuk production)

---

**Selamat! 🎉** Fitur "Masuk dengan Google" sudah aktif di aplikasi BlockRights Anda.

