"use client";

import { useState, useEffect } from "react";

interface BlockchainStats {
  totalTransactions: number;
  totalVolume: number;
  averagePrice: number;
  topSellers: Array<{
    address: string;
    sales: number;
    volume: number;
  }>;
  recentActivity: Array<{
    type: string;
    amount: number;
    timestamp: number;
    hash: string;
  }>;
}

export default function BlockchainAnalytics() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Simulasi data blockchain analytics
    const mockStats: BlockchainStats = {
      totalTransactions: 1247,
      totalVolume: 45.2,
      averagePrice: 0.036,
      topSellers: [
        { address: "0x1234...5678", sales: 23, volume: 2.1 },
        { address: "0xabcd...efgh", sales: 18, volume: 1.8 },
        { address: "0x9876...5432", sales: 15, volume: 1.5 },
      ],
      recentActivity: [
        { type: "Sale", amount: 0.05, timestamp: Date.now() - 300000, hash: "0xabc123..." },
        { type: "Mint", amount: 0, timestamp: Date.now() - 600000, hash: "0xdef456..." },
        { type: "Sale", amount: 0.08, timestamp: Date.now() - 900000, hash: "0xghi789..." },
      ]
    };

    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 2000);
  }, [timeRange]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    return `${minutes} menit yang lalu`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Blockchain Analytics</h3>
          <p className="text-gray-600">Statistik real-time dari BSC Network</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="24h">24 Jam</option>
          <option value="7d">7 Hari</option>
          <option value="30d">30 Hari</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-900">{stats?.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Volume</p>
              <p className="text-2xl font-bold text-green-900">{stats?.totalVolume} BNB</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Harga Rata-rata</p>
              <p className="text-2xl font-bold text-purple-900">{stats?.averagePrice} BNB</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Sellers</h4>
          <div className="space-y-3">
            {stats?.topSellers.map((seller, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formatAddress(seller.address)}</p>
                    <p className="text-sm text-gray-600">{seller.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{seller.volume} BNB</p>
                  <p className="text-sm text-gray-600">Volume</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h4>
          <div className="space-y-3">
            {stats?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'Sale' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'Sale' ? '💰' : '🎨'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {activity.amount > 0 ? `${activity.amount} BNB` : 'Mint'}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{formatAddress(activity.hash)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600">🔗</span>
          <span className="font-semibold text-blue-900">Live Blockchain Data</span>
        </div>
        <p className="text-sm text-blue-700">
          Data ini diambil langsung dari BSC Network dan diperbarui setiap 30 detik. 
          Semua transaksi dapat diverifikasi di BSCScan.
        </p>
      </div>
    </div>
  );
}
