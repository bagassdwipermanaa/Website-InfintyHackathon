"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProfileCheckerProps {
  children: React.ReactNode;
  artworkTitle?: string;
  artworkId?: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  walletAddress: string;
  address: string;
}

export default function ProfileChecker({ children, artworkTitle, artworkId }: ProfileCheckerProps) {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      checkProfileCompleteness();
    }
  }, [isAuthenticated, user]);

  const checkProfileCompleteness = async () => {
    try {
      const response = await fetch("/api/auth/profile-status");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
        
        const missing = [];
        if (!data.user.name || data.user.name.trim() === "") missing.push("Nama Lengkap");
        if (!data.user.email || data.user.email.trim() === "") missing.push("Email");
        if (!data.user.phone || data.user.phone.trim() === "") missing.push("Nomor Telepon");
        if (!data.user.walletAddress || data.user.walletAddress.trim() === "") missing.push("Wallet Address");
        if (!data.user.address || data.user.address.trim() === "") missing.push("Alamat");
        
        setMissingFields(missing);
        
        if (missing.length > 0) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const handleCompleteProfile = () => {
    setShowModal(false);
    router.push("/profil");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* Profile Completeness Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Profil Belum Lengkap
              </h3>
              <p className="text-gray-600">
                Untuk membeli karya "{artworkTitle || "ini"}, Anda perlu melengkapi profil terlebih dahulu.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Data yang perlu dilengkapi:</h4>
              <ul className="space-y-2">
                {missingFields.map((field, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteProfile}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200"
              >
                Lengkapi Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
