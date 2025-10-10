"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-blue-400 rotate-45 opacity-50 animate-bounce"></div>
        <div className="absolute top-60 left-32 w-3 h-3 bg-green-400 rounded-full opacity-70"></div>
        <div className="absolute top-80 left-16 w-5 h-5 bg-orange-400 rotate-12 opacity-60"></div>

        <div className="absolute top-32 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-52 right-32 w-6 h-6 bg-blue-400 rotate-45 opacity-50 animate-bounce"></div>
        <div className="absolute top-72 right-16 w-3 h-3 bg-green-400 rounded-full opacity-70"></div>
        <div className="absolute top-96 right-24 w-5 h-5 bg-orange-400 rotate-12 opacity-60"></div>

        {/* Large floating shapes */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Rumah untuk{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Karya Digital
              </span>{" "}
              Anda
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              Buat, kelola, dan buktikan kepemilikan karya kreatif Anda—semua
              dalam satu platform, dengan teknologi blockchain yang aman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <button
                onClick={() => router.push("/register")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
              >
                Mulai Sekarang - Gratis
              </button>
              <button
                onClick={() => router.push("/verify")}
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
              >
                Verifikasi Karya
              </button>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg">
                  Buktikan kepemilikan dengan teknologi blockchain
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                <span className="text-gray-700 text-lg">
                  Mulai tanpa perlu crypto atau wallet
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                {/* Digital room illustration */}
                <div className="relative w-full h-full">
                  {/* Room elements */}
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">💻</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-3xl">🎨</span>
                  </div>

                  {/* Floating digital elements */}
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
                    className="absolute bottom-16 left-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <span className="text-green-600 text-sm">✓</span>
                  </div>

                  {/* Blockchain network lines */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                  >
                    <path
                      d="M50 100 Q200 50 350 100"
                      stroke="url(#gradient1)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                    />
                    <path
                      d="M50 200 Q200 150 350 200"
                      stroke="url(#gradient2)"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient
                        id="gradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient
                        id="gradient2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Floating cards around the main illustration */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 animate-pulse">
                <span className="text-purple-600 text-2xl">📄</span>
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl shadow-xl flex items-center justify-center transform -rotate-12 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-blue-600 text-xl">🔐</span>
              </div>
              <div
                className="absolute top-1/2 -left-8 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center transform rotate-45 animate-pulse"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-green-600 text-lg">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
