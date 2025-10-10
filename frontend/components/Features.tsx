"use client";

import { useState, useEffect } from "react";

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: "everyone",
      title: "Hak Cipta Disederhanakan",
      subtitle: "Untuk Semua Orang",
      description:
        "Buat, kelola, dan buktikan kepemilikan karya kreatif Anda—semua dalam satu platform, dengan teknologi blockchain yang aman.",
      features: [
        {
          icon: "🔗",
          text: "Buka pengalaman digital dan dunia nyata yang unik.",
        },
        {
          icon: "💳",
          text: "Mulai tanpa perlu crypto atau wallet.",
        },
      ],
      illustration: "left",
      bgColor: "from-blue-50 to-purple-50",
    },
    {
      id: "web3",
      title: "Ambil Kendali",
      subtitle: "Untuk Web3 Native",
      description:
        "Buat, kelola, dan buktikan kepemilikan karya kreatif Anda—semua dalam satu platform, dengan teknologi blockchain yang aman.",
      features: [
        {
          icon: "🔗",
          text: "Hubungkan beberapa wallet per akun.",
        },
        {
          icon: "📊",
          text: "Urutkan, beri tag, dan kelola karya digital.",
        },
      ],
      illustration: "right",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      id: "creators",
      title: "Luncurkan Koleksi Anda",
      subtitle: "Untuk Brand & Kreator",
      description:
        "Buat, kelola, dan buktikan kepemilikan karya kreatif Anda—semua dalam satu platform, dengan teknologi blockchain yang aman.",
      features: [
        {
          icon: "🏪",
          text: "Siapkan toko Anda dengan mudah.",
        },
        {
          icon: "✨",
          text: "Mint gratis dengan Gasless Minting.",
        },
      ],
      illustration: "left",
      bgColor: "from-green-50 to-blue-50",
    },
  ];

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`mb-32 ${feature.bgColor} rounded-3xl p-12 lg:p-16`}
          >
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                feature.illustration === "right" ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Content */}
              <div
                className={`${
                  feature.illustration === "right" ? "lg:col-start-2" : ""
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } transition-all duration-1000 delay-${index * 200}`}
              >
                <div className="text-sm font-semibold text-purple-600 mb-4 uppercase tracking-wide">
                  {feature.subtitle}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {feature.title}
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature list */}
                <div className="space-y-6">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm">{item.icon}</span>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div
                className={`${
                  feature.illustration === "right" ? "lg:col-start-1" : ""
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } transition-all duration-1000 delay-${index * 200 + 300}`}
              >
                <div className="relative">
                  {/* Main illustration container */}
                  <div className="relative w-full h-80 lg:h-96 bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="relative w-full h-full">
                      {/* Person illustration */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-3xl">
                            {feature.id === "everyone"
                              ? "🚀"
                              : feature.id === "web3"
                              ? "🧘"
                              : "💃"}
                          </span>
                        </div>
                      </div>

                      {/* Floating elements around person */}
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
                              id={`pattern-${feature.id}`}
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
                            fill={`url(#pattern-${feature.id})`}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
