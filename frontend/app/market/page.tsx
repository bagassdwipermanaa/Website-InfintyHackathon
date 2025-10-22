"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import ArtworkCard from "@/components/ArtworkCard";
import { Artwork } from "@/types/artwork";

export default function Marketplace() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuthStatus } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [forceAuthCheck, setForceAuthCheck] = useState(0);
  const [localAuthState, setLocalAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
  }>({ isAuthenticated: false, user: null });

  useEffect(() => {
    setIsVisible(true);
    fetchArtworks();
    
    // Cek localStorage langsung untuk memastikan state ter-update
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      console.log('🔍 Found auth data in localStorage, forcing checkAuthStatus...');
      // Force refresh auth status dengan delay untuk memastikan state ter-update
      setTimeout(() => {
        checkAuthStatus();
      }, 100);
    } else {
      console.log('❌ No auth data found in localStorage');
    }
  }, []);

  // Update local auth state untuk stabilisasi
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setLocalAuthState({
          isAuthenticated: true,
          user: parsedUser
        });
        console.log('✅ Local auth state updated:', parsedUser.name);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [user, isAuthenticated]);

  // Debug log untuk cek auth state
  useEffect(() => {
    console.log('🔐 Market Auth State:', {
      user,
      isAuthenticated,
      userName: user?.name,
      userExists: !!user,
      localAuthState,
      localStorage: {
        hasToken: !!localStorage.getItem('token'),
        hasUser: !!localStorage.getItem('user'),
        userPreview: localStorage.getItem('user')?.substring(0, 50),
        tokenPreview: localStorage.getItem('token')?.substring(0, 20)
      }
    });
  }, [user, isAuthenticated, localAuthState]);

  // Listen for localStorage changes dan custom events (untuk update real-time setelah login)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    const handleAuthStateChanged = () => {
      console.log('🔄 Auth state changed event received');
      checkAuthStatus();
      setForceAuthCheck(prev => prev + 1);
    };
    
    // Juga check setiap kali component mount atau focus
    const handleFocus = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuthStatus]);

  // Force re-render ketika auth state berubah
  useEffect(() => {
    if (forceAuthCheck > 0) {
      console.log('🔄 Force auth check triggered:', forceAuthCheck);
      checkAuthStatus();
    }
  }, [forceAuthCheck, checkAuthStatus]);

  // Interval check untuk memastikan auth state ter-update (fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData && !isAuthenticated && !localAuthState.isAuthenticated) {
        console.log('🔄 Interval check: Found auth data but not authenticated, forcing check...');
        checkAuthStatus();
        setForceAuthCheck(prev => prev + 1);
      }
    }, 3000); // Check setiap 3 detik (kurangi frekuensi)

    return () => clearInterval(interval);
  }, [isAuthenticated, localAuthState.isAuthenticated, checkAuthStatus]);

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
    
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "verified" && artwork.status === "verified") ||
      (selectedCategory === "pending" && artwork.status === "pending");
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
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
                className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg font-medium"
              >
                <span className="text-lg">🎨</span>
                <span className="font-medium">Marketplace</span>
              </Link>
              <Link 
                href="/koleksi" 
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <span className="text-lg">💎</span>
                <span className="font-medium">Koleksi</span>
              </Link>
              {(isAuthenticated || localAuthState.isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('token') && localStorage.getItem('user'))) && (
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
              {(isAuthenticated || localAuthState.isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('token') && localStorage.getItem('user'))) ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition duration-300 p-2 rounded-xl hover:bg-gray-50 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm font-semibold">
                        {(user?.name || localAuthState.user?.name || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').name) || 'U')?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold hidden sm:block">
                      {user?.name || localAuthState.user?.name || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').name) || 'User'}
                    </span>
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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Digital Art
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Explore, collect, and trade verified digital artworks on the blockchain
            </p>

        {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                  placeholder="Search artworks, artists, or collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 pr-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-200"
                />
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                  <span className="text-purple-200 text-xl">🔍</span>
                </div>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Items", count: artworks.length },
                      { value: "verified", label: "Verified", count: artworks.filter(a => a.status === "verified").length },
                      { value: "pending", label: "Pending", count: artworks.filter(a => a.status === "pending").length },
                    ].map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          selectedCategory === category.value
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>{category.label}</span>
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 1000000})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredArtworks.length} Artworks Found
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button className="p-2 bg-white rounded-md shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Memuat karya...
              </h3>
            </div>
          ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      Coba sesuaikan kata kunci pencarian atau filter Anda
                  </p>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>

      <Footer />
      <ChatBubble />
    </main>
  );
}

