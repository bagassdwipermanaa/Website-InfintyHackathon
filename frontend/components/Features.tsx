"use client";

import { useState, useEffect } from "react";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreFeatures = [
    {
      icon: "📁",
      title: "Upload & Hashing File",
      description:
        "Sistem generate hash unik untuk setiap karya yang diupload dengan algoritma SHA-256 yang aman.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "⛓️",
      title: "Smart Contract Recording",
      description:
        "Hash, wallet address, dan timestamp disimpan secara permanen di blockchain Ethereum.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📊",
      title: "Dashboard Kreator",
      description:
        "Kelola semua karya terdaftar, lihat status kepemilikan, dan riwayat transaksi.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📜",
      title: "Digital Certificate",
      description:
        "Sertifikat kepemilikan otomatis dalam format PDF dan NFT yang dapat diunduh.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "✅",
      title: "Verify Work",
      description:
        "Publik dapat verifikasi kepemilikan karya melalui hash atau QR code dengan mudah.",
      color: "from-indigo-500 to-purple-500"
    },
  ];

  const advancedFeatures = [
    {
      icon: "⏰",
      title: "Timestamp Otomatis",
      description:
        "Bukti immutable siapa yang upload duluan dan kapan karya tersebut dibuat.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "💧",
      title: "Watermark Digital",
      description:
        "Embed metadata dan fingerprint unik ke dalam file sebagai bukti tambahan.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "🆔",
      title: "KYC + Wallet Binding",
      description:
        "Sertifikat lebih sah karena terkait dengan identitas asli dan wallet address.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: "🏆",
      title: "Soulbound NFT",
      description:
        "Sertifikat NFT yang non-transferable, selamanya melekat di wallet kreator.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: "📱",
      title: "QR Code Proof",
      description:
        "Scan QR code langsung untuk cek bukti kepemilikan on-chain secara real-time.",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: "⚖️",
      title: "Legal Export",
      description:
        "Sertifikat PDF dengan tanda tangan digital untuk bukti hukum yang sah.",
      color: "from-amber-500 to-yellow-500"
    },
  ];

  const wowFeatures = [
    {
      icon: "🤖",
      title: "AI-Powered Copyright Scan",
      description:
        "AI mengecek karya mirip/persis sama dengan karya terdaftar untuk mencegah plagiarisme.",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: "📱",
      title: "Mobile App Integration",
      description:
        "Kreator dapat upload dan verifikasi langsung dari smartphone dengan mudah.",
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: "🌐",
      title: "Cross-Chain Support",
      description:
        "Deploy tidak hanya di Ethereum, tapi juga Polygon, Solana, dan blockchain lokal.",
      color: "from-green-600 to-teal-600"
    },
    {
      icon: "🏛️",
      title: "Government Partnership",
      description:
        "Integrasi dengan DJKI dan lembaga hukum untuk sertifikat dengan kekuatan legal lebih kuat.",
      color: "from-orange-600 to-red-600"
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Fitur Lengkap{" "}
            <span className="gradient-text">BlockRights</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Platform terlengkap untuk perlindungan hak cipta digital dengan teknologi blockchain terdepan
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🔹 Core Features
            </h3>
            <p className="text-lg text-gray-600">Fitur utama yang wajib ada</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className={`card-hover group transition-all duration-1000 delay-${300 + index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-20">
          <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🔹 Advanced Features
            </h3>
            <p className="text-lg text-gray-600">Fitur canggih yang meyakinkan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className={`card-hover group transition-all duration-1000 delay-${600 + index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wow Factor Features */}
        <div className={`bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              🔹 Extra "Wow Factor"
            </h3>
            <p className="text-lg text-gray-600">Fitur visioner yang membedakan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wowFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
