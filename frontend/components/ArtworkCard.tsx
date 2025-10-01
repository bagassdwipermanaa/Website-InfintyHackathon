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
  certificateUrl?: string
  nftTokenId?: string
}

interface ArtworkCardProps {
  artwork: Artwork
  onUpdate: () => void
}

export default function ArtworkCard({ artwork, onUpdate }: ArtworkCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.startsWith('video/')) return '🎬'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('text')) return '📝'
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
    <div className="card hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getFileIcon(artwork.fileType)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(artwork.fileSize)} • {formatDate(artwork.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={copyHash}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Salin Hash
                </button>
                {artwork.certificateUrl && (
                  <button
                    onClick={downloadCertificate}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Download Sertifikat
                  </button>
                )}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {artwork.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {artwork.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(artwork.status)}`}>
          {getStatusText(artwork.status)}
        </span>
        
        {artwork.nftTokenId && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            NFT #{artwork.nftTokenId}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Hash:</span>
          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {artwork.fileHash.substring(0, 8)}...{artwork.fileHash.substring(artwork.fileHash.length - 8)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">ID:</span>
          <span className="font-mono text-xs text-gray-700">
            {artwork.id.substring(0, 8)}...
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Link
            href={`/verify?hash=${artwork.fileHash}`}
            className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
          >
            Verifikasi
          </Link>
          
          {artwork.status === 'verified' && (
            <button
              onClick={downloadCertificate}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
            >
              Sertifikat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
