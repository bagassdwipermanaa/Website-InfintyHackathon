'use client'

import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadModalProps {
  onClose: () => void
  onSuccess: (artwork: any) => void
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    license: 'all-rights-reserved'
  })
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setError('')
      }
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.doc', '.docx'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    },
    maxSize: 100 * 1024 * 1024 // 100MB
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Pilih file terlebih dahulu')
      return
    }

    if (!formData.title.trim()) {
      setError('Judul karya harus diisi')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      formDataToSend.append('file', file)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('tags', formData.tags)
      formDataToSend.append('license', formData.license)

      const response = await fetch('/api/artworks/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        const data = await response.json()
        onSuccess(data.artwork)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Gagal mengupload karya')
      }
    } catch (error) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Karya Baru</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Karya *
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                {file ? (
                  <div className="space-y-2">
                    <div className="text-4xl">{getFileIcon(file.type)}</div>
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <div className="text-lg font-medium text-gray-900">
                      {isDragActive ? 'Lepaskan file di sini' : 'Drag & drop file atau klik untuk memilih'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Mendukung: Gambar, Audio, Video, PDF, Dokumen (Max 100MB)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul Karya *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Masukkan judul karya Anda"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="input-field"
                placeholder="Jelaskan karya Anda secara detail..."
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Pilih kategori</option>
                <option value="art">Seni Visual</option>
                <option value="music">Musik</option>
                <option value="video">Video</option>
                <option value="writing">Tulisan</option>
                <option value="photography">Fotografi</option>
                <option value="design">Desain</option>
                <option value="code">Kode Program</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (pisahkan dengan koma)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field"
                placeholder="contoh: digital art, abstract, modern"
              />
            </div>

            {/* License */}
            <div>
              <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
                Lisensi
              </label>
              <select
                id="license"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="all-rights-reserved">All Rights Reserved</option>
                <option value="creative-commons">Creative Commons</option>
                <option value="public-domain">Public Domain</option>
                <option value="commercial-use">Commercial Use Allowed</option>
              </select>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Mengupload...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={isUploading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUploading || !file || !formData.title.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Mengupload...' : 'Upload & Daftarkan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
