"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VerificationResult from "@/components/VerificationResult";

interface VerificationData {
  isValid: boolean;
  artwork?: {
    id: string;
    title: string;
    description: string;
    creator: {
      name: string;
      walletAddress?: string;
    };
    fileHash: string;
    createdAt: string;
    status: string;
    certificateUrl?: string;
    nftTokenId?: string;
  };
  error?: string;
}

export default function Verify() {
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [hashInput, setHashInput] = useState("");
  const searchParams = useSearchParams();

  const hashFromUrl = searchParams.get("hash");

  useEffect(() => {
    if (hashFromUrl) {
      setHashInput(hashFromUrl);
      verifyByHash(hashFromUrl);
    }
  }, [hashFromUrl]);

  const verifyByHash = async (hash: string) => {
    setIsLoading(true);
    setError("");
    setVerificationData(null);

    try {
      const response = await fetch(`/api/verify/hash/${hash}`);
      const data = await response.json();

      if (response.ok && data && (data.isValid || data.success)) {
        const normalized = data.artwork
          ? { isValid: true, artwork: data.artwork }
          : { isValid: true, artwork: data.data?.artwork };
        setVerificationData(normalized as any);
      } else {
        if (hash.length >= 10) {
          const dummyData: VerificationData = {
            isValid: false,
          };
          setVerificationData(dummyData);
        } else {
          setError(data.message || "Hash tidak ditemukan");
        }
      }
    } catch (error) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyByFile = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setVerificationData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/verify/file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationData(data);
      } else {
        setError(data.message || "File tidak ditemukan dalam database");
      }
    } catch (error) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleHashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashInput.trim()) {
      verifyByHash(hashInput.trim());
    }
  };

  // Saat datang dari tombol Verifikasi di kartu, ambil hash dari query (?hash=...)
  // Tombol Verifikasi pada kartu sebaiknya sudah mengirim query hash. Jika belum,
  // kita bisa tambahkan dukungan ID (?id=...) lalu fetch detail untuk mengambil hash.
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (!hashFromUrl && idFromUrl) {
      // Fetch detail simpel ke backend, lalu set hash
      (async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/artworks?id=${idFromUrl}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          const item = data.data?.artworks?.find((a: any) => String(a.id) === String(idFromUrl));
          const fileHash = item?.file_hash || item?.fileHash;
          if (fileHash) {
            setHashInput(fileHash);
            verifyByHash(fileHash);
          }
        } catch {}
      })();
    }
  }, [hashFromUrl, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="py-14 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                  {/* Background Elements */}
                  <div className="absolute inset-0 grid-pattern opacity-20"></div>
                  <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
                  <div className="absolute top-20 right-10 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
                  
                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                      Verifikasi Kepemilikan{" "}
                      <span className="gradient-text">Karya</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      Pastikan keaslian dan kepemilikan karya kreatif dengan teknologi blockchain. 
                      Verifikasi dapat dilakukan dengan mengupload file atau memasukkan hash.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                  {/* File Upload Verification */}
                  <div className="card-hover group">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        Verifikasi dengan File
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Upload file karya untuk memverifikasi kepemilikan dengan mudah
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="file-upload"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          📁 Pilih File Karya
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-cyan-50 file:text-blue-700 hover:file:from-blue-100 hover:file:to-cyan-100 transition-all duration-300"
                            accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx,.zip,.rar"
                          />
                        </div>
                      </div>

                      {file && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">
                              {file.type.startsWith("image/")
                                ? "🖼️"
                                : file.type.startsWith("audio/")
                                ? "🎵"
                                : file.type.startsWith("video/")
                                ? "🎬"
                                : "📁"}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-lg">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={verifyByFile}
                        disabled={!file || isLoading}
                        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memverifikasi...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            🔍 Verifikasi File
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Hash Verification */}
                  <div className="card-hover group">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                        Verifikasi dengan Hash
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Masukkan hash karya untuk memverifikasi kepemilikan secara langsung
                      </p>
                    </div>

                    <form onSubmit={handleHashSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="hash-input"
                          className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                          🔑 Hash Karya
                        </label>
                        <input
                          type="text"
                          id="hash-input"
                          value={hashInput}
                          onChange={(e) => setHashInput(e.target.value)}
                          className="input-field font-mono text-sm"
                          placeholder="Masukkan hash SHA-256..."
                          required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Format: 64 karakter hexadecimal (a-f, 0-9)
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={!hashInput.trim() || isLoading}
                        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memverifikasi...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            🔍 Verifikasi Hash
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="card bg-red-50 border-red-200 text-red-700 mb-8 animate-slide-up">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Verifikasi Gagal</h3>
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 mx-auto mb-6"></div>
                      <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Memverifikasi Karya...</h3>
                    <p className="text-gray-600">Mohon tunggu sebentar, kami sedang memproses verifikasi Anda</p>
                  </div>
                )}

                {/* Verification Result */}
                {verificationData && <VerificationResult data={verificationData} />}

                {/* How Verification Works */}
                <div className="mt-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-12 shadow-2xl">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Bagaimana Verifikasi Bekerja?
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Proses verifikasi yang aman dan transparan menggunakan teknologi blockchain
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-2xl">1</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        Upload atau Hash
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Upload file karya atau masukkan hash SHA-256 untuk memulai proses verifikasi yang aman
                      </p>
                    </div>

                    <div className="text-center group">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-2xl">2</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                        Cek Blockchain
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Sistem mengecek hash di blockchain Ethereum untuk memverifikasi kepemilikan secara real-time
                      </p>
                    </div>

                    <div className="text-center group">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-2xl">3</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                        Hasil Verifikasi
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Dapatkan informasi lengkap tentang kepemilikan, status, dan metadata karya
                      </p>
                    </div>
                  </div>

                  {/* Connection Lines */}
                  <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform -translate-y-1/2"></div>
                  <div className="hidden md:block absolute top-1/2 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-green-400 transform -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}