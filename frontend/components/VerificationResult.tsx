"use client";

interface VerificationData {
  isValid: boolean;
  artwork?: {
    id: string;
    title: string;
    description: string;
    creator: {
      name: string;
      walletAddress?: string;
    };
    fileHash: string;
    createdAt: string;
    status: string;
    certificateUrl?: string;
    nftTokenId?: string;
  };
  error?: string;
}

interface VerificationResultProps {
  data: VerificationData;
}

export default function VerificationResult({ data }: VerificationResultProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Terverifikasi";
      case "pending":
        return "Menunggu Verifikasi";
      case "disputed":
        return "Dalam Sengketa";
      default:
        return "Unknown";
    }
  };

  const copyHash = () => {
    if (data.artwork) {
      navigator.clipboard.writeText(data.artwork.fileHash);
      // You could add a toast notification here
    }
  };

  const downloadCertificate = () => {
    if (data.artwork?.certificateUrl) {
      // Untuk demo, kita akan generate PDF sederhana
      const certificateData = {
        title: data.artwork.title,
        creator: data.artwork.creator.name,
        hash: data.artwork.fileHash,
        date: formatDate(data.artwork.createdAt),
        id: data.artwork.id,
      };

      // Generate PDF content (simplified)
      const pdfContent = `
        CERTIFICATE OF OWNERSHIP
        BlockRights Digital Copyright Platform
        
        Title: ${certificateData.title}
        Creator: ${certificateData.creator}
        File Hash: ${certificateData.hash}
        Registration Date: ${certificateData.date}
        Certificate ID: ${certificateData.id}
        
        This certificate verifies the ownership of the above digital work
        registered on the BlockRights blockchain platform.
        
        Generated on: ${new Date().toLocaleDateString("id-ID")}
      `;

      // Create and download file
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${data.artwork.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!data.isValid || !data.artwork) {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Karya Tidak Ditemukan
          </h3>
          <p className="text-red-600">
            Hash atau file yang Anda berikan tidak terdaftar dalam sistem
            BlockRights. Karya mungkin belum didaftarkan atau hash yang
            dimasukkan salah.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="card border-green-200 bg-green-50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800">
              Karya Terverifikasi!
            </h3>
            <p className="text-green-600">
              Karya ini terdaftar dalam sistem BlockRights
            </p>
          </div>
        </div>
      </div>

      {/* Artwork Details */}
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {data.artwork.title}
            </h2>
            {data.artwork.description && (
              <p className="text-gray-600">{data.artwork.description}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              data.artwork.status
            )}`}
          >
            {getStatusText(data.artwork.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Creator Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informasi Kreator
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Nama Kreator
                </label>
                <p className="text-gray-900 font-medium">
                  {data.artwork.creator.name}
                </p>
              </div>
              {data.artwork.creator.walletAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Wallet Address
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {data.artwork.creator.walletAddress.substring(0, 10)}...
                    {data.artwork.creator.walletAddress.substring(
                      data.artwork.creator.walletAddress.length - 8
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informasi Teknis
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Tanggal Pendaftaran
                </label>
                <p className="text-gray-900">
                  {formatDate(data.artwork.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  File Hash
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                    {data.artwork.fileHash.substring(0, 16)}...
                    {data.artwork.fileHash.substring(
                      data.artwork.fileHash.length - 16
                    )}
                  </p>
                  <button
                    onClick={copyHash}
                    className="text-blue-600 hover:text-blue-800 transition duration-200"
                    title="Salin hash lengkap"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  ID Karya
                </label>
                <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {data.artwork.id}
                </p>
              </div>
              {data.artwork.nftTokenId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    NFT Token ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-purple-100 px-2 py-1 rounded">
                    #{data.artwork.nftTokenId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadCertificate}
              className="flex-1 btn-primary"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Sertifikat
            </button>

            <button
              onClick={() => {
                // Untuk demo, kita akan buka Etherscan dengan hash sebagai parameter
                const etherscanUrl = `https://etherscan.io/search?q=${data.artwork.fileHash}`;
                window.open(etherscanUrl, "_blank");
              }}
              className="flex-1 btn-secondary"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Lihat di Blockchain
            </button>
          </div>
        </div>
      </div>

      {/* Blockchain Proof */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bukti Blockchain
          </h3>
          <p className="text-gray-600 mb-4">
            Kepemilikan karya ini telah diverifikasi dan tercatat secara
            permanen di blockchain Ethereum. Data tidak dapat diubah atau
            dipalsukan.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>✓ Immutable Record</span>
            <span>✓ Timestamp Verified</span>
            <span>✓ Creator Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
