"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import ArtworkCard from "@/components/ArtworkCard";
import { Artwork } from "@/types/artwork";

export default function Koleksi() {
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
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArtworks();
    } else {
      setArtworks([]);
    }
  }, [isAuthenticated]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        setArtworks([]);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setArtworks([]);
        return;
      }

      const response = await fetch("/api/artworks/purchased", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const list = data.data?.artworks || data.artworks || [];
        
        const normalized = list.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          description: a.description,
          fileHash: a.file_hash || a.fileHash,
          fileType: a.file_type || a.fileType,
          fileSize: a.file_size || a.fileSize,
          createdAt: a.created_at || a.createdAt,
          status: (a.status as any) || "verified",
          userId: a.user_id || a.userId,
          user_id: a.user_id,
          certificateUrl: a.certificate_url || a.certificateUrl,
          nftTokenId: a.nft_token_id || a.nftTokenId,
          originalTitle: a.original_title,
          originalCreatorName: a.original_creator_name,
        }));
        
        setArtworks(normalized);
      }
    } catch (error) {
      console.error("Error fetching purchased artworks:", error);
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
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BlockRights</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/market" 
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <span className="text-lg">🎨</span>
                <span className="font-medium">Marketplace</span>
              </Link>
              <Link 
                href="/koleksi" 
                className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg font-medium"
              >
                <span className="text-lg">💎</span>
                <span className="font-medium">Koleksi</span>
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/upload" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
                >
                  <span className="text-lg">📤</span>
                  <span className="font-medium">Upload Karya</span>
                </Link>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition duration-300 p-2 rounded-xl hover:bg-gray-50 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold hidden sm:block">{user?.name}</span>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-purple-600 transition duration-300 p-2 rounded-xl hover:bg-gray-50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              💎 Koleksi Saya
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Koleksi karya digital yang telah Anda beli. Setiap karya memiliki sertifikat keaslian yang dapat diverifikasi.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari koleksi yang sudah dibeli..."
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
                Memuat koleksi Anda...
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
                  <div className="text-6xl mb-4">💎</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Belum ada koleksi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Anda belum membeli karya digital apapun. Mulai jelajahi marketplace untuk menemukan karya yang menarik!
                  </p>
                  <Link 
                    href="/market"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    🎨 Jelajahi Marketplace
                  </Link>
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
