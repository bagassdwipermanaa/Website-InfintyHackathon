"use client";

import { useState } from "react";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      <div className="relative">
        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg px-4 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm text-gray-700 font-medium">
            Butuh bantuan?
          </span>
          <div className="absolute bottom-0 right-4 w-2 h-2 bg-white transform rotate-45 -mb-1"></div>
        </div>

        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">B</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      BlockRights Support
                    </h3>
                    <p className="text-xs text-white/80">Online sekarang</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 h-64 overflow-y-auto space-y-4">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">B</span>
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                  <p className="text-sm text-gray-700">
                    Halo! Ada yang bisa saya bantu?
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 justify-end">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-3 py-2 max-w-xs">
                  <p className="text-sm text-white">
                    Saya ingin tahu cara menggunakan platform ini
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">B</span>
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                  <p className="text-sm text-gray-700">
                    Tentu! Anda bisa mulai dengan mendaftar dan mengupload karya
                    pertama Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
