"use client";

import { useState } from 'react';
import { useWeb3, contractUtils } from '@/hooks/useWeb3';

interface MintNFTProps {
  artworkData: {
    title: string;
    description: string;
    artist: string;
    fileHash: string;
    fileType: string;
    fileSize: number;
  };
  onSuccess?: (tokenId: string) => void;
  onError?: (error: string) => void;
}

export default function MintNFT({ artworkData, onSuccess, onError }: MintNFTProps) {
  const { isConnected, account } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleMint = async () => {
    if (!isConnected) {
      onError?.('Silakan hubungkan wallet terlebih dahulu');
      return;
    }

    if (!account) {
      onError?.('Wallet tidak terhubung');
      return;
    }

    setShowConfirm(true);
  };

  const confirmMint = async () => {
    setIsMinting(true);
    setShowConfirm(false);

    try {
      const nftContract = contractUtils.getNFTContract();
      if (!nftContract) {
        throw new Error('Contract tidak tersedia');
      }

      // Prepare metadata
      const metadata = {
        title: artworkData.title,
        description: artworkData.description,
        artist: artworkData.artist,
        fileHash: artworkData.fileHash,
        fileType: artworkData.fileType,
        fileSize: artworkData.fileSize,
        createdAt: Math.floor(Date.now() / 1000),
        isVerified: false,
        isForSale: false,
        price: 0
      };

      // Set royalty (5% = 500 basis points)
      const royalty = 500;

      // Call mintArtwork function
      const tx = await nftContract.mintArtwork(account, metadata, royalty, {
        from: account,
        gasLimit: 500000, // Set gas limit
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Get token ID from event
      const mintEvent = receipt.events?.find((e: any) => e.event === 'ArtworkMinted');
      const tokenId = mintEvent?.args?.tokenId?.toString();

      onSuccess?.(tokenId);
      alert(`Berhasil membuat NFT! Token ID: ${tokenId}`);
    } catch (error: any) {
      console.error('Mint NFT error:', error);
      
      let errorMessage = 'Gagal membuat NFT';
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Saldo tidak mencukupi untuk gas fee';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaksi dibatalkan';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'Gagal membuat NFT. Periksa data yang dimasukkan';
      }
      
      onError?.(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  const cancelMint = () => {
    setShowConfirm(false);
  };

  if (!isConnected) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
      >
        Hubungkan Wallet untuk Mint NFT
      </button>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Konfirmasi Mint NFT
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{artworkData.title}</h4>
              <p className="text-gray-600">{artworkData.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Artist: {artworkData.artist}</p>
                <p>File Type: {artworkData.fileType}</p>
                <p>File Size: {(artworkData.fileSize / 1024).toFixed(2)} KB</p>
                <p>Hash: {artworkData.fileHash.slice(0, 10)}...</p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>• NFT akan dibuat di blockchain</p>
              <p>• Anda akan menjadi pemilik NFT</p>
              <p>• Royalty 5% akan diberikan kepada Anda</p>
              <p>• Pastikan Anda memiliki cukup BNB untuk gas fee</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={cancelMint}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              onClick={confirmMint}
              disabled={isMinting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? 'Minting...' : 'Konfirmasi Mint'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleMint}
      disabled={isMinting}
      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isMinting ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Minting NFT...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <span>🎨</span>
          <span>Mint NFT</span>
          <span>→</span>
        </div>
      )}
    </button>
  );
}
