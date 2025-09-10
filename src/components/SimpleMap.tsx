"use client";

import React from 'react';

interface SimpleMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

export default function SimpleMap({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  height = "h-64",
  className = ""
}: SimpleMapProps) {
  
  const openInNewTab = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openOSMInNewTab = () => {
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
    window.open(url, '_blank');
  };

  return (
    <div className={`${height} ${className} rounded-lg border border-gray-300 overflow-hidden relative bg-gradient-to-br from-blue-50 to-green-50`}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        {/* Harita ikonu */}
        <div className="text-6xl mb-4">🗺️</div>
        
        {/* Koordinat bilgisi */}
        <div className="text-center mb-6">
          <div className="text-lg font-medium text-gray-800 mb-2">Mevcut Konum</div>
          <div className="text-sm text-gray-600 mb-1">
            Enlem: <span className="font-mono">{latitude.toFixed(6)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Boylam: <span className="font-mono">{longitude.toFixed(6)}</span>
          </div>
        </div>

        {/* Harita açma butonları */}
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={openInNewTab}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🌍</span>
            Google Maps'te Aç
          </button>
          
          <button
            onClick={openOSMInNewTab}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🗺️</span>
            OpenStreetMap'te Aç
          </button>
        </div>

        {/* Bilgi metni */}
        <div className="text-xs text-gray-500 text-center mt-4 max-w-sm">
          Haritalarda konumunuzu kontrol edin ve gerekirse yukarıdaki koordinat alanlarından manuel olarak düzenleyin.
        </div>
      </div>
    </div>
  );
}
