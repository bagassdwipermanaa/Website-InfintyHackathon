'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Artwork } from "@/types/artwork";
import ProfileChecker from './ProfileChecker';

interface ArtworkCardProps {
  artwork: Artwork
  onUpdate: () => void
  currentUserId?: number
}

export default function ArtworkCard({ artwork, onUpdate, currentUserId }: ArtworkCardProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // Generate unique record hash by combining file hash with artwork ID
  const recordHash = `${(artwork.fileHash || '').toString()}_${(artwork.id || '').toString()}`
  
  // Check if this artwork belongs to the current user
  const artworkUserId = artwork.userId || artwork.user_id
  const isOwner = currentUserId && artworkUserId === currentUserId
  
  // Debug log
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Ownership check:', {
      currentUserId,
      artworkUserId,
      'artwork.userId': artwork.userId,
      'artwork.user_id': artwork.user_id,
      isOwner
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'disputed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Terverifikasi'
      case 'pending':
        return 'Menunggu'
      case 'rejected':
        return 'Ditolak'
      case 'disputed':
        return 'Dispute'
      default:
        return 'Unknown'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType?: string) => {
    const t = fileType || ''
    if (t.startsWith('image/')) return '🖼️'
    if (t.startsWith('audio/')) return '🎵'
    if (t.startsWith('video/')) return '🎬'
    if (t.includes('pdf')) return '📄'
    if (t.includes('text')) return '📝'
    return '📁'
  }

  const getImagePreview = () => {
    // Generate unique gradient based on file hash
    const hash = artwork.fileHash || String(artwork.id)
    const hue1 = parseInt(hash.substring(0, 2), 16) % 360
    const hue2 = (hue1 + 60) % 360
    
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 75%))`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const copyHash = () => {
    navigator.clipboard.writeText(artwork.fileHash)
    // You could add a toast notification here
  }

  const downloadCertificate = async () => {
    if (artwork.certificateUrl) {
      window.open(artwork.certificateUrl, '_blank')
    }
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Karya berhasil dihapus!')
        onUpdate() // Refresh the list
      } else {
        const data = await response.json()
        alert(data.message || 'Gagal menghapus karya')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Terjadi kesalahan saat menghapus karya')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      {/* Header with thumbnail and title */}
      <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        <div 
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md flex-shrink-0"
          style={{ background: getImagePreview() }}
        >
          {getFileIcon(artwork.fileType)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                {artwork.title}
              </h3>
              <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                <div>{formatFileSize(artwork.fileSize)}</div>
                <div className="hidden sm:block">{formatDate(artwork.createdAt)}</div>
                <div className="sm:hidden">{new Date(artwork.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
              </div>
            </div>
            
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-600 transition duration-200 p-1 sm:p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 z-20">
                  <div className="py-2">
                    <button
                      onClick={copyHash}
                      className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      📋 Salin Hash
                    </button>
                    {artwork.certificateUrl && (
                      <button
                        onClick={downloadCertificate}
                        className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        📄 Download Sertifikat
                      </button>
                    )}
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      👁️ Lihat Detail
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {artwork.description && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {artwork.description}
          </p>
        </div>
      )}

      {/* Status */}
      <div className="mb-4">
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(artwork.status)}`}>
          {getStatusText(artwork.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">ID Upload:</span>
          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            {(artwork.id || "").toString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">Hash Rekaman:</span>
          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg truncate max-w-32 sm:max-w-none" title={`Hash Konten: ${artwork.fileHash || ''}`}>
            <span className="hidden sm:inline">{recordHash.substring(0, 8)}...{recordHash.substring(Math.max(0, recordHash.length - 8))}</span>
            <span className="sm:hidden">{recordHash.substring(0, 4)}...{recordHash.substring(Math.max(0, recordHash.length - 4))}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 sm:pt-6 border-t border-gray-200">
        {isOwner ? (
          // Show edit, verification and delete buttons for owner
          <div className="space-y-3 sm:space-y-4">
            {/* Top row buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => {
                  // TODO: Navigate to edit page
                  console.log('Edit artwork:', artwork.id)
                }}
                className="flex flex-col items-center justify-center px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-lg sm:text-2xl mb-1">✏️</span>
                <span className="truncate">Edit Karya</span>
              </button>
              
              <Link
                href={`/verify?hash=${encodeURIComponent(artwork.fileHash || '')}&id=${encodeURIComponent(artwork.id)}`}
                className="flex flex-col items-center justify-center px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-lg sm:text-2xl mb-1">🔍</span>
                <span className="truncate">Verifikasi</span>
              </Link>
            </div>


            {/* Delete button - full width */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                showDeleteConfirm
                  ? 'text-white bg-red-600 hover:bg-red-700'
                  : 'text-red-600 bg-red-50 hover:bg-red-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-base sm:text-lg mr-2">🗑️</span>
              <span className="truncate">
                {isDeleting ? '⏳ Menghapus...' : showDeleteConfirm ? '⚠️ Klik Lagi untuk Konfirmasi Hapus' : 'Hapus Karya'}
              </span>
            </button>
          </div>
        ) : (
          // Show buy artwork button for non-owners
          <ProfileChecker artworkTitle={artwork.title} artworkId={artwork.id}>
            <button
              onClick={() => {
                // Redirect to payment page with artwork details
                const params = new URLSearchParams({
                  artworkId: artwork.id,
                  title: artwork.title,
                  price: "100000", // Default price, can be made dynamic later
                });
                router.push(`/pembayaran?${params.toString()}`);
              }}
              className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <span className="text-base sm:text-lg mr-2">💰</span>
              <span className="truncate">Beli Karya</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </ProfileChecker>
        )}
      </div>
    </div>
  )
}
