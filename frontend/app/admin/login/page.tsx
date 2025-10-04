"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validasi input
    if (!formData.username || !formData.password) {
      setMessage({ type: "error", text: "Username dan password wajib diisi" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin token
        localStorage.setItem("adminToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("adminRefreshToken", data.data.refreshToken);
        }

        setMessage({ type: "success", text: "Login berhasil!" });

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Login gagal" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat login" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div>
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white text-3xl font-bold">👑</span>
            </div>
            <h2 className="mt-6 text-center text-4xl font-bold text-white">
              Admin Panel
            </h2>
            <p className="mt-2 text-center text-sm text-white/80">
              Akses eksklusif ke panel administrasi BlockRights
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div
                className={`p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-200 border border-green-400/30"
                    : "bg-red-500/20 text-red-200 border border-red-400/30"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-white/90 mb-2"
                >
                  Username atau Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200 backdrop-blur-sm"
                  placeholder="admin"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white/90 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200 backdrop-blur-sm"
                  placeholder="Masukkan password"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 rounded bg-white/10"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-white/90"
                >
                  Ingat saya
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? "Memproses..." : "🔐 Masuk ke Admin Panel"}
              </button>
            </div>

            <div className="text-center space-y-3">
              <a
                href="/"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center justify-center"
              >
                ← Kembali ke halaman utama
              </a>
              <div className="text-xs text-white/50">
                Akses terbatas untuk administrator
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
