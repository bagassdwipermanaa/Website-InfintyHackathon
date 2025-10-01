"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
