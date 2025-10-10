"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function Media() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mediaItems = [
    {
      id: 1,
      title: "BlockRights di TechCrunch",
      description:
        "Platform blockchain Indonesia yang mengubah cara perlindungan hak cipta digital",
      date: "15 Oktober 2024",
      category: "Press Release",
      image: "📰",
    },
    {
      id: 2,
      title: "Interview dengan Founder BlockRights",
      description:
        "Mengenal lebih dekat visi dan misi platform perlindungan hak cipta digital",
      date: "10 Oktober 2024",
      category: "Interview",
      image: "🎤",
    },
    {
      id: 3,
      title: "Demo BlockRights di Tech Conference 2024",
      description:
        "Presentasi teknologi blockchain untuk verifikasi hak cipta di konferensi teknologi terbesar Indonesia",
      date: "5 Oktober 2024",
      category: "Conference",
      image: "🎯",
    },
    {
      id: 4,
      title: "Partnership dengan Galeri Seni Digital",
      description:
        "Kolaborasi dengan galeri seni untuk memberikan sertifikat kepemilikan yang sah",
      date: "1 Oktober 2024",
      category: "Partnership",
      image: "🤝",
    },
    {
      id: 5,
      title: "BlockRights Mendapatkan Funding Series A",
      description:
        "Platform blockchain Indonesia berhasil mendapatkan pendanaan untuk pengembangan teknologi",
      date: "25 September 2024",
      category: "Funding",
      image: "💰",
    },
    {
      id: 6,
      title: "Webinar: Masa Depan Hak Cipta Digital",
      description:
        "Diskusi panel tentang perlindungan karya kreatif di era digital",
      date: "20 September 2024",
      category: "Webinar",
      image: "💻",
    },
  ];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 left-20 w-6 h-6 bg-blue-400 rotate-45 opacity-50 animate-bounce"></div>
          <div className="absolute top-60 left-32 w-3 h-3 bg-green-400 rounded-full opacity-70"></div>

          <div className="absolute top-32 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-52 right-32 w-6 h-6 bg-blue-400 rotate-45 opacity-50 animate-bounce"></div>
          <div className="absolute top-72 right-16 w-3 h-3 bg-green-400 rounded-full opacity-70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Media &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Press
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Berita terbaru, press release, dan update perkembangan BlockRights
              di media
            </p>
          </div>
        </div>
      </section>

      {/* Media Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{item.image}</div>
                <div className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                  {item.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatBubble />
    </main>
  );
}
