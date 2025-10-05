"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SystemSettings {
  site_name: string;
  site_description: string;
  max_file_size: number;
  allowed_file_types: string[];
  email_verification_required: boolean;
  auto_approve_artworks: boolean;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  max_artworks_per_user: number;
  artwork_verification_days: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      fetchSettings();
    };

    checkAuth();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      } else {
        setError("Gagal memuat pengaturan sistem");
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
      setError("Terjadi kesalahan saat memuat pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("Pengaturan berhasil disimpan!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setError("Gagal menyimpan pengaturan");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      setError("Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchSettings}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Konfigurasi pengaturan sistem</p>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-green-600">✅</div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-600">⚠️</div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              General Settings
            </h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleInputChange("site_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) =>
                  handleInputChange("site_description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onChange={(e) =>
                  handleInputChange("maintenance_mode", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="maintenance_mode"
                className="ml-2 text-sm text-gray-700"
              >
                Maintenance Mode
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="registration_enabled"
                checked={settings.registration_enabled}
                onChange={(e) =>
                  handleInputChange("registration_enabled", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="registration_enabled"
                className="ml-2 text-sm text-gray-700"
              >
                Enable User Registration
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              File Upload Settings
            </h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={settings.max_file_size}
                onChange={(e) =>
                  handleInputChange("max_file_size", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed File Types (comma separated)
              </label>
              <input
                type="text"
                value={settings.allowed_file_types.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "allowed_file_types",
                    e.target.value.split(", ")
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jpg, png, gif, pdf, doc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Artworks per User
              </label>
              <input
                type="number"
                value={settings.max_artworks_per_user}
                onChange={(e) =>
                  handleInputChange(
                    "max_artworks_per_user",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Verification Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Verification Settings
            </h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email_verification_required"
                checked={settings.email_verification_required}
                onChange={(e) =>
                  handleInputChange(
                    "email_verification_required",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="email_verification_required"
                className="ml-2 text-sm text-gray-700"
              >
                Require Email Verification
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_approve_artworks"
                checked={settings.auto_approve_artworks}
                onChange={(e) =>
                  handleInputChange("auto_approve_artworks", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="auto_approve_artworks"
                className="ml-2 text-sm text-gray-700"
              >
                Auto Approve Artworks
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Verification Days
              </label>
              <input
                type="number"
                value={settings.artwork_verification_days}
                onChange={(e) =>
                  handleInputChange(
                    "artwork_verification_days",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSaving
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
