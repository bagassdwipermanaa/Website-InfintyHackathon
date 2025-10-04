"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }

      // Get admin data from token (simple implementation)
      const adminData = localStorage.getItem("admin");
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("admin");
    router.push("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Artworks", href: "/admin/artworks", icon: "🎨" },
    { name: "Activities", href: "/admin/activities", icon: "📝" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {admin?.full_name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name ||
                  "Admin Panel"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {admin?.full_name || "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
