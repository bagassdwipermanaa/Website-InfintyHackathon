"use client";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Daftar & Login",
      description:
        "Buat akun dengan email atau hubungkan wallet Web3 Anda untuk akses penuh ke platform.",
      icon: "👤",
      details: [
        "Daftar akun (email/SSO/Web3 wallet)",
        "Login untuk akses fitur lengkap",
      ],
    },
    {
      step: "2",
      title: "Upload Karya",
      description:
        "Upload karya kreatif Anda (gambar, musik, video, dokumen, kode program, dll).",
      icon: "📁",
      details: [
        "Upload file karya",
        "Sistem auto-scan metadata (EXIF, hash, ukuran, format)",
        "Generate hash unik SHA-256",
      ],
    },
    {
      step: "3",
      title: "Generate Hash & Proof",
      description:
        "Sistem membuat hash unik dan menyimpan bukti kepemilikan ke blockchain.",
      icon: "🔐",
      details: [
        "Generate hash SHA-256/keccak",
        "Hash + metadata + identitas disimpan ke blockchain",
        "Immutable record tercipta",
      ],
    },
    {
      step: "4",
      title: "NFT/Certificate Creation",
      description:
        "Sistem otomatis membuat NFT dan sertifikat digital sebagai bukti kepemilikan.",
      icon: "📜",
      details: [
        "Buat NFT/sertifikat digital",
        "Download sertifikat ownership (PDF/JSON)",
        "QR code untuk verifikasi",
      ],
    },
    {
      step: "5",
      title: "Verification System",
      description:
        "Publik dapat verifikasi kepemilikan dengan mudah melalui berbagai metode.",
      icon: "✅",
      details: [
        "Upload file → hash dicek ke blockchain",
        "Scan QR code sertifikat",
        "Verifikasi real-time",
      ],
    },
    {
      step: "6",
      title: "Transfer/Sell Rights",
      description:
        "Kreator dapat transfer atau menjual hak kepemilikan melalui smart contract.",
      icon: "💰",
      details: [
        "Transfer ownership via smart contract",
        "Royalti otomatis setiap transaksi",
        "Revenue sharing otomatis",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bagaimana BlockRights Bekerja?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Proses sederhana namun powerful untuk melindungi karya kreatif Anda
            dengan teknologi blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 z-0"></div>
              )}

              <div className="card hover:shadow-xl transition duration-300 relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <div className="text-3xl">{step.icon}</div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 mb-4">{step.description}</p>

                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Dispute Resolution */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dispute Resolution
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sistem penyelesaian sengketa yang adil dan transparan untuk
              mengatasi klaim kepemilikan ganda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Proses Banding
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Submit bukti awal (sketsa, draft, timestamp)</li>
                <li>• Upload dokumen pendukung</li>
                <li>• Sistem otomatis analisis bukti</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Verifikasi Bukti
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Verifikasi menggunakan hash history</li>
                <li>• Analisis metadata dan timestamp</li>
                <li>• Keputusan final berdasarkan bukti terkuat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
