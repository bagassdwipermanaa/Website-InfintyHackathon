"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Activity {
  id: number;
  user_id?: number;
  admin_id?: number;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user_name?: string;
  admin_name?: string;
  metadata?: any;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }
      fetchActivities();
    };

    checkAuth();
  }, [router, currentPage, filter, searchTerm]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const url = `/api/admin/activities?page=${currentPage}&filter=${filter}&search=${searchTerm}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.data.activities);
        setTotalPages(data.data.pagination.pages);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        setError("Gagal memuat data activities");
      }
    } catch (error) {
      console.error("Fetch activities error:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchActivities();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "user_login":
      case "admin_login":
        return "🔐";
      case "user_logout":
      case "admin_logout":
        return "🚪";
      case "user_register":
        return "👤";
      case "artwork_upload":
        return "📤";
      case "artwork_verify":
        return "✅";
      case "artwork_reject":
        return "❌";
      case "profile_update":
        return "✏️";
      case "password_change":
        return "🔑";
      default:
        return "📝";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "user_login":
      case "admin_login":
        return "text-green-600";
      case "user_logout":
      case "admin_logout":
        return "text-gray-600";
      case "user_register":
        return "text-blue-600";
      case "artwork_upload":
        return "text-purple-600";
      case "artwork_verify":
        return "text-green-600";
      case "artwork_reject":
        return "text-red-600";
      case "profile_update":
        return "text-yellow-600";
      case "password_change":
        return "text-orange-600";
      default:
        return "text-gray-600";
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
          onClick={fetchActivities}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">
            Pantau semua aktivitas sistem dan user
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {activities.length} activities
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-4">
            <input
              type="text"
              placeholder="Cari berdasarkan deskripsi atau user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </form>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Activities</option>
            <option value="login">Login/Logout</option>
            <option value="artwork">Artwork Actions</option>
            <option value="profile">Profile Updates</option>
            <option value="admin">Admin Actions</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {getActionIcon(activity.action)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </div>
                        {activity.metadata && (
                          <div className="text-xs text-gray-500">
                            {JSON.stringify(activity.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {activity.user_name || activity.admin_name || "System"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.user_id
                          ? `User #${activity.user_id}`
                          : activity.admin_id
                          ? `Admin #${activity.admin_id}`
                          : "System"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(
                        activity.action
                      )}`}
                    >
                      {activity.action.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.ip_address || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
