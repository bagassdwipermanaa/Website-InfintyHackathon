"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
      setMessage({
        type: "error",
        text: "Email/username dan password wajib diisi",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Coba login sebagai user dulu
      let response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = await response.json();

      // Jika user login berhasil
      if (response.ok && data.success) {
        // Store user token
        localStorage.setItem("token", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(data.data.user));

        setMessage({ type: "success", text: "Login berhasil!" });

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
        return;
      }

      // Jika user login gagal, coba admin login
      response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      data = await response.json();

      // Jika admin login berhasil
      if (response.ok && data.success) {
        // Store admin token
        localStorage.setItem("adminToken", data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem("adminRefreshToken", data.data.refreshToken);
        }

        setMessage({ type: "success", text: "Admin login berhasil!" });

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
        return;
      }

      // Jika kedua login gagal
      setMessage({
        type: "error",
        text: data.message || "Email/username atau password salah",
      });
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat login" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Masuk ke BlockRights
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Akses dashboard dan kelola karya Anda
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div
                className={`p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email atau Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
                  placeholder="Masukkan email atau username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-200"
                  placeholder="Masukkan password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Lupa password?
                  </a>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">Atau</span>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                <span className="mr-2">🦊</span>
                Masuk dengan MetaMask
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                <span className="mr-2">🔍</span>
                Masuk dengan Google
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Daftar di sini
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
