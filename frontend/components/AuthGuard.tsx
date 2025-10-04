"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireCompleteProfile?: boolean;
  redirectTo?: string;
  showModal?: boolean;
}

interface ProfileWarning {
  show: boolean;
  missingRequired: string[];
  recommendations: string[];
  onComplete: () => void;
  onCancel: () => void;
}

function ProfileWarningModal({ show, missingRequired, recommendations, onComplete, onCancel }: ProfileWarning) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profil Belum Lengkap
          </h3>
          <p className="text-gray-600 mb-4">
            Untuk verifikasi karya, kamu perlu melengkapi profil terlebih dahulu.
          </p>
        </div>

        {missingRequired.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Data Wajib:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {missingRequired.map((field) => (
                <li key={field}>
                  {field === 'name' ? 'Nama lengkap' : 
                   field === 'email' ? 'Email' : field}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Disarankan:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {recommendations.map((field) => (
                <li key={field}>
                  {field === 'bio' ? 'Bio/Deskripsi' :
                   field === 'walletAddress' ? 'Alamat Wallet' :
                   field === 'avatar' ? 'Foto Profil' :
                   field === 'website' ? 'Website' : field}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Nanti Saja
          </button>
          <button
            onClick={onComplete}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lengkapi Profil
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireCompleteProfile = false,
  redirectTo,
  showModal = true
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated, checkVerificationEligibility } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [eligibilityData, setEligibilityData] = useState<{
    canVerify: boolean;
    missingRequired: string[];
    recommendations: string[];
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/login');
      return;
    }

    if (requireCompleteProfile && isAuthenticated) {
      checkVerificationEligibility().then((data) => {
        setEligibilityData(data);
        if (!data.canVerify && showModal) {
          setShowWarning(true);
        }
      });
    }
  }, [isLoading, isAuthenticated, requireAuth, requireCompleteProfile, router, redirectTo, showModal, checkVerificationEligibility]);

  const handleCompleteProfile = () => {
    setShowWarning(false);
    router.push('/dashboard?tab=profile');
  };

  const handleCancelWarning = () => {
    setShowWarning(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireCompleteProfile && eligibilityData && !eligibilityData.canVerify && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profil Belum Lengkap
          </h2>
          <p className="text-gray-600 mb-4">
            Silakan lengkapi profil untuk mengakses fitur ini.
          </p>
          <button
            onClick={handleCompleteProfile}
            className="btn-primary"
          >
            Lengkapi Profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {eligibilityData && (
        <ProfileWarningModal
          show={showWarning}
          missingRequired={eligibilityData.missingRequired}
          recommendations={eligibilityData.recommendations}
          onComplete={handleCompleteProfile}
          onCancel={handleCancelWarning}
        />
      )}
    </>
  );
}
