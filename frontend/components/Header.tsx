"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, canVerify } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                BlockRights
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              Beranda
            </Link>
            <Link
              href="/fitur"
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              Fitur
            </Link>
            <Link
              href="/verify"
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              Verifikasi
            </Link>
            <Link
              href="/tentang"
              className="text-gray-700 hover:text-blue-600 transition duration-200"
            >
              Tentang
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  {!canVerify && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Profil belum lengkap"></div>
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard?tab=profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profil
                        {!canVerify && (
                          <span className="ml-2 text-xs text-yellow-600">(Belum Lengkap)</span>
                        )}
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="btn-primary"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition duration-200"
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                Beranda
              </Link>
              <Link
                href="/fitur"
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                Fitur
              </Link>
              <Link
                href="/verify"
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                Verifikasi
              </Link>
              <Link
                href="/tentang"
                className="text-gray-700 hover:text-blue-600 transition duration-200"
              >
                Tentang
              </Link>
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user?.name}</span>
                      {!canVerify && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Profil belum lengkap"></div>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-gray-700 hover:text-blue-600 transition duration-200 mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=profile"
                      className="block text-gray-700 hover:text-blue-600 transition duration-200 mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                      {!canVerify && (
                        <span className="ml-2 text-xs text-yellow-600">(Belum Lengkap)</span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 transition duration-200"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/login")}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 transition duration-200 mb-2"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => router.push("/register")}
                      className="btn-primary w-full"
                    >
                      Daftar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
