'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Artwork {
  id: string
  title: string
  description: string
  fileHash: string
  fileType: string
  fileSize: number
  createdAt: string
  status: 'pending' | 'verified' | 'disputed'
  userId: number
  certificateUrl?: string
  nftTokenId?: string
}

interface ArtworkCardProps {
  artwork: Artwork
  onUpdate: () => void
  currentUserId?: number
}

export default function ArtworkCard({ artwork, onUpdate, currentUserId }: ArtworkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Generate unique record hash by combining file hash with artwork ID
  const recordHash = `${(artwork.fileHash || '').toString()}_${(artwork.id || '').toString()}`
  
  // Check if this artwork belongs to the current user
  const isOwner = currentUserId && artwork.userId === currentUserId

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

  return (
    <div className="card-hover group relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
            {getFileIcon(artwork.fileType)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{formatFileSize(artwork.fileSize)}</span>
              <span>•</span>
              <span>{formatDate(artwork.createdAt)}</span>
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Description */}
      {artwork.description && (
        <div className="relative z-10 mb-6">
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {artwork.description}
          </p>
        </div>
      )}

      {/* Status and NFT */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(artwork.status)}`}>
          {getStatusText(artwork.status)}
        </span>
        
        {artwork.nftTokenId && (
          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-xs font-semibold">
            NFT #{artwork.nftTokenId}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="relative z-10 space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">ID Upload:</span>
          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
            {(artwork.id || "").toString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">Hash Rekaman:</span>
          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg" title={`Hash Konten: ${artwork.fileHash || ''}`}>
            {recordHash.substring(0, 8)}...{recordHash.substring(Math.max(0, recordHash.length - 8))}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          {isOwner ? (
            // Show verification and certificate buttons for owner
            <>
              <Link
                href={`/verify?hash=${encodeURIComponent(artwork.fileHash || '')}&id=${encodeURIComponent(artwork.id)}`}
                className="flex-1 text-center px-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                🔍 Verifikasi
              </Link>
              
              {artwork.status === 'verified' && (
                <button
                  onClick={downloadCertificate}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  📜 Sertifikat
                </button>
              )}
            </>
          ) : (
            // Show buy artwork button for non-owners
            <button
              onClick={() => {
                // Redirect to payment page with artwork details
                const params = new URLSearchParams({
                  artworkId: artwork.id,
                  title: artwork.title,
                  price: "100000", // Default price, can be made dynamic later
                });
                window.location.href = `/pembayaran?${params.toString()}`;
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <span className="flex items-center justify-center">
                💰 Beli Karya
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
