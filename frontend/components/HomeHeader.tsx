"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Navigation Container */}
          <div className="flex justify-center">
            <div
              className={`backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border transition-all duration-300 ${
                isScrolled
                  ? "bg-white/30 backdrop-blur-xl border-white/40 shadow-xl"
                  : "bg-white/20 backdrop-blur-lg border-white/30"
              }`}
            >
              <div className="flex items-center space-x-6">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300">
                    BlockRights
                  </span>
                </Link>
                {/* Navigation Links */}
                <nav className="flex items-center space-x-4">
                  <Link
                    href="/tentang"
                    className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium"
                  >
                    Tentang
                  </Link>
                  <Link
                    href="/fitur"
                    className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium"
                  >
                    Media
                  </Link>
                  <Link
                    href="/karya"
                    className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium"
                  >
                    Kontak
                  </Link>
                </nav>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-300"></div>

                {/* Mulai Sekarang Button */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push("/market")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Mulai Sekarang
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-700 hover:text-purple-600 transition duration-300 p-2 rounded-xl hover:bg-gray-50"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-6 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-6">
              <Link
                href="/tentang"
                className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                ℹ️ Tentang
              </Link>
              <Link
                href="/fitur"
                className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                📱 Media
              </Link>
              <Link
                href="/karya"
                className="text-gray-700 hover:text-purple-600 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 Kontak
              </Link>
              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      router.push("/market");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Mulai Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
