import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet marker icon fix (Next.js ile problem çözümü)
// Basit ve güvenilir marker icon oluştur
const getDefaultIcon = () => {
  // SVG-based marker icon oluştur
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" 
            fill="#e91e63" stroke="#fff" stroke-width="2"/>
      <circle cx="12.5" cy="12.5" r="4" fill="#fff"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
};

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  title?: string;
}

export default function LeafletMap({
  latitude,
  longitude,
  zoom,
  onLocationSelect,
  interactive = false,
  title = "Konum"
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    console.log('🍃 Leaflet haritası başlatılıyor...');

    try {
      // Haritayı oluştur
      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      });

      // OpenStreetMap tile layer ekle
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Marker ekle
      const marker = L.marker([latitude, longitude], {
        icon: getDefaultIcon(),
        draggable: true,
        title: title
      }).addTo(map);

      // Popup ekle
      marker.bindPopup(`<strong>${title}</strong><br>Enlem: ${latitude.toFixed(6)}<br>Boylam: ${longitude.toFixed(6)}`);

      // Harita tıklama eventi
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (interactive && onLocationSelect) {
          const { lat, lng } = e.latlng;
          console.log('🍃 Leaflet harita tıklandı:', lat, lng);
          onLocationSelect(lat, lng);
          
          // Marker'ı yeni konuma taşı
          marker.setLatLng([lat, lng]);
          marker.setPopupContent(`<strong>${title}</strong><br>Enlem: ${lat.toFixed(6)}<br>Boylam: ${lng.toFixed(6)}`);
        }
      });

      // Marker sürükleme eventi
      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        console.log('🍃 Leaflet marker sürüklendi:', lat, lng);
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
          marker.setPopupContent(`<strong>${title}</strong><br>Enlem: ${lat.toFixed(6)}<br>Boylam: ${lng.toFixed(6)}`);
        }
      });

      // Zoom değişikliği eventi
      map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        console.log('🍃 Leaflet zoom değişti:', currentZoom);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsLoading(false);

      console.log('✅ Leaflet haritası başarıyla başlatıldı!');

    } catch (error) {
      console.error('❌ Leaflet haritası başlatılamadı:', error);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Leaflet haritası temizleniyor...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // Sadece mount sırasında çalışsın

  // Props değiştiğinde haritayı güncelle
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      // Merkezi güncelle
      map.setView([latitude, longitude], zoom);
      
      // Marker konumunu güncelle
      marker.setLatLng([latitude, longitude]);
      marker.setPopupContent(`<strong>${title}</strong><br>Enlem: ${latitude.toFixed(6)}<br>Boylam: ${longitude.toFixed(6)}`);
      
      console.log('🍃 Leaflet haritası güncellendi:', latitude, longitude, zoom);
    }
  }, [latitude, longitude, zoom, title]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">🍃 Leaflet Maps yükleniyor...</div>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className={`w-full h-full ${interactive ? 'cursor-crosshair' : 'cursor-pointer'}`}
        style={{ 
          minHeight: '384px', 
          zIndex: 1,
          backgroundColor: '#e5e7eb' // Fallback background
        }}
      />
      
      {/* Debug overlay */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-[1001]">
        🍃 Leaflet Debug: {isLoading ? 'Loading...' : 'Ready'}
      </div>
      
      {interactive && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm z-[1000]">
          🍃 Hassas konum seçimi aktif - Haritaya tıklayın!
        </div>
      )}
    </div>
  );
}