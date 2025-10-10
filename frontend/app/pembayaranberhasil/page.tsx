"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PaymentSession {
  token: string;
  artworkId: string;
  artworkTitle: string;
  paymentMethod: string;
  timestamp: number;
  userId: number;
}

export default function PembayaranBerhasilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentSession | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      // No token provided, redirect to home
      router.push("/");
      return;
    }

    // Get payment session from localStorage
    const paymentSession = localStorage.getItem("paymentSession");
    
    if (!paymentSession) {
      // No payment session found, redirect to home
      router.push("/");
      return;
    }

    try {
      const sessionData: PaymentSession = JSON.parse(paymentSession);
      
      // Verify token matches
      if (sessionData.token !== token) {
        router.push("/");
        return;
      }

      // Check if session is not too old (24 hours)
      const now = Date.now();
      const sessionAge = now - sessionData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxAge) {
        // Session expired, clear it and redirect
        localStorage.removeItem("paymentSession");
        router.push("/");
        return;
      }

      setPaymentData(sessionData);
      setIsValid(true);
    } catch (error) {
      console.error("Error parsing payment session:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, router]);

  // Process purchase automatically when page loads
  useEffect(() => {
    if (isValid && paymentData && !purchaseSuccess && !isProcessingPurchase) {
      processPurchase();
    }
  }, [isValid, paymentData, purchaseSuccess, isProcessingPurchase]);

  const getPaymentMethodName = (methodId: string) => {
    const methods: { [key: string]: string } = {
      bca: "BCA",
      mandiri: "Bank Mandiri",
      bni: "BNI",
      bri: "BRI",
      gopay: "GoPay",
      ovo: "OVO",
      dana: "DANA",
      shopeepay: "ShopeePay",
    };
    return methods[methodId] || methodId;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const processPurchase = async () => {
    if (!paymentData) return;

    setIsProcessingPurchase(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await fetch("/api/artworks/buy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId: paymentData.artworkId,
          paymentMethod: paymentData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPurchaseSuccess(true);
        // Clear payment session after successful purchase
        localStorage.removeItem("paymentSession");
      } else {
        throw new Error(data.message || "Gagal memproses pembelian");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Terjadi kesalahan saat memproses pembelian. Silakan coba lagi.");
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  if (isLoading || isProcessingPurchase) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isLoading ? "Memverifikasi pembayaran..." : "Memproses pembelian karya..."}
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!isValid || !paymentData) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
            <p className="text-gray-600 mb-6">
              Halaman ini hanya dapat diakses setelah menyelesaikan proses pembayaran.
            </p>
            <Link
              href="/karya"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Kembali ke Karya Publik
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {purchaseSuccess ? "Pembelian Berhasil!" : "Pembayaran Berhasil!"}
            </h1>
            <p className="text-gray-600">
              {purchaseSuccess 
                ? "Karya telah berhasil ditambahkan ke koleksi Anda!" 
                : "Terima kasih! Pembayaran Anda telah berhasil diproses."
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detail Pembayaran</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Karya yang Dibeli</span>
                <span className="font-medium text-gray-900">{paymentData.artworkTitle}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodName(paymentData.paymentMethod)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Waktu Pembayaran</span>
                <span className="font-medium text-gray-900">
                  {formatDate(paymentData.timestamp)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Berhasil
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">ID Transaksi</span>
                <span className="font-mono text-sm text-gray-500">
                  {paymentData.token}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="text-blue-400 text-xl">ℹ️</div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Informasi Penting
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    {purchaseSuccess ? (
                      <>
                        <li>Karya telah berhasil dibeli dan ditambahkan ke koleksi Anda</li>
                        <li>Anda dapat mengakses karya ini kapan saja dari dashboard</li>
                        <li>Karya akan muncul di bagian "Karya Saya" dengan status "Terverifikasi"</li>
                        <li>Bukti pembayaran telah dikirim ke email Anda</li>
                      </>
                    ) : (
                      <>
                        <li>Pembayaran telah berhasil diproses</li>
                        <li>Karya sedang ditambahkan ke koleksi Anda</li>
                        <li>Anda akan diarahkan ke dashboard setelah selesai</li>
                        <li>Jika ada pertanyaan, silakan hubungi customer service</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Lihat Dashboard
            </Link>
            <Link
              href="/karya"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Lihat Karya Lainnya
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
