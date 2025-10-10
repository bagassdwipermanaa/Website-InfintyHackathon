"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";
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

export default function KaryaPublikPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    const fetchVerified = async () => {
      try {
        const res = await fetch("/api/artworks/public");
        if (!res.ok) {
          throw new Error("Gagal memuat karya");
        }
        const data = await res.json();
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
          userId: a.user_id,
        }));
        setArtworks(normalized);
      } catch (e: any) {
        setError(e.message || "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVerified();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Karya <span className="gradient-text">Publik</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kumpulan karya yang telah terverifikasi. Siapa pun dapat melihat bukti kepemilikan dan tanggal pendaftaran dengan teknologi blockchain.
            </p>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="card-hover text-center group">
              <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                {artworks.length}
              </div>
              <div className="text-gray-600">Karya Tersedia</div>
            </div>
            <div className="card-hover text-center group">
              <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-gray-600">Terverifikasi</div>
            </div>
            <div className="card-hover text-center group">
              <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600">Akses Blockchain</div>
            </div>
          </div>
        </div>
      </section>

      {/* Artworks Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
          ) : error ? (
            <div className="card bg-red-50 border-red-200 text-red-700 text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Gagal Memuat Karya</h3>
              <p>{error}</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="card-hover max-w-md mx-auto">
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Belum Ada Karya</h3>
                <p className="text-gray-600 mb-8">
                  Belum ada karya terverifikasi yang tersedia untuk dilihat publik.
                </p>
                <button className="btn-primary">
                  Lihat Cara Upload
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
        </div>
      </section>
      
      <Footer />
    </main>
  );
}


