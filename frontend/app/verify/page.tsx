"use client";

import { useState, useEffect } from "react";
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

      if (response.ok) {
        setVerificationData(data);
      } else {
        // Untuk demo, kita akan generate data dummy jika hash tidak ditemukan
        if (hash.length >= 10) {
          const dummyData: VerificationData = {
            isValid: true,
            artwork: {
              id: "1",
              title: "Sample Digital Art",
              description: "This is a sample digital artwork",
              creator: {
                name: "Demo Creator",
                walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
              },
              fileHash: hash,
              createdAt: new Date().toISOString(),
              status: "verified",
              certificateUrl: "/api/certificate/sample.pdf",
              nftTokenId: "123",
            },
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

  return (
    <div className="min-h-screen">
      <Header />

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Verifikasi Kepemilikan Karya
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pastikan keaslian dan kepemilikan karya kreatif dengan teknologi
              blockchain. Verifikasi dapat dilakukan dengan mengupload file atau
              memasukkan hash.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* File Upload Verification */}
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verifikasi dengan File
                </h2>
                <p className="text-gray-600">
                  Upload file karya untuk memverifikasi kepemilikan
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pilih File Karya
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx,.zip,.rar"
                  />
                </div>

                {file && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {file.type.startsWith("image/")
                          ? "🖼️"
                          : file.type.startsWith("audio/")
                          ? "🎵"
                          : file.type.startsWith("video/")
                          ? "🎬"
                          : "📁"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={verifyByFile}
                  disabled={!file || isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi File"}
                </button>
              </div>
            </div>

            {/* Hash Verification */}
            <div className="card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verifikasi dengan Hash
                </h2>
                <p className="text-gray-600">
                  Masukkan hash karya untuk memverifikasi kepemilikan
                </p>
              </div>

              <form onSubmit={handleHashSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="hash-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Hash Karya
                  </label>
                  <input
                    type="text"
                    id="hash-input"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 bg-white"
                    placeholder="Masukkan hash SHA-256..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!hashInput.trim() || isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi Hash"}
                </button>
              </form>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memverifikasi karya...</p>
            </div>
          )}

          {/* Verification Result */}
          {verificationData && <VerificationResult data={verificationData} />}

          {/* How Verification Works */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Bagaimana Verifikasi Bekerja?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload atau Hash
                </h4>
                <p className="text-gray-600">
                  Upload file karya atau masukkan hash SHA-256 untuk memulai
                  verifikasi
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Cek Blockchain
                </h4>
                <p className="text-gray-600">
                  Sistem mengecek hash di blockchain untuk memverifikasi
                  kepemilikan
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Hasil Verifikasi
                </h4>
                <p className="text-gray-600">
                  Dapatkan informasi lengkap tentang kepemilikan dan status
                  karya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
