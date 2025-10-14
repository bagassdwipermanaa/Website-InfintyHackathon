"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import ArtworkCard from "@/components/ArtworkCard";

interface Artwork {
  id: string;
  title: string;
  description: string;
  fileHash: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  status: "pending" | "verified" | "rejected";
  userId?: number;
  user_id?: number;
  certificateUrl?: string;
  nftTokenId?: string;
}

export default function Marketplace() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuthStatus } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchArtworks();
    // Force refresh auth status
    checkAuthStatus();
  }, []);

  // Debug log untuk cek auth state
  useEffect(() => {
    console.log('🔐 Market Auth State:', {
      user,
      isAuthenticated,
      userName: user?.name,
      localStorage: {
        hasToken: !!localStorage.getItem('token'),
        hasUser: !!localStorage.getItem('user'),
        userPreview: localStorage.getItem('user')?.substring(0, 50)
      }
    });
  }, [user, isAuthenticated]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artworks/public");
      
      if (response.ok) {
        const data = await response.json();
        const list = data.data?.artworks || data.artworks || [];
        
        // Normalisasi data
        const normalized = list.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          description: a.description,
          fileHash: a.file_hash || a.fileHash,
          fileType: a.file_type || a.fileType,
          fileSize: a.file_size || a.fileSize,
          createdAt: a.created_at || a.createdAt,
          status: (a.status as any) || "pending",
          userId: a.user_id || a.userId,
          user_id: a.user_id,
          certificateUrl: a.certificate_url || a.certificateUrl,
          nftTokenId: a.nft_token_id || a.nftTokenId,
        }));
        
        setArtworks(normalized);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg z-50 flex flex-col items-center py-6">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg">B</span>
          </div>
        </Link>

        {/* Navigation Icons */}
        <div className="flex flex-col space-y-6">
          <button className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center hover:bg-purple-200 transition-colors duration-300">
            <span className="text-2xl">🎨</span>
          </button>
          <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors duration-300">
            <span className="text-2xl">💎</span>
          </button>
          <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors duration-300">
            <span className="text-2xl">📊</span>
          </button>
        </div>

        {/* Add Button */}
        <div className="mt-auto">
          <button className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white text-xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to BlockRights!
              </h1>
              <p className="text-gray-600 mt-1">
                Explore exclusive NFT collections, search for unique tokens, and
                view detailed product pages. To purchase NFTs or access your
                dashboard, please Login or Create an account.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
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
                <button 
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items, collections or users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Memuat karya...
              </h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <ArtworkCard
                      artwork={artwork}
                      onUpdate={fetchArtworks}
                      currentUserId={user?.id ? parseInt(user.id) : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tidak ada karya ditemukan
                  </h3>
                  <p className="text-gray-600">
                    Coba sesuaikan kata kunci pencarian Anda
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
      <ChatBubble />
    </main>
  );
}

