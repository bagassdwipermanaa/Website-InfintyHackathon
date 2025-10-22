# Cara Menggunakan Smart Contracts di Web BlockRights

## 🚀 Panduan Lengkap Integrasi Blockchain

Smart contracts BlockRights sudah terintegrasi dengan frontend web. Berikut cara menggunakannya:

## 📋 Prasyarat

### 1. **Install MetaMask**
- Download dan install MetaMask di browser Anda
- Buat wallet baru atau import wallet yang sudah ada
- Pastikan wallet memiliki BNB untuk gas fee

### 2. **Setup Environment**
```bash
# Copy file environment
cp frontend/env.example frontend/.env.local

# Edit file .env.local dengan contract addresses setelah deployment
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VERIFICATION_CONTRACT_ADDRESS=0x...
```

## 🔗 Cara Menghubungkan Wallet

### 1. **Di Halaman Marketplace**
- Buka halaman `/market`
- Klik tombol "Connect Wallet" di pojok kanan atas
- Pilih MetaMask di popup yang muncul
- Approve koneksi wallet

### 2. **Status Koneksi**
- ✅ **Hijau**: Wallet terhubung ke BSC Mainnet
- 🟡 **Kuning**: Wallet terhubung ke BSC Testnet  
- ❌ **Merah**: Wallet tidak terhubung atau network salah

## 🎨 Cara Mint NFT (Membuat NFT)

### 1. **Upload Karya**
- Login ke akun BlockRights
- Pergi ke halaman upload karya
- Upload file karya seni Anda
- Isi metadata (judul, deskripsi, dll)

### 2. **Mint NFT**
- Setelah upload berhasil, klik tombol "Mint NFT"
- Konfirmasi transaksi di MetaMask
- Tunggu konfirmasi blockchain
- NFT akan muncul di koleksi Anda

### 3. **Fitur NFT**
- **Royalty**: 5% untuk setiap penjualan ulang
- **Metadata**: Tersimpan di blockchain
- **Ownership**: Dapat diverifikasi publik
- **Transfer**: Dapat dijual atau diberikan

## 🛒 Cara Membeli NFT

### 1. **Browse Marketplace**
- Buka halaman `/market`
- Filter karya berdasarkan kategori
- Cari karya yang ingin dibeli

### 2. **Proses Pembelian**
- Klik tombol "Buy Now" pada NFT
- Konfirmasi pembelian di popup
- Approve transaksi di MetaMask
- Tunggu konfirmasi blockchain

### 3. **Setelah Pembelian**
- NFT akan muncul di koleksi Anda
- Ownership berubah di blockchain
- Seller menerima pembayaran
- Platform mendapat fee 2.5%

## 🔍 Cara Verifikasi Karya

### 1. **Upload untuk Verifikasi**
- Pergi ke halaman `/verify`
- Upload file yang ingin diverifikasi
- Sistem akan generate hash SHA-256

### 2. **Cek di Blockchain**
- Hash akan dicek ke smart contract
- Jika terdaftar, akan muncul informasi:
  - Pemilik asli
  - Tanggal registrasi
  - Status verifikasi
  - Metadata lengkap

### 3. **Hasil Verifikasi**
- ✅ **Verified**: Karya terdaftar dan diverifikasi
- ❌ **Not Found**: Karya belum terdaftar
- ⚠️ **Disputed**: Ada sengketa kepemilikan

## 💰 Sistem Pembayaran

### 1. **Cryptocurrency**
- **BNB**: Untuk gas fee dan pembayaran
- **ETH**: Dikonversi ke BNB (jika perlu)
- **Gas Fee**: Dibutuhkan untuk setiap transaksi

### 2. **Fee Structure**
- **Platform Fee**: 2.5% dari setiap transaksi
- **Artist Royalty**: 5% untuk penjualan ulang
- **Gas Fee**: Bervariasi sesuai network

### 3. **Estimasi Biaya**
- **Mint NFT**: ~0.01 BNB gas fee
- **Buy NFT**: Harga NFT + ~0.005 BNB gas fee
- **Transfer**: ~0.003 BNB gas fee

## 🔧 Troubleshooting

### 1. **Wallet Tidak Terhubung**
```
Error: "Silakan hubungkan wallet terlebih dahulu"
Solusi: Klik "Connect Wallet" dan approve di MetaMask
```

### 2. **Network Salah**
```
Error: "Wrong Network"
Solusi: Switch ke BSC Mainnet di MetaMask
```

### 3. **Saldo Tidak Cukup**
```
Error: "Insufficient funds"
Solusi: Top up BNB di wallet untuk gas fee
```

### 4. **Transaksi Gagal**
```
Error: "Transaction failed"
Solusi: 
- Cek saldo BNB
- Tingkatkan gas limit
- Coba lagi setelah beberapa saat
```

## 📱 Fitur Mobile

### 1. **MetaMask Mobile**
- Install MetaMask di smartphone
- Scan QR code untuk koneksi
- Gunakan fitur yang sama seperti desktop

### 2. **WalletConnect**
- Support untuk wallet lain selain MetaMask
- Koneksi melalui QR code
- Multi-wallet support

## 🛡️ Keamanan

### 1. **Best Practices**
- Jangan share private key
- Gunakan hardware wallet untuk jumlah besar
- Verifikasi contract address sebelum transaksi
- Cek network yang benar

### 2. **Smart Contract Security**
- Contracts sudah di-audit
- Menggunakan OpenZeppelin library
- Reentrancy protection
- Access control yang ketat

## 📊 Monitoring Transaksi

### 1. **BSCScan**
- Cek status transaksi di BSCScan
- Lihat detail gas fee
- Track ownership history

### 2. **MetaMask Activity**
- Lihat history transaksi di MetaMask
- Monitor balance BNB
- Set up notifications

## 🎯 Tips Penggunaan

### 1. **Untuk Artist**
- Mint NFT setelah karya diverifikasi
- Set harga yang wajar
- Promosikan karya di sosial media
- Manfaatkan royalty system

### 2. **Untuk Collector**
- Research artist sebelum membeli
- Cek verifikasi karya
- Monitor harga pasar
- Diversifikasi koleksi

### 3. **Untuk Developer**
- Gunakan testnet untuk testing
- Monitor gas prices
- Implement error handling
- Test semua fitur sebelum production

## 📞 Support

Jika mengalami masalah:
1. **Cek FAQ** di dokumentasi
2. **Community Discord** untuk bantuan
3. **GitHub Issues** untuk bug report
4. **Email Support** untuk masalah teknis

---

**BlockRights Web3 Integration** - Nikmati pengalaman blockchain yang seamless! 🚀✨
