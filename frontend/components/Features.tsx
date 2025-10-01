"use client";

export default function Features() {
  const coreFeatures = [
    {
      icon: "📁",
      title: "Upload & Hashing File",
      description:
        "Sistem generate hash unik untuk setiap karya yang diupload dengan algoritma SHA-256 yang aman.",
    },
    {
      icon: "⛓️",
      title: "Smart Contract Recording",
      description:
        "Hash, wallet address, dan timestamp disimpan secara permanen di blockchain Ethereum.",
    },
    {
      icon: "📊",
      title: "Dashboard Kreator",
      description:
        "Kelola semua karya terdaftar, lihat status kepemilikan, dan riwayat transaksi.",
    },
    {
      icon: "📜",
      title: "Digital Certificate",
      description:
        "Sertifikat kepemilikan otomatis dalam format PDF dan NFT yang dapat diunduh.",
    },
    {
      icon: "✅",
      title: "Verify Work",
      description:
        "Publik dapat verifikasi kepemilikan karya melalui hash atau QR code dengan mudah.",
    },
  ];

  const advancedFeatures = [
    {
      icon: "⏰",
      title: "Timestamp Otomatis",
      description:
        "Bukti immutable siapa yang upload duluan dan kapan karya tersebut dibuat.",
    },
    {
      icon: "💧",
      title: "Watermark Digital",
      description:
        "Embed metadata dan fingerprint unik ke dalam file sebagai bukti tambahan.",
    },
    {
      icon: "🆔",
      title: "KYC + Wallet Binding",
      description:
        "Sertifikat lebih sah karena terkait dengan identitas asli dan wallet address.",
    },
    {
      icon: "🏆",
      title: "Soulbound NFT",
      description:
        "Sertifikat NFT yang non-transferable, selamanya melekat di wallet kreator.",
    },
    {
      icon: "📱",
      title: "QR Code Proof",
      description:
        "Scan QR code langsung untuk cek bukti kepemilikan on-chain secara real-time.",
    },
    {
      icon: "⚖️",
      title: "Legal Export",
      description:
        "Sertifikat PDF dengan tanda tangan digital untuk bukti hukum yang sah.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fitur Lengkap BlockRights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform terlengkap untuk perlindungan hak cipta digital dengan
            teknologi blockchain terdepan
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🔹 Core Features (Wajib)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🔹 Fitur "Wah" (Meyakinkan + Sexy buat Juri)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-xl transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Wow Factor */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🔹 Extra "Wow Factor" (Visioner)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🤖</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Copyright Scan
              </h4>
              <p className="text-gray-600">
                AI mengecek karya mirip/persis sama dengan karya terdaftar untuk
                mencegah plagiarisme.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📱</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Mobile App Integration
              </h4>
              <p className="text-gray-600">
                Kreator dapat upload dan verifikasi langsung dari smartphone
                dengan mudah.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🌐</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Cross-Chain Support
              </h4>
              <p className="text-gray-600">
                Deploy tidak hanya di Ethereum, tapi juga Polygon, Solana, dan
                blockchain lokal.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🏛️</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Government Partnership
              </h4>
              <p className="text-gray-600">
                Integrasi dengan DJKI dan lembaga hukum untuk sertifikat dengan
                kekuatan legal lebih kuat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
