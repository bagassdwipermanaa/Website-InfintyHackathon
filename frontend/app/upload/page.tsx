"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import UploadModal from "@/components/UploadModal";

export default function UploadPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Redirect jika belum login
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleUploadSuccess = (artwork: any) => {
    console.log("Upload berhasil:", artwork);
    setShowUploadModal(false);
    // Redirect ke dashboard atau halaman karya
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BlockRights</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/market" 
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <span className="text-lg">🎨</span>
                <span className="font-medium">Marketplace</span>
              </Link>
              <Link 
                href="/koleksi" 
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <span className="text-lg">💎</span>
                <span className="font-medium">Koleksi</span>
              </Link>
              <Link 
                href="/upload" 
                className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg font-medium"
              >
                <span className="text-lg">📤</span>
                <span className="font-medium">Upload Karya</span>
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold hidden sm:block">{user?.name}</span>
                </div>
              ) : (
                <button 
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📤 Upload Karya Digital
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bagikan karya digital Anda dan dapatkan perlindungan hak cipta yang terverifikasi
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📤</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mulai Upload Karya Anda
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload karya digital Anda untuk mendapatkan sertifikat keaslian dan perlindungan hak cipta. 
              Karya Anda akan diverifikasi sebelum dipublikasikan di marketplace.
            </p>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              📤 Upload Karya Sekarang
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keamanan Terjamin</h3>
              <p className="text-sm text-gray-600">
                File Anda di-hash dan disimpan dengan enkripsi tingkat tinggi
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verifikasi Otomatis</h3>
              <p className="text-sm text-gray-600">
                Sistem akan memverifikasi keaslian karya Anda secara otomatis
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📜</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sertifikat Digital</h3>
              <p className="text-sm text-gray-600">
                Dapatkan sertifikat keaslian yang dapat diverifikasi di blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📋 Panduan Upload Karya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Format File yang Didukung:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gambar: JPG, PNG, GIF, WebP</li>
                <li>• Video: MP4, MOV, AVI</li>
                <li>• Audio: MP3, WAV, FLAC</li>
                <li>• Dokumen: PDF, DOC, DOCX</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Persyaratan:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ukuran maksimal: 100MB</li>
                <li>• Judul karya wajib diisi</li>
                <li>• Deskripsi minimal 10 karakter</li>
                <li>• Pastikan Anda memiliki hak cipta</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <Footer />
      <ChatBubble />
    </main>
  );
}
