"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArtworkCard from "@/components/ArtworkCard";

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

export default function KaryaPublikPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    <main className="min-h-screen">
      <Header />
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Karya Publik</h1>
            <p className="text-gray-600">
              Kumpulan karya yang telah terverifikasi. Siapa pun dapat melihat
              bukti kepemilikan dan tanggal pendaftaran.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-64" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center text-gray-500">Belum ada karya terverifikasi</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((a: Artwork) => (
                <ArtworkCard key={a.id} artwork={a} onUpdate={() => {}} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}


