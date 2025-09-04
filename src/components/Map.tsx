"use client";

import { useState } from "react";
import { Typography } from "@material-tailwind/react";

interface MapProps {
  latitude: number;
  longitude: number;
  title: string;
  className?: string;
}

export default function Map({
  latitude,
  longitude,
  title,
  className = "",
}: MapProps) {
  const [isLoading, setIsLoading] = useState(true);

  // OpenStreetMap embed URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <Typography 
              variant="small" 
              color="gray" 
              placeholder="" 
              onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              Harita yükleniyor...
            </Typography>
          </div>
        </div>
      )}
      
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '384px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${title} konumu`}
        onLoad={handleMapLoad}
        className="w-full h-full"
      />
      
      {/* Koordinat bilgisi */}
      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 shadow">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  );
}