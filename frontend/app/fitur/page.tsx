"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FiturPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fitur-Fitur Unggulan
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Temukan semua fitur canggih yang membuat BlockRights menjadi
              solusi terbaik untuk perlindungan hak cipta digital
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Verifikasi Blockchain
                </h3>
                <p className="text-gray-600 mb-4">
                  Setiap karya kreatif Anda akan diverifikasi menggunakan
                  teknologi blockchain yang tidak dapat dipalsukan, memberikan
                  bukti kepemilikan yang kuat dan permanen.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Hash unik untuk setiap karya</li>
                  <li>• Timestamp yang tidak dapat diubah</li>
                  <li>• Transparansi penuh</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Keamanan Tingkat Tinggi
                </h3>
                <p className="text-gray-600 mb-4">
                  Sistem keamanan berlapis dengan enkripsi end-to-end melindungi
                  karya Anda dari akses tidak sah dan pelanggaran hak cipta.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Enkripsi AES-256</li>
                  <li>• Autentikasi multi-faktor</li>
                  <li>• Backup otomatis</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sertifikat Digital
                </h3>
                <p className="text-gray-600 mb-4">
                  Dapatkan sertifikat digital resmi yang dapat digunakan sebagai
                  bukti hukum kepemilikan karya kreatif Anda.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Sertifikat PDF yang dapat diunduh</li>
                  <li>• QR Code untuk verifikasi cepat</li>
                  <li>• Validasi online real-time</li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Proses Cepat
                </h3>
                <p className="text-gray-600 mb-4">
                  Verifikasi karya Anda dalam hitungan menit dengan teknologi
                  blockchain yang cepat dan efisien.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Verifikasi dalam 5 menit</li>
                  <li>• Upload berbagai format file</li>
                  <li>• Notifikasi real-time</li>
                </ul>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pelaporan Pelanggaran
                </h3>
                <p className="text-gray-600 mb-4">
                  Sistem pelaporan terintegrasi untuk melaporkan pelanggaran hak
                  cipta dengan bukti blockchain yang kuat.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Formulir pelaporan mudah</li>
                  <li>• Bukti blockchain otomatis</li>
                  <li>• Follow-up sistem</li>
                </ul>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Dashboard Personal
                </h3>
                <p className="text-gray-600 mb-4">
                  Kelola semua karya kreatif Anda dalam satu dashboard yang
                  intuitif dan mudah digunakan.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Riwayat verifikasi lengkap</li>
                  <li>• Statistik kepemilikan</li>
                  <li>• Manajemen sertifikat</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Siap Melindungi Karya Kreatif Anda?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan kreator yang telah mempercayakan
              perlindungan karya mereka kepada BlockRights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Daftar Sekarang - Gratis
              </a>
              <a
                href="/verify"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Verifikasi Karya
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
