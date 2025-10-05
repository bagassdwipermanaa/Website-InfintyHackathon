"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  website: string;
  walletAddress: string;
  phone?: string;
  address?: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
  };
}

export default function ProfilPage() {
  const { user, profileCompleteness, checkAuthStatus } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    website: "",
    walletAddress: "",
    phone: "",
    address: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        website: user.website || "",
        walletAddress: user.walletAddress || "",
        phone: (user as any).phone || "",
        address: (user as any).address || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          instagram: user.socialLinks?.instagram || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("socialLinks.")) {
      const socialField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        setIsEditing(false);
        await checkAuthStatus(); // Refresh user data
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal memperbarui profil",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat memperbarui profil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        website: user.website || "",
        walletAddress: user.walletAddress || "",
        phone: (user as any).phone || "",
        address: (user as any).address || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          instagram: user.socialLinks?.instagram || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
        },
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const getCompletionPercentage = () => {
    if (!profileCompleteness) return 0;
    return profileCompleteness.percentage;
  };

  const getMissingFields = () => {
    if (!profileCompleteness) return [];
    return profileCompleteness.missingFields;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.name}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user?.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.isVerified
                        ? "✓ Terverifikasi"
                        : "⏳ Belum Terverifikasi"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completeness */}
            {profileCompleteness && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Kelengkapan Profil
                  </h3>
                  <span className="text-sm text-gray-600">
                    {getCompletionPercentage()}% Lengkap
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                {getMissingFields().length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="mb-1">Field yang belum diisi:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {getMissingFields().map((field, index) => (
                        <li key={index} className="capitalize">
                          {field.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informasi Profil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="Masukkan email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="Nomor telepon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="Alamat"
                  />
                </div>
              </div>

              {/* Contact & Social */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="https://website-anda.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={profileData.walletAddress}
                    onChange={(e) =>
                      handleInputChange("walletAddress", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    placeholder="0x..."
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Media Sosial
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) =>
                        handleInputChange("socialLinks.twitter", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={profileData.socialLinks.instagram}
                      onChange={(e) =>
                        handleInputChange(
                          "socialLinks.instagram",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) =>
                        handleInputChange(
                          "socialLinks.linkedin",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={profileData.socialLinks.github}
                      onChange={(e) =>
                        handleInputChange("socialLinks.github", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                      placeholder="github.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
