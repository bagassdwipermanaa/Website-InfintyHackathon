"use client";

import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">BlockRights</span>
            </h1>
            <p className="text-xl md:text-3xl max-w-4xl mx-auto opacity-90 leading-relaxed">
              Platform revolusioner yang mengubah cara melindungi hak cipta digital dengan teknologi blockchain yang aman dan transparan
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                  Visi <span className="gradient-text">Kami</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  Menciptakan dunia di mana setiap karya kreatif terlindungi dengan teknologi blockchain yang transparan, aman, dan tidak dapat dipalsukan. Kami percaya bahwa setiap kreator berhak mendapatkan perlindungan yang adil untuk karya mereka.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                      Misi Kami
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      BlockRights hadir untuk memberikan solusi perlindungan hak cipta digital yang mudah diakses, terjangkau, dan dapat dipercaya oleh semua kalangan kreator.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Teknologi Mudah Digunakan</h4>
                        <p className="text-gray-600">Menyediakan teknologi blockchain yang mudah digunakan untuk semua kalangan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Keamanan & Privasi</h4>
                        <p className="text-gray-600">Memastikan keamanan dan privasi data pengguna dengan teknologi terdepan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Ekosistem Kreatif Adil</h4>
                        <p className="text-gray-600">Mendukung ekosistem kreatif yang adil dan berkelanjutan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Edukasi & Kesadaran</h4>
                        <p className="text-gray-600">Memberikan edukasi tentang pentingnya perlindungan hak cipta digital</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-hover group">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                      <svg
                        className="w-16 h-16 text-white"
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
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:gradient-text transition-all duration-300">
                      Teknologi Terdepan
                    </h4>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Menggunakan blockchain Ethereum untuk memastikan keamanan dan transparansi maksimal dalam setiap transaksi
                    </p>
                    <div className="flex justify-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                Nilai-Nilai <span className="gradient-text">Kami</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Prinsip-prinsip yang menjadi fondasi dalam setiap layanan yang kami berikan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <div className="card-hover group text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                  Transparansi
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Setiap proses verifikasi dilakukan secara transparan dan dapat diverifikasi oleh publik melalui blockchain
                </p>
              </div>

              <div className="card-hover group text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors duration-300">
                  Keamanan
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Prioritas utama kami adalah melindungi karya dan data pribadi pengguna dengan teknologi keamanan terbaik
                </p>
              </div>

              <div className="card-hover group text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-300">
                  Inovasi
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Terus berinovasi untuk memberikan solusi terbaik dalam perlindungan hak cipta digital
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-5"></div>
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                Tim <span className="gradient-text">Kami</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Dibalik BlockRights ada tim yang berdedikasi untuk melindungi karya kreatif Anda
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-lg font-semibold border border-blue-200">
                <svg
                  className="w-5 h-5 mr-3"
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <div className="card-hover group text-center">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-4xl font-bold">BDP</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Bagas Dwi Permana
                </h3>
                <p className="text-blue-600 font-semibold mb-4 text-lg">
                  Full-Stack Developer
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Spesialis pengembangan aplikasi web end-to-end dengan teknologi modern dan arsitektur yang skalabel
                </p>
              </div>

              <div className="card-hover group text-center">
                <div className="w-40 h-40 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-4xl font-bold">IF</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Ihsan Fauzi
                </h3>
                <p className="text-green-600 font-semibold mb-4 text-lg">
                  Frontend Developer (UI/UX)
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Berfokus pada UI/UX, membangun antarmuka frontend yang cepat, responsif, dan ramah pengguna
                </p>
              </div>

              <div className="card-hover group text-center">
                <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-4xl font-bold">SYT</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Sutan Yazid Trenggono Rahman
                </h3>
                <p className="text-purple-600 font-semibold mb-4 text-lg">
                  Full-Stack Developer
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Developer full-stack yang membangun layanan backend, antarmuka, dan integrasi sistem end-to-end
                </p>
              </div>

              <div className="card-hover group text-center">
                <div className="w-40 h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-4xl font-bold">RG</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  Raqiz Ghanni
                </h3>
                <p className="text-orange-600 font-semibold mb-4 text-lg">
                  UI/UX Designer
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Merancang pengalaman dan antarmuka yang intuitif, konsisten, serta estetis
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Pencapaian <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Kami</span>
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Angka-angka yang membuktikan kepercayaan masyarakat terhadap BlockRights
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  10,000+
                </div>
                <div className="text-xl opacity-90">Karya Terdaftar</div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  5,000+
                </div>
                <div className="text-xl opacity-90">Pengguna Aktif</div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-xl opacity-90">Akurasi Verifikasi</div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-xl opacity-90">Dukungan Blockchain</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
                Hubungi <span className="gradient-text">Kami</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-16 leading-relaxed">
                Ada pertanyaan atau saran? Tim kami siap membantu Anda
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="card-hover group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-white"
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Email
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">support@blockrights.com</p>
                  <p className="text-sm text-gray-500">Respon dalam 24 jam</p>
                </div>

                <div className="card-hover group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-white"
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Live Chat
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">Tersedia 24/7</p>
                  <p className="text-sm text-gray-500">Bantuan langsung</p>
                </div>

                <div className="card-hover group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-white"
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Kantor
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">Jakarta, Indonesia</p>
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
