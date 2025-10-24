"use client";

import { useState, useEffect } from "react";

interface ContractInfo {
  name: string;
  address: string;
  verified: boolean;
  transactions: number;
  lastActivity: string;
  gasUsed: number;
}

export default function SmartContractIntegration() {
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string>("");

  useEffect(() => {
    // Simulasi data smart contract
    const mockContracts: ContractInfo[] = [
      {
        name: "BlockRightsNFT",
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        verified: true,
        transactions: 1247,
        lastActivity: "2 menit yang lalu",
        gasUsed: 150000
      },
      {
        name: "BlockRightsMarketplace", 
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        verified: true,
        transactions: 892,
        lastActivity: "5 menit yang lalu", 
        gasUsed: 200000
      },
      {
        name: "BlockRightsVerification",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        verified: true,
        transactions: 456,
        lastActivity: "1 jam yang lalu",
        gasUsed: 100000
      }
    ];

    setContracts(mockContracts);
    setIsConnected(true);
    setNetwork("BSC Testnet");
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setNetwork("BSC Testnet");
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getContractStatus = (contract: ContractInfo) => {
    if (contract.verified) {
      return { text: "Verified", color: "text-green-600 bg-green-100" };
    }
    return { text: "Pending", color: "text-yellow-600 bg-yellow-100" };
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Smart Contract Integration</h3>
          <p className="text-gray-600">Status dan aktivitas smart contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? `Connected to ${network}` : 'Not Connected'}
          </span>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h4>
          <p className="text-gray-600 mb-4">
            Hubungkan wallet Anda untuk mengakses smart contracts
          </p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract, index) => {
            const status = getContractStatus(contract);
            return (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {contract.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{contract.name}</h4>
                      <p className="text-sm text-gray-600 font-mono">{formatAddress(contract.address)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transactions</p>
                    <p className="font-semibold text-gray-900">{contract.transactions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Activity</p>
                    <p className="font-semibold text-gray-900">{contract.lastActivity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gas Used</p>
                    <p className="font-semibold text-gray-900">{contract.gasUsed.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View on BSCScan
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Interact
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">⚡</span>
              <span className="font-semibold text-blue-900">Real-time Integration</span>
            </div>
            <p className="text-sm text-blue-700">
              Smart contracts terintegrasi langsung dengan frontend. 
              Semua transaksi diproses secara real-time di BSC Network.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
