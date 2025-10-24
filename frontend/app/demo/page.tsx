"use client";

import { useState } from "react";
import AIArtworkAnalyzer from "@/components/AIArtworkAnalyzer";
import BlockchainAnalytics from "@/components/BlockchainAnalytics";
import SmartContractIntegration from "@/components/SmartContractIntegration";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("ai");

  const tabs = [
    { id: "ai", label: "AI Analysis", icon: "🤖" },
    { id: "analytics", label: "Blockchain Analytics", icon: "📊" },
    { id: "contracts", label: "Smart Contracts", icon: "🔗" },
    { id: "features", label: "Key Features", icon: "✨" }
  ];

  const keyFeatures = [
    {
      title: "AI-Powered Artwork Analysis",
      description: "Teknologi AI untuk menganalisis kualitas, originalitas, dan potensi pasar karya seni",
      icon: "🤖",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Blockchain Verification",
      description: "Sistem verifikasi hash untuk memastikan keaslian karya seni digital",
      icon: "🔍",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Smart Contract Integration",
      description: "NFT marketplace dengan royalty system dan automated trading",
      icon: "⚡",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Real-time Analytics",
      description: "Dashboard analytics real-time untuk tracking transaksi dan volume",
      icon: "📈",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Multi-Wallet Support",
      description: "Dukungan multiple wallet dengan Web3 integration yang seamless",
      icon: "👛",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Gasless Minting",
      description: "Sistem minting NFT tanpa gas fee untuk user experience yang lebih baik",
      icon: "🎁",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BlockRights Demo</h1>
              <p className="text-gray-600 mt-1">Platform NFT Marketplace dengan AI & Blockchain</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Live Demo</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Try Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "ai" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Artwork Analysis</h2>
                <p className="text-gray-600">
                  Teknologi AI untuk menganalisis kualitas dan potensi karya seni digital
                </p>
              </div>
              <AIArtworkAnalyzer />
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Blockchain Analytics</h2>
                <p className="text-gray-600">
                  Dashboard real-time untuk monitoring aktivitas blockchain dan transaksi
                </p>
              </div>
              <BlockchainAnalytics />
            </div>
          )}

          {activeTab === "contracts" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Contract Integration</h2>
                <p className="text-gray-600">
                  Integrasi langsung dengan smart contracts di BSC Network
                </p>
              </div>
              <SmartContractIntegration />
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Features</h2>
                <p className="text-gray-600">
                  Fitur-fitur unik yang membuat BlockRights berbeda dari platform NFT lainnya
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <span className="text-white text-xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Siap untuk Masa Depan NFT?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Bergabunglah dengan revolusi digital art dengan teknologi blockchain dan AI terdepan. 
              Lindungi kreativitas Anda dengan sistem verifikasi yang aman dan transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Mulai Sekarang
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
