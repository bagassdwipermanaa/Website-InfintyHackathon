"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  profile_completed: boolean;
  email_verified: boolean;
  full_name?: string;
  bio?: string;
  website?: string;
  social_media?: string; // legacy
  socialLinks?: Record<string, any>; // parsed from backend sanitizeUser
  wallet_address?: string;
  phone?: string;
  address?: string;
  artworks_count: number;
  activities_count: number;
  recent_activities: any[];
  recent_artworks: any[];
}

export default function UserDetailPage() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Unauthorized. Silakan login sebagai admin.");
        setIsLoading(false);
        return;
      }
      fetchUserDetail();
    };

    checkAuth();
  }, [router, userId]);

  const fetchUserDetail = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else if (response.status === 401) {
        setError(
          "Sesi admin tidak valid atau kedaluwarsa. Silakan login ulang."
        );
      } else {
        setError("Gagal memuat detail user");
      }
    } catch (error) {
      console.error("Fetch user detail error:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: normalisasi URL social media dari handle/user input
  const normalizeSocialUrl = (platform: string, value: string): string => {
    const v = value.trim();
    const noAt = v.startsWith("@") ? v.slice(1) : v;
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    switch (platform.toLowerCase()) {
      case "twitter":
      case "x":
        return `https://twitter.com/${noAt}`;
      case "instagram":
        return `https://instagram.com/${noAt}`;
      case "linkedin":
        return `https://linkedin.com/in/${noAt}`;
      case "github":
        return `https://github.com/${noAt}`;
      case "tiktok":
        return `https://www.tiktok.com/@${noAt}`;
      case "facebook":
        return `https://www.facebook.com/${noAt}`;
      case "youtube":
        return `https://youtube.com/${noAt}`;
      default:
        return v.startsWith("http") ? v : `https://${v}`;
    }
  };

  const toggleUserStatus = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !user.is_active }),
      });

      if (response.ok) {
        setUser({ ...user, is_active: !user.is_active });
      } else {
        alert("Gagal mengubah status user");
      }
    } catch (error) {
      console.error("Toggle user status error:", error);
      alert("Terjadi kesalahan saat mengubah status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <p className="text-gray-600">{error || "User tidak ditemukan"}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={fetchUserDetail}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Kembali ke Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/users"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Kembali
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail User</h1>
            <p className="text-gray-600">Informasi lengkap tentang user</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={toggleUserStatus}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              user.is_active
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isUpdating
              ? "Updating..."
              : user.is_active
              ? "Deactivate"
              : "Activate"}
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="ml-auto">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Basic Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Full Name:</span>
                  <p className="text-sm font-medium">
                    {user.full_name || user.name || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bio:</span>
                  <p className="text-sm font-medium">{user.bio || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <p className="text-sm font-medium">{user.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Address:</span>
                  <p className="text-sm font-medium">{user.address || "-"}</p>
                </div>
              </div>
            </div>

            {/* Profile Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Profile Status
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="text-gray-500">Profile Completed: </span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full align-middle ${
                      user.profile_completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.profile_completed ? "Complete" : "Incomplete"}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="text-gray-500">Email Verified: </span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full align-middle ${
                      user.email_verified
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.email_verified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="text-gray-500">Last Login: </span>
                  <span className="ml-2 text-sm font-medium">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("id-ID")
                      : "Never"}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="text-gray-500">Joined: </span>
                  <span className="ml-2 text-sm font-medium">
                    {new Date(user.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Social Links
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Website:</span>
                  <p className="text-sm font-medium">
                    {(() => {
                      const website =
                        (user as any).website || user.socialLinks?.website;
                      return website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {website}
                        </a>
                      ) : (
                        "-"
                      );
                    })()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Wallet Address:</span>
                  <p className="text-sm font-medium break-all">
                    {user.wallet_address || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Social Media:</span>
                  <p className="text-sm font-medium break-words">
                    {(() => {
                      const links = user.social_media
                        ? { note: user.social_media }
                        : user.socialLinks || {};
                      const entries = Object.entries(links).filter(
                        ([, v]) => v
                      );
                      if (entries.length === 0) return "-";
                      const icon = (platform: string) => {
                        const p = platform.toLowerCase();
                        if (p.includes("twitter") || p === "x") return "🐦";
                        if (p.includes("instagram")) return "📸";
                        if (p.includes("linkedin")) return "💼";
                        if (p.includes("github")) return "🐙";
                        if (p.includes("tiktok")) return "🎵";
                        if (p.includes("facebook")) return "📘";
                        if (p.includes("youtube")) return "▶️";
                        return "🔗";
                      };
                      return (
                        <span className="flex flex-wrap gap-2">
                          {entries.map(([platform, val]) => {
                            const url = normalizeSocialUrl(
                              platform,
                              String(val)
                            );
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <span>{icon(platform)}</span>
                                <span className="capitalize">{platform}</span>
                              </a>
                            );
                          })}
                        </span>
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Artworks
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user.artworks_count}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Activities
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user.activities_count}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Account Age</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(
                  (Date.now() - new Date(user.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Activities
          </h3>
        </div>
        <div className="px-6 py-4">
          {user.recent_activities && user.recent_activities.length > 0 ? (
            <div className="space-y-3">
              {user.recent_activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activities
            </p>
          )}
        </div>
      </div>

      {/* Recent Artworks */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Artworks</h3>
        </div>
        <div className="px-6 py-4">
          {user.recent_artworks && user.recent_artworks.length > 0 ? (
            <div className="space-y-3">
              {user.recent_artworks.slice(0, 5).map((artwork, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">🎨</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{artwork.title}</p>
                    <p className="text-xs text-gray-500">
                      {artwork.status} •{" "}
                      {new Date(artwork.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent artworks
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
