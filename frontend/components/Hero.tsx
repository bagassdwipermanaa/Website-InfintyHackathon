"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Lindungi Karya Kreatif Anda dengan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Blockchain
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            BlockRights adalah platform revolusioner yang menggunakan teknologi
            blockchain untuk verifikasi hak cipta dan kepemilikan digital karya
            kreatif Anda. Buktikan kepemilikan dengan cara yang tidak dapat
            dipalsukan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => router.push("/register")}
              className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              Mulai Sekarang - Gratis
            </button>
            <button
              onClick={() => router.push("/verify")}
              className="btn-secondary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              Verifikasi Karya
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Karya Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Akurasi Verifikasi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Dukungan Blockchain</div>
            </div>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Sertifikat Digital
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bukti kepemilikan yang tidak dapat dipalsukan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
