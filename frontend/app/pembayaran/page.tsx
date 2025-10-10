"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "bca",
    name: "BCA",
    icon: "🏦",
    description: "Bank Central Asia",
    isAvailable: true,
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    icon: "🏦",
    description: "Bank Mandiri",
    isAvailable: true,
  },
  {
    id: "bni",
    name: "BNI",
    icon: "🏦",
    description: "Bank Negara Indonesia",
    isAvailable: true,
  },
  {
    id: "bri",
    name: "BRI",
    icon: "🏦",
    description: "Bank Rakyat Indonesia",
    isAvailable: true,
  },
  {
    id: "gopay",
    name: "GoPay",
    icon: "💚",
    description: "GoPay - Gojek",
    isAvailable: true,
  },
  {
    id: "ovo",
    name: "OVO",
    icon: "🟣",
    description: "OVO",
    isAvailable: true,
  },
  {
    id: "dana",
    name: "DANA",
    icon: "🔵",
    description: "DANA",
    isAvailable: true,
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    icon: "🟠",
    description: "ShopeePay",
    isAvailable: true,
  },
];

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [artworkData, setArtworkData] = useState<any>(null);

  // Get artwork data from URL params
  useEffect(() => {
    const artworkId = searchParams.get("artworkId");
    const artworkTitle = searchParams.get("title");
    const artworkPrice = searchParams.get("price");

    if (!artworkId || !artworkTitle) {
      router.push("/karya");
      return;
    }

    setArtworkData({
      id: artworkId,
      title: artworkTitle,
      price: artworkPrice || "100000", // Default price if not provided
    });
  }, [searchParams, router]);

  const handlePayment = async () => {
    if (!selectedMethod || !artworkData) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate payment session token
      const paymentToken = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store payment session in localStorage
      localStorage.setItem("paymentSession", JSON.stringify({
        token: paymentToken,
        artworkId: artworkData.id,
        artworkTitle: artworkData.title,
        paymentMethod: selectedMethod,
        timestamp: Date.now(),
        userId: user?.id,
      }));

      // Redirect to success page
      router.push(`/pembayaranberhasil?token=${paymentToken}`);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!artworkData) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pembayaran...</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
            <p className="text-gray-600">Pilih metode pembayaran untuk menyelesaikan pembelian</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Artwork Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Karya</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Judul Karya</p>
                    <p className="font-medium text-gray-900">{artworkData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Harga</p>
                    <p className="text-2xl font-bold text-purple-600">
                      Rp {parseInt(artworkData.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pembeli</p>
                    <p className="font-medium text-gray-900">{user?.name || "Guest"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Pilih Metode Pembayaran</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      disabled={!method.isAvailable}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? "border-purple-500 bg-purple-50"
                          : method.isAvailable
                          ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Memproses Pembayaran...
                      </>
                    ) : (
                      `Bayar Rp ${parseInt(artworkData.price).toLocaleString("id-ID")}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
