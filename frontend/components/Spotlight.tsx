"use client";

import { useState, useEffect } from "react";

export default function Spotlight() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const spotlightItems = [
    {
      id: 1,
      title: "NFT untuk Peningkatan Engagement Konferensi Besar",
      description:
        "Kolaborasi Mastercard dengan BlockRights untuk engagement event menggunakan NFT yang memberikan akses eksklusif dan bukti partisipasi yang tidak dapat dipalsukan.",
      image: "CONVERGE",
      imageBg: "from-orange-500 to-pink-500",
      category: "Event & Conference",
    },
    {
      id: 2,
      title: "Sertifikat Digital untuk Karya Seni",
      description:
        "Platform BlockRights membantu galeri seni digital untuk memberikan sertifikat kepemilikan yang sah secara hukum untuk setiap karya yang dijual.",
      image: "ART",
      imageBg: "from-blue-500 to-purple-500",
      category: "Art & Gallery",
    },
    {
      id: 3,
      title: "Proteksi Karya Musik Digital",
      description:
        "Musisi independen menggunakan BlockRights untuk melindungi karya musik mereka dari plagiarisme dan membuktikan kepemilikan asli.",
      image: "MUSIC",
      imageBg: "from-green-500 to-blue-500",
      category: "Music & Audio",
    },
    {
      id: 4,
      title: "Sertifikat Pendidikan Blockchain",
      description:
        "Universitas menggunakan BlockRights untuk memberikan sertifikat kelulusan yang tidak dapat dipalsukan dan dapat diverifikasi secara publik.",
      image: "EDU",
      imageBg: "from-purple-500 to-pink-500",
      category: "Education",
    },
    {
      id: 5,
      title: "Proteksi Konten Digital Brand",
      description:
        "Perusahaan menggunakan BlockRights untuk melindungi konten marketing dan aset digital mereka dari penggunaan tanpa izin.",
      image: "BRAND",
      imageBg: "from-red-500 to-orange-500",
      category: "Brand Protection",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlightItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + spotlightItems.length) % spotlightItems.length
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Spotlight
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kisah sukses dan implementasi nyata dari platform BlockRights
          </p>
        </div>

        {/* Spotlight Container */}
        <div
          className={`bg-white rounded-3xl p-8 lg:p-12 shadow-2xl transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Pagination Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {spotlightItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-purple-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Spotlight Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="relative">
              <div className="relative w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-xl">
                <div className="relative w-full h-full">
                  {/* Main image container */}
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r ${spotlightItems[currentSlide].imageBg} rounded-full flex items-center justify-center shadow-2xl`}
                  >
                    <span className="text-white text-2xl font-bold">
                      {spotlightItems[currentSlide].image}
                    </span>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-8 left-8 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
                    <span className="text-blue-600 text-sm">🔗</span>
                  </div>
                  <div
                    className="absolute top-16 right-8 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <span className="text-purple-600 text-sm">⚡</span>
                  </div>
                  <div
                    className="absolute bottom-16 left-8 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div
                    className="absolute bottom-8 right-4 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <span className="text-orange-600 text-xs">🎨</span>
                  </div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      <defs>
                        <pattern
                          id={`spotlight-pattern-${currentSlide}`}
                          x="0"
                          y="0"
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="2"
                            fill="currentColor"
                            className="text-purple-400"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#spotlight-pattern-${currentSlide})`}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-xl flex items-center justify-center transform rotate-12 animate-pulse">
                <span className="text-purple-600 text-xl">📄</span>
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center transform -rotate-12 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-blue-600 text-lg">🔐</span>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-6">
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                #{String(spotlightItems[currentSlide].id).padStart(3, "0")}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {spotlightItems[currentSlide].title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {spotlightItems[currentSlide].description}
              </p>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                  <span className="text-purple-700 font-semibold text-sm">
                    {spotlightItems[currentSlide].category}
                  </span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
