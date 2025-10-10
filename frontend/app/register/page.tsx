"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function Marketplace() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: "all", name: "Semua", icon: "🎨" },
    { id: "art", name: "Seni Digital", icon: "🖼️" },
    { id: "music", name: "Musik", icon: "🎵" },
    { id: "video", name: "Video", icon: "🎬" },
    { id: "photography", name: "Fotografi", icon: "📸" },
    { id: "writing", name: "Tulisan", icon: "📝" },
  ];

  const artworks = [
    {
      id: 1,
      title: "Digital Sunset",
      artist: "Ahmad Rahman",
      price: "0.5 ETH",
      image: "🌅",
      category: "art",
      likes: 24,
      verified: true,
    },
    {
      id: 2,
      title: "Cyber City",
      artist: "Sarah Putri",
      price: "1.2 ETH",
      image: "🏙️",
      category: "art",
      likes: 156,
      verified: true,
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Budi Santoso",
      price: "0.8 ETH",
      image: "🌊",
      category: "art",
      likes: 89,
      verified: false,
    },
    {
      id: 4,
      title: "Forest Dreams",
      artist: "Maya Sari",
      price: "0.3 ETH",
      image: "🌲",
      category: "art",
      likes: 67,
      verified: true,
    },
    {
      id: 5,
      title: "Space Journey",
      artist: "Rizki Pratama",
      price: "2.1 ETH",
      image: "🚀",
      category: "art",
      likes: 234,
      verified: true,
    },
    {
      id: 6,
      title: "Abstract Thoughts",
      artist: "Dewi Lestari",
      price: "0.7 ETH",
      image: "🌀",
      category: "art",
      likes: 45,
      verified: false,
    },
    {
      id: 7,
      title: "Urban Beat",
      artist: "Fajar Nugroho",
      price: "0.4 ETH",
      image: "🎵",
      category: "music",
      likes: 123,
      verified: true,
    },
    {
      id: 8,
      title: "Nature Symphony",
      artist: "Indira Putri",
      price: "0.9 ETH",
      image: "🎶",
      category: "music",
      likes: 78,
      verified: true,
    },
    {
      id: 9,
      title: "Street Photography",
      artist: "Agus Wijaya",
      price: "0.6 ETH",
      image: "📸",
      category: "photography",
      likes: 156,
      verified: true,
    },
    {
      id: 10,
      title: "Digital Poetry",
      artist: "Sari Dewi",
      price: "0.2 ETH",
      image: "📝",
      category: "writing",
      likes: 34,
      verified: false,
    },
    {
      id: 11,
      title: "Animated Short",
      artist: "Rudi Hartono",
      price: "1.5 ETH",
      image: "🎬",
      category: "video",
      likes: 189,
      verified: true,
    },
    {
      id: 12,
      title: "Cosmic Dance",
      artist: "Lina Sari",
      price: "1.8 ETH",
      image: "✨",
      category: "art",
      likes: 267,
      verified: true,
    },
  ];

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Login
              </button>
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

        {/* Categories */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Artwork Image */}
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center text-6xl">
                  {artwork.image}
                </div>

                {/* Artwork Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {artwork.title}
                    </h3>
                    {artwork.verified && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                  </div>

                  <p className="text-gray-600 text-xs">by {artwork.artist}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600 text-sm">
                      {artwork.price}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-500 text-xs">❤️</span>
                      <span className="text-gray-500 text-xs">
                        {artwork.likes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-300">
                    Buy Now
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-300">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No artworks found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ChatBubble />
    </main>
  );
}
