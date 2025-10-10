"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ArtworkCard from "./ArtworkCard";
import { useAuth } from "@/hooks/useAuth";

interface Artwork {
  id: string;
  title: string;
  description: string;
  fileHash: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  status: "pending" | "verified" | "disputed";
  userId: number;
  certificateUrl?: string;
  nftTokenId?: string;
}

export default function Hero() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    const fetchArtworks = async () => {
      try {
        const res = await fetch("/api/artworks/public");
        if (res.ok) {
          const data = await res.json();
          const list = data.data?.artworks || data.artworks || [];
          const normalized = list.slice(0, 8).map((a: any) => ({
            id: String(a.id),
            title: a.title,
            description: a.description,
            fileHash: a.file_hash || a.fileHash,
            fileType: a.file_type || a.fileType,
            fileSize: a.file_size || a.fileSize,
            createdAt: a.created_at || a.createdAt,
            status: (a.status as any) || "verified",
            userId: a.user_id,
          }));
          setArtworks(normalized);
        }
      } catch (e) {
        console.error("Error fetching artworks:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Header */}
        <div className="text-center mb-16">
          {/* Main Heading */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Lindungi Karya Kreatif Anda dengan{" "}
              <span className="gradient-text">
                Blockchain
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Platform revolusioner yang menggunakan teknologi blockchain untuk verifikasi hak cipta dan kepemilikan digital karya kreatif Anda. Buktikan kepemilikan dengan cara yang tidak dapat dipalsukan.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={() => router.push("/register")}
              className="btn-primary text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-3xl group relative overflow-hidden"
            >
              <span className="relative z-10">Mulai Sekarang - Gratis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => router.push("/verify")}
              className="btn-outline text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl group"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verifikasi Karya
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="card-hover text-center group">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                10,000+
              </div>
              <div className="text-gray-600 text-lg">Karya Terdaftar</div>
            </div>
            <div className="card-hover text-center group">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-gray-600 text-lg">Akurasi Verifikasi</div>
            </div>
            <div className="card-hover text-center group">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 text-lg">Dukungan Blockchain</div>
            </div>
          </div>
        </div>

        {/* Featured Artworks Section */}
        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Karya <span className="gradient-text">Terverifikasi</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lihat koleksi karya yang telah terverifikasi dan terlindungi dengan teknologi blockchain
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-80">
                  <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="card-hover max-w-md mx-auto">
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Karya</h3>
                <p className="text-gray-600 mb-8">
                  Belum ada karya terverifikasi yang tersedia untuk dilihat publik.
                </p>
                <button 
                  onClick={() => router.push("/register")}
                  className="btn-primary"
                >
                  Mulai Upload Karya
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className={`transition-all duration-1000 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <ArtworkCard 
                    artwork={artwork} 
                    onUpdate={() => {}} 
                    currentUserId={user?.id} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          {artworks.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/karya")}
                className="btn-outline text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl group"
              >
                <span className="flex items-center">
                  Lihat Semua Karya
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
