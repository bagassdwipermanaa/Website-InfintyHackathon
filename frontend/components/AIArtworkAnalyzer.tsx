"use client";

import { useState } from "react";

interface AIAnalysisResult {
  originality: number;
  artisticValue: number;
  technicalQuality: number;
  marketPotential: number;
  recommendations: string[];
  riskFactors: string[];
}

export default function AIArtworkAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const analyzeArtwork = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    // Simulasi AI analysis (dalam implementasi nyata, ini akan memanggil AI service)
    setTimeout(() => {
      const mockResult: AIAnalysisResult = {
        originality: Math.floor(Math.random() * 40) + 60, // 60-100
        artisticValue: Math.floor(Math.random() * 30) + 70, // 70-100
        technicalQuality: Math.floor(Math.random() * 35) + 65, // 65-100
        marketPotential: Math.floor(Math.random() * 50) + 50, // 50-100
        recommendations: [
          "Karya menunjukkan potensi komersial yang tinggi",
          "Pertimbangkan untuk menambahkan variasi warna yang lebih kontras",
          "Metadata yang lebih detail akan meningkatkan nilai NFT",
          "Kualitas resolusi sangat baik untuk marketplace"
        ],
        riskFactors: [
          "Periksa kemungkinan duplikasi dengan karya lain",
          "Pastikan semua elemen adalah karya original"
        ]
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">🤖</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Artwork Analyzer</h3>
          <p className="text-gray-600">Analisis cerdas untuk karya seni Anda</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Karya untuk Analisis AI
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={analyzeArtwork}
          disabled={!uploadedFile || isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Menganalisis...
            </div>
          ) : (
            "Analisis dengan AI"
          )}
        </button>

        {analysisResult && (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Hasil Analisis AI</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Originalitas</span>
                  <span className="text-lg font-bold text-green-600">{analysisResult.originality}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.originality}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Nilai Artistik</span>
                  <span className="text-lg font-bold text-blue-600">{analysisResult.artisticValue}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.artisticValue}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Kualitas Teknis</span>
                  <span className="text-lg font-bold text-purple-600">{analysisResult.technicalQuality}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.technicalQuality}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Potensi Pasar</span>
                  <span className="text-lg font-bold text-orange-600">{analysisResult.marketPotential}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.marketPotential}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">💡 Rekomendasi</h5>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-green-700">• {rec}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Faktor Risiko</h5>
                <ul className="space-y-1">
                  {analysisResult.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-yellow-700">• {risk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
