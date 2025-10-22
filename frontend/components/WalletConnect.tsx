"use client";

import { useState } from 'react';
import { useWeb3, contractUtils } from '@/hooks/useWeb3';

interface WalletConnectProps {
  className?: string;
}

export default function WalletConnect({ className = "" }: WalletConnectProps) {
  const { isConnected, account, connectWallet, disconnectWallet, chainId } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (isConnected && account) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Network Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            chainId === 56 ? 'bg-green-500' : 
            chainId === 97 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}></div>
          <span className="text-xs text-gray-500">
            {chainId === 56 ? 'BSC' : chainId === 97 ? 'BSC Testnet' : 'Wrong Network'}
          </span>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {contractUtils.formatAddress(account)}
          </span>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors duration-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span className="text-lg">🦊</span>
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}
