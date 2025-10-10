"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import UploadModal from "@/components/UploadModal";
import ArtworkCard from "@/components/ArtworkCard";

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  fileHash: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  status: "pending" | "verified" | "disputed";
  certificateUrl?: string;
  nftTokenId?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "verified" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    fetchArtworks();
  }, [router]);

  const fetchArtworks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/artworks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = data.data?.artworks || data.artworks || [];
        // Normalisasi field agar cocok dengan ArtworkCard
        const normalized = list.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          description: a.description,
          fileHash: a.file_hash || a.fileHash,
          fileType: a.file_type || a.fileType,
          fileSize: a.file_size || a.fileSize,
          createdAt: a.created_at || a.createdAt,
          status: (a.status as any) || "pending",
        }));
        setArtworks(normalized);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleUploadSuccess = (newArtwork: Artwork) => {
    setArtworks((prev) => [newArtwork, ...prev]);
    setIsUploadModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Selamat datang,{" "}
                <span className="gradient-text">{user?.name}</span>!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Kelola dan lindungi karya kreatif Anda dengan teknologi blockchain yang aman dan terpercaya
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary text-lg px-8 py-4 group"
              >
                <span className="flex items-center">
                  📤 Upload Karya Baru
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button onClick={handleLogout} className="btn-outline text-lg px-8 py-4 group">
                <span className="flex items-center">
                  🚪 Keluar
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-hover group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Total Karya</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300">
                    {artworks.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">📁</div>
              </div>
            </div>
          </div>

          <div className="card-hover group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Terverifikasi</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300">
                    {artworks.filter((a) => a.status === "verified").length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">✅</div>
              </div>
            </div>
          </div>

          <div className="card-hover group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Menunggu</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300">
                    {artworks.filter((a) => a.status === "pending").length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">⏳</div>
              </div>
            </div>
          </div>

          <div className="card-hover group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">Dispute</p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300">
                    {artworks.filter((a) => a.status === "disputed").length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">⚠️</div>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Karya <span className="gradient-text">Saya</span>
              </h2>
              <p className="text-gray-600">Kelola dan pantau status karya kreatif Anda</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                  filter === "all"
                    ? "text-blue-700 bg-blue-50 border-blue-300 shadow-lg"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                📁 Semua ({artworks.length})
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                  filter === "verified"
                    ? "text-green-700 bg-green-50 border-green-300 shadow-lg"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                ✅ Terverifikasi ({artworks.filter((a) => a.status === "verified").length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-0.5 ${
                  filter === "pending"
                    ? "text-yellow-700 bg-yellow-50 border-yellow-300 shadow-lg"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                ⏳ Menunggu ({artworks.filter((a) => a.status === "pending").length})
              </button>
            </div>
          </div>

          {(artworks.filter((a) =>
            filter === "all" ? true : filter === "verified" ? a.status === "verified" : a.status === "pending"
          ).length === 0) ? (
            <div className="text-center py-20">
              <div className="card-hover max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-500"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Belum Ada Karya
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Mulai upload karya pertama Anda untuk melindunginya dengan teknologi blockchain yang aman
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn-primary text-lg px-8 py-4 group"
                >
                  <span className="flex items-center">
                    📤 Upload Karya Pertama
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks
                .filter((a) =>
                  filter === "all"
                    ? true
                    : filter === "verified"
                    ? a.status === "verified"
                    : a.status === "pending"
                )
                .map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArtworkCard
                    artwork={artwork}
                    onUpdate={fetchArtworks}
                    currentUserId={user?.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
