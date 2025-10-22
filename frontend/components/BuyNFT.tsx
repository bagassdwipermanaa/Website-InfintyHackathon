"use client";

import { useState } from 'react';
import { useWeb3, contractUtils } from '@/hooks/useWeb3';

interface BuyNFTProps {
  artworkId: string;
  price: string;
  title: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BuyNFT({ artworkId, price, title, onSuccess, onError }: BuyNFTProps) {
  const { isConnected, account } = useWeb3();
  const [isBuying, setIsBuying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBuy = async () => {
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

  const confirmBuy = async () => {
    setIsBuying(true);
    setShowConfirm(false);

    try {
      const marketplaceContract = contractUtils.getMarketplaceContract();
      if (!marketplaceContract) {
        throw new Error('Contract tidak tersedia');
      }

      // Convert price to Wei
      const priceInWei = contractUtils.toWei(price);

      // Call buyItem function
      const tx = await marketplaceContract.buyItem(artworkId, {
        from: account,
        value: priceInWei,
        gasLimit: 300000, // Set gas limit
      });

      // Wait for transaction confirmation
      await tx.wait();

      onSuccess?.();
      alert(`Berhasil membeli ${title}!`);
    } catch (error: any) {
      console.error('Buy NFT error:', error);
      
      let errorMessage = 'Gagal membeli NFT';
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Saldo tidak mencukupi';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaksi dibatalkan';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'NFT sudah tidak tersedia atau sudah dibeli';
      }
      
      onError?.(errorMessage);
    } finally {
      setIsBuying(false);
    }
  };

  const cancelBuy = () => {
    setShowConfirm(false);
  };

  if (!isConnected) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
      >
        Hubungkan Wallet untuk Membeli
      </button>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Konfirmasi Pembelian
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <p className="text-gray-600">ID: {artworkId}</p>
              <p className="text-lg font-bold text-purple-600">
                {price} ETH
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>• Anda akan membeli NFT ini dengan cryptocurrency</p>
              <p>• Transaksi tidak dapat dibatalkan setelah dikonfirmasi</p>
              <p>• Pastikan Anda memiliki cukup BNB untuk gas fee</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={cancelBuy}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              onClick={confirmBuy}
              disabled={isBuying}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? 'Membeli...' : 'Konfirmasi'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleBuy}
      disabled={isBuying}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isBuying ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Membeli...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <span>🛒</span>
          <span>Buy Now</span>
          <span>→</span>
        </div>
      )}
    </button>
  );
}
