"use client";

import { useState, useEffect } from "react";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function Kontak() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Terima kasih! Pesan Anda telah dikirim.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "hello@blockrights.id",
      description: "Kirim email untuk pertanyaan umum",
    },
    {
      icon: "📞",
      title: "Telepon",
      value: "+62 21 1234 5678",
      description: "Hubungi kami untuk dukungan teknis",
    },
    {
      icon: "📍",
      title: "Alamat",
      value: "Jakarta, Indonesia",
      description: "Kantor pusat BlockRights",
    },
    {
      icon: "💬",
      title: "Live Chat",
      value: "24/7 Support",
      description: "Chat langsung dengan tim kami",
    },
  ];

  return (
    <main className="min-h-screen">
      <HomeHeader />

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
              Hubungi{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kami
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ada pertanyaan? Butuh bantuan? Tim kami siap membantu Anda 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Kirim Pesan
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                        placeholder="Masukkan email"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Subjek
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Masukkan subjek pesan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 transition-all duration-300 resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Informasi Kontak
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Tim kami siap membantu Anda dengan pertanyaan apa pun
                    tentang BlockRights. Jangan ragu untuk menghubungi kami
                    melalui berbagai saluran yang tersedia.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-3xl">{info.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-purple-600 font-medium mb-2">
                          {info.value}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Pertanyaan Umum
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>Q:</strong> Bagaimana cara menggunakan
                      BlockRights?
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>A:</strong> Daftar akun, upload karya Anda, dan
                      dapatkan sertifikat kepemilikan blockchain.
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Q:</strong> Apakah ada biaya untuk menggunakan
                      platform?
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>A:</strong> BlockRights menawarkan paket gratis
                      dan premium sesuai kebutuhan Anda.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBubble />
    </main>
  );
}
