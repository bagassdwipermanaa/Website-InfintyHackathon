# Setup Email untuk Fitur Lupa Password

## Cara Setup Email Gmail:

### 1. Buat App Password di Gmail
1. Buka Google Account Settings: https://myaccount.google.com/
2. Pilih "Security" → "2-Step Verification" (aktifkan dulu jika belum)
3. Scroll ke bawah, pilih "App passwords"
4. Pilih "Mail" dan "Other (Custom name)"
5. Masukkan nama: "BlockRights App"
6. Copy password yang dihasilkan (16 karakter)

### 2. Buat file .env di folder backend
Buat file `.env` di folder `backend/` dengan isi:

```
# Database Configuration
DB_HOST=pintu2.minecuta.com
DB_PORT=3306
DB_USER=hackaton
DB_PASSWORD=hackaton
DB_NAME=blockrights

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=bagasdwipermana10@gmail.com
EMAIL_PASS=your-16-character-app-password-here
```

### 3. Ganti EMAIL_PASS dengan App Password
Ganti `your-16-character-app-password-here` dengan App Password yang Anda dapatkan dari Gmail.

### 4. Restart Backend Server
Setelah setup .env, restart backend server:
```bash
cd backend
npm start
```

### 5. Test Fitur Lupa Password
1. Buka http://localhost:3000/login
2. Klik "Lupa password?"
3. Masukkan email: bagasdwipermana10@gmail.com
4. Cek inbox Gmail untuk email reset password

## Troubleshooting:
- Pastikan 2-Step Verification sudah aktif di Gmail
- Pastikan App Password sudah dibuat dengan benar
- Pastikan EMAIL_USER dan EMAIL_PASS sudah benar di .env
- Cek console backend untuk error message
