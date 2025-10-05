"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  artworks: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    disputed: number;
  };
  activities: {
    total_activities: number;
    unique_users: number;
    unique_admins: number;
    logins: number;
    logouts: number;
    uploads: number;
    verifications: number;
  };
  recentActivities: any[];
  recentArtworks: any[];
  monthlyStats: {
    month: string;
    users: number;
    artworks: number;
    activities: number;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      fetchStats();
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        setError("Gagal memuat data dashboard");
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Ringkasan statistik dan aktivitas sistem
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.users.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  {stats?.users.active || 0} aktif
                </span>
                <span className="text-blue-600">
                  +{stats?.users.new_this_month || 0} bulan ini
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🎨</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Karya
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.artworks.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600">
                  {stats?.artworks.pending || 0} pending
                </span>
                <span className="text-green-600">
                  {stats?.artworks.verified || 0} verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktivitas (30 hari)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.activities.total_activities || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">
                {stats?.activities.unique_users || 0} user aktif
              </span>
            </div>
          </div>
        </div>

        {/* Verifications Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Verifikasi
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.activities.verifications || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                {stats?.activities.uploads || 0} upload
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pertumbuhan User
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Chart akan ditampilkan di sini</p>
              <p className="text-sm text-gray-500">
                Data: {stats?.users.total || 0} total users
              </p>
            </div>
          </div>
        </div>

        {/* Artwork Status Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Status Karya
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.artworks.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Verified</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.artworks.verified || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.artworks.rejected || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Disputed</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.artworks.disputed || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Artworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Aktivitas Terbaru
              </h3>
              <Link
                href="/admin/activities"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Lihat semua
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentActivities?.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">📝</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivities ||
                stats.recentActivities.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada aktivitas
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Karya Terbaru
              </h3>
              <Link
                href="/admin/artworks"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Lihat semua
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentArtworks?.slice(0, 5).map((artwork, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">🎨</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {artwork.user_name} • {artwork.status}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.recentArtworks ||
                stats.recentArtworks.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada karya
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600">👥</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-500">
                View and manage user accounts
              </p>
            </div>
          </Link>

          <Link
            href="/admin/artworks"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600">🎨</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Review Artworks</h4>
              <p className="text-sm text-gray-500">
                Review and verify artworks
              </p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600">⚙️</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">System Settings</h4>
              <p className="text-sm text-gray-500">Configure system settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
