"use client";

import { useAuth } from '@/hooks/useAuth';

interface ProfileCompletenessProps {
  showDetails?: boolean;
  className?: string;
}

export default function ProfileCompleteness({ showDetails = true, className = "" }: ProfileCompletenessProps) {
  const { user, profileCompleteness, canVerify } = useAuth();

  if (!user || !profileCompleteness) {
    return null;
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const fieldLabels: Record<string, string> = {
    name: 'Nama Lengkap',
    email: 'Email',
    bio: 'Bio/Deskripsi',
    avatar: 'Foto Profil',
    website: 'Website',
    walletAddress: 'Alamat Wallet'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Kelengkapan Profil
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profileCompleteness.percentage)}`}>
          {profileCompleteness.percentage}%
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{profileCompleteness.completedFields.length}/{profileCompleteness.totalFields} field</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(profileCompleteness.percentage)}`}
            style={{ width: `${profileCompleteness.percentage}%` }}
          ></div>
        </div>
      </div>

      {!canVerify && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-800">
              Lengkapi profil untuk dapat verifikasi karya
            </span>
          </div>
        </div>
      )}

      {canVerify && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-800">
              Profil sudah cukup untuk verifikasi karya
            </span>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="space-y-4">
          {profileCompleteness.completedFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                ✅ Sudah Lengkap ({profileCompleteness.completedFields.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {profileCompleteness.completedFields.map((field) => (
                  <div key={field} className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    {fieldLabels[field] || field}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profileCompleteness.missingFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                ❌ Belum Lengkap ({profileCompleteness.missingFields.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {profileCompleteness.missingFields.map((field) => (
                  <div key={field} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {fieldLabels[field] || field}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
