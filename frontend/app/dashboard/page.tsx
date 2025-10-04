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
        setArtworks(data.artworks);
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Selamat datang, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola dan lindungi karya kreatif Anda dengan teknologi
                blockchain
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary"
              >
                Upload Karya Baru
              </button>
              <button onClick={handleLogout} className="btn-secondary">
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                <p className="text-sm font-medium text-gray-600">Total Karya</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
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
                <p className="text-sm font-medium text-gray-600">
                  Terverifikasi
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter((a) => a.status === "verified").length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dispute</p>
                <p className="text-2xl font-bold text-gray-900">
                  {artworks.filter((a) => a.status === "disputed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Karya Saya</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Semua
              </button>
              <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg">
                Terverifikasi
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Menunggu
              </button>
            </div>
          </div>

          {artworks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada karya
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai upload karya pertama Anda untuk melindunginya dengan
                blockchain
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary"
              >
                Upload Karya Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onUpdate={fetchArtworks}
                />
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
