"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang BlockRights
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Platform revolusioner yang mengubah cara melindungi hak cipta
              digital dengan teknologi blockchain
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Visi Kami
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Menciptakan dunia di mana setiap karya kreatif terlindungi
                  dengan teknologi blockchain yang transparan, aman, dan tidak
                  dapat dipalsukan. Kami percaya bahwa setiap kreator berhak
                  mendapatkan perlindungan yang adil untuk karya mereka.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Misi Kami
                  </h3>
                  <p className="text-gray-600 mb-6">
                    BlockRights hadir untuk memberikan solusi perlindungan hak
                    cipta digital yang mudah diakses, terjangkau, dan dapat
                    dipercaya oleh semua kalangan kreator.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">✓</span>
                      <span>
                        Menyediakan teknologi blockchain yang mudah digunakan
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">✓</span>
                      <span>Memastikan keamanan dan privasi data pengguna</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">✓</span>
                      <span>Mendukung ekosistem kreatif yang adil</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">✓</span>
                      <span>
                        Memberikan edukasi tentang pentingnya perlindungan hak
                        cipta
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-white"
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
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Teknologi Terdepan
                    </h4>
                    <p className="text-gray-600">
                      Menggunakan blockchain Ethereum untuk memastikan keamanan
                      dan transparansi maksimal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nilai-Nilai Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Prinsip-prinsip yang menjadi fondasi dalam setiap layanan yang
                kami berikan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-blue-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Transparansi
                </h3>
                <p className="text-gray-600">
                  Setiap proses verifikasi dilakukan secara transparan dan dapat
                  diverifikasi oleh publik melalui blockchain
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-purple-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Keamanan
                </h3>
                <p className="text-gray-600">
                  Prioritas utama kami adalah melindungi karya dan data pribadi
                  pengguna dengan teknologi keamanan terbaik
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Inovasi
                </h3>
                <p className="text-gray-600">
                  Terus berinovasi untuk memberikan solusi terbaik dalam
                  perlindungan hak cipta digital
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tim Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                Dibalik BlockRights ada tim yang berdedikasi untuk melindungi
                karya kreatif Anda
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Tim dari SMK Telkom Jakarta
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">BDP</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bagas Dwi Permana
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  Web Developer / FullStack
                </p>
                <p className="text-gray-600 text-sm">
                  Spesialis pengembangan web full-stack dengan keahlian dalam
                  teknologi modern dan arsitektur aplikasi
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">IF</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ihsan Fauzi
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  UI/UX / Frontend Dev
                </p>
                <p className="text-gray-600 text-sm">
                  Ahli desain UI/UX dan pengembangan frontend dengan fokus pada
                  pengalaman pengguna yang optimal
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">SYT</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sutan Yazid Trenggono Rahman
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  Full Stack Developer
                </p>
                <p className="text-gray-600 text-sm">
                  Developer full-stack dengan keahlian dalam pengembangan
                  aplikasi end-to-end dan integrasi sistem
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">RG</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Raqiz Ghanni
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  UI/UX Designer
                </p>
                <p className="text-gray-600 text-sm">
                  Desainer UI/UX kreatif dengan kemampuan dalam menciptakan
                  antarmuka yang menarik dan fungsional
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pencapaian Kami
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Angka-angka yang membuktikan kepercayaan masyarakat terhadap
                BlockRights
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  10,000+
                </div>
                <div className="text-lg opacity-90">Karya Terdaftar</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  5,000+
                </div>
                <div className="text-lg opacity-90">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-lg opacity-90">Akurasi Verifikasi</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-lg opacity-90">Dukungan Blockchain</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hubungi Kami
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Ada pertanyaan atau saran? Tim kami siap membantu Anda
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Email
                  </h3>
                  <p className="text-gray-600 mb-4">support@blockrights.com</p>
                  <p className="text-sm text-gray-500">Respon dalam 24 jam</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-4">Tersedia 24/7</p>
                  <p className="text-sm text-gray-500">Bantuan langsung</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Kantor
                  </h3>
                  <p className="text-gray-600 mb-4">Jakarta, Indonesia</p>
                  <p className="text-sm text-gray-500">
                    Senin - Jumat, 9:00 - 17:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
