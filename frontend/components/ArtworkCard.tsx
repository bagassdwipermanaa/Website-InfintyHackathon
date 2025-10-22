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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Artwork Image/Preview */}
      <div className="relative aspect-square overflow-hidden">
        <div 
          className="w-full h-full flex items-center justify-center text-6xl"
          style={{ background: getImagePreview() }}
        >
          {getFileIcon(artwork.fileType)}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button className="bg-white/20 backdrop-blur-lg text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="bg-white/20 backdrop-blur-lg text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(artwork.status)}`}>
            {getStatusText(artwork.status)}
          </span>
        </div>

        {/* Menu Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white/20 backdrop-blur-lg text-white p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 z-20">
              <div className="py-2">
                <button
                  onClick={copyHash}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  📋 Salin Hash
                </button>
                {artwork.certificateUrl && (
                  <button
                    onClick={downloadCertificate}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    📄 Download Sertifikat
                  </button>
                )}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  👁️ Lihat Detail
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
            {artwork.title}
          </h3>
          {artwork.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {artwork.description}
            </p>
          )}
        </div>

        {/* Price and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">0.1 ETH</div>
            <div className="text-sm text-gray-500">$250</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">File Size</div>
            <div className="font-semibold text-gray-900">{formatFileSize(artwork.fileSize)}</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">ID:</span>
            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {(artwork.id || "").toString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Hash:</span>
            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded truncate max-w-24" title={`Hash: ${artwork.fileHash || ''}`}>
              {recordHash.substring(0, 6)}...{recordHash.substring(Math.max(0, recordHash.length - 4))}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOwner ? (
            // Show owner actions
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  // TODO: Navigate to edit page
                  console.log('Edit artwork:', artwork.id)
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              
              <Link
                href={`/verify?hash=${encodeURIComponent(artwork.fileHash || '')}&id=${encodeURIComponent(artwork.id)}`}
                className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify
              </Link>
            </div>
          ) : (
            // Show buy button for non-owners
            <ProfileChecker artworkTitle={artwork.title} artworkId={artwork.id}>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    artworkId: artwork.id,
                    title: artwork.title,
                    price: "100000",
                  });
                  router.push(`/pembayaran?${params.toString()}`);
                }}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Buy Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </ProfileChecker>
          )}

          {/* Owner delete button */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                showDeleteConfirm
                  ? 'text-white bg-red-600 hover:bg-red-700'
                  : 'text-red-600 bg-red-50 hover:bg-red-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : showDeleteConfirm ? 'Click to Confirm Delete' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
