"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout, canVerify, isLoading } = useAuth();
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

                {/* Auth Buttons */}
                <div className="flex items-center space-x-2">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  ) : isAuthenticated ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition duration-300 p-2 rounded-xl hover:bg-gray-50 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold">{user?.name}</span>
                        {!canVerify && (
                          <div
                            className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                            title="Profil belum lengkap"
                          ></div>
                        )}
                        <svg
                          className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 z-50">
                          <div className="py-2">
                            <Link
                              href="/dashboard"
                              className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => setShowUserMenu(false)}
                            >
                              📊 Dashboard
                            </Link>
                            <Link
                              href="/profil"
                              className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => setShowUserMenu(false)}
                            >
                              👤 Profil
                            </Link>
                            <div className="border-t border-gray-100 my-2"></div>
                            <button
                              onClick={() => {
                                logout();
                                setShowUserMenu(false);
                              }}
                              className="block w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              🚪 Keluar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push("/market")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Mulai Sekarang
                      </button>
                    </>
                  )}
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
                {isLoading ? (
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-gray-700 hover:text-purple-600 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/profil"
                      className="block text-gray-700 hover:text-purple-600 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Profil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 transition duration-300 font-medium px-4 py-2 rounded-xl hover:bg-red-50"
                    >
                      🚪 Keluar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => {
                        router.push("/register");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center text-purple-600 hover:text-purple-700 font-semibold px-6 py-3 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300"
                    >
                      Daftar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
