"use client";

import { useState, useEffect } from "react";

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-blue-400 rotate-45 opacity-30 animate-bounce"></div>
        <div className="absolute top-60 left-32 w-3 h-3 bg-green-400 rounded-full opacity-50"></div>

        <div className="absolute top-32 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-52 right-32 w-6 h-6 bg-blue-400 rotate-45 opacity-30 animate-bounce"></div>
        <div className="absolute top-72 right-16 w-3 h-3 bg-green-400 rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div
          className={`bg-white rounded-3xl p-12 lg:p-16 shadow-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Tentang Kami
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Kami memiliki misi untuk mengubah kembali pengalaman perlindungan
            hak cipta digital dan menjadikannya bagian dari kehidupan
            sehari-hari.
          </p>

          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </section>
  );
}
