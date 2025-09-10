"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPinIcon, MagnifyingGlassIcon, GlobeAltIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  latitude: number;
  longitude: number;
  title: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function Map({
  latitude,
  longitude,
  title,
  className = "",
  onLocationSelect,
}: MapProps) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [tempLat, setTempLat] = useState(lat.toFixed(8));
  const [tempLng, setTempLng] = useState(lng.toFixed(8));
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Google Maps API'yi yükle
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        console.log('🔍 Map component başlatılıyor...');
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        console.log('🔑 API Key kontrolü:', apiKey ? '✅ Mevcut' : '❌ Bulunamadı');
        
        if (!apiKey) {
          console.log('🗺️ Google Maps API key bulunamadı, iframe kullanılacak');
          setUseGoogleMaps(false);
          setIsLoading(false);
          return;
        }

        // Client-side kontrolü
        if (typeof window === 'undefined') {
          console.log('💻 Server-side, iframe kullanılacak');
          setUseGoogleMaps(false);
          setIsLoading(false);
          return;
        }

        console.log('🌐 Client-side, Google Maps API yükleniyor...');
        
        // Google Maps API zaten yüklü mü kontrol et
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps API zaten yüklü');
          initializeMap();
          return;
        }

        console.log('🔄 Google Maps API Loader başlatılıyor...');
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        console.log('✅ Google Maps API başarıyla yüklendi!');
        initializeMap();
      } catch (error) {
        console.error('❌ Google Maps API yüklenemedi:', error);
        setUseGoogleMaps(false);
        setIsLoading(false);
      }
    };

    // Client-side'da çalıştır
    if (typeof window !== 'undefined') {
      loadGoogleMaps();
    } else {
      // Server-side rendering sırasında iframe kullan
      console.log('💻 SSR: iframe kullanılacak');
      setUseGoogleMaps(false);
      setIsLoading(false);
    }
  }, []);

  // Google Maps'i başlat
  const initializeMap = () => {
    console.log('🗺️ initializeMap çağırıldı');
    
    if (!mapRef.current) {
      console.error('❌ mapRef.current bulunamadı');
      return;
    }
    
    if (typeof window === 'undefined') {
      console.error('❌ window undefined');
      return;
    }

    console.log('🔧 Google Maps instance oluşturuluyor...');
    
    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: currentZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: true,
        zoomControl: false, // Kendi zoom kontrolümüzü kullanacağız
      });
      
      console.log('✅ Map instance oluşturuldu');

      // Marker ekle
      const markerInstance = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        draggable: true,
        title: title
      });
      
      console.log('✅ Marker eklendi');

      // Tıklama event'i
      mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        console.log('🔄 Harita tıklama eventi:', event.latLng?.toString());
        if (interactiveMode && event.latLng) {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          console.log('🎯 Yeni konum seçildi:', newLat, newLng);
          updateLocation(newLat, newLng);
          setInteractiveMode(false);
        }
      });

      // Marker sürükleme event'i
      markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        console.log('🔄 Marker sürükle eventi:', event.latLng?.toString());
        if (event.latLng) {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          console.log('🎯 Marker yeni pozisyon:', newLat, newLng);
          updateLocation(newLat, newLng);
        }
      });

      // Zoom değişikliği eventi
      mapInstance.addListener('zoom_changed', () => {
        const zoom = mapInstance.getZoom();
        if (zoom) {
          console.log('🔍 Zoom değişti:', zoom);
          setCurrentZoom(zoom);
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setIsLoading(false);
      
      console.log('✅ Google Maps başarıyla başlatıldı!');
    } catch (error) {
      console.error('❌ Google Maps başlatılamadı:', error);
      setUseGoogleMaps(false);
      setIsLoading(false);
    }
  };

  // Konum güncelleme fonksiyonu
  const updateLocation = (newLat: number, newLng: number) => {
    console.log('📍 updateLocation çağırıldı:', newLat, newLng);
    setLat(newLat);
    setLng(newLng);
    setTempLat(newLat.toFixed(8));
    setTempLng(newLng.toFixed(8));
    onLocationSelect?.(newLat, newLng);

    // Marker'ı güncelle
    if (marker) {
      marker.setPosition({ lat: newLat, lng: newLng });
      console.log('✅ Marker pozisyonu güncellendi');
    }
  };

  // Props değiştiğinde haritayı güncelle
  useEffect(() => {
    if (latitude !== lat || longitude !== lng) {
      setLat(latitude);
      setLng(longitude);
      setTempLat(latitude.toFixed(8));
      setTempLng(longitude.toFixed(8));

      // Google Maps'i güncelle
      if (map && marker && useGoogleMaps) {
        const newPosition = { lat: latitude, lng: longitude };
        map.setCenter(newPosition);
        marker.setPosition(newPosition);
      }
    }
  }, [latitude, longitude, map, marker, useGoogleMaps]);

  // Zoom fonksiyonları
  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, 20);
    setCurrentZoom(newZoom);
    if (map && useGoogleMaps) {
      map.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, 1);
    setCurrentZoom(newZoom);
    if (map && useGoogleMaps) {
      map.setZoom(newZoom);
    }
  };

  // Koordinatları güncelle
  const handleCoordinateUpdate = () => {
    const newLat = parseFloat(tempLat);
    const newLng = parseFloat(tempLng);
    
    if (isFinite(newLat) && isFinite(newLng)) {
      // Sınırları kontrol et
      const clampedLat = Math.max(-85, Math.min(85, newLat));
      const clampedLng = Math.max(-180, Math.min(180, newLng));
      
      updateLocation(clampedLat, clampedLng);
      
      // Haritayı yeni konuma odakla
      if (map && useGoogleMaps) {
        map.setCenter({ lat: clampedLat, lng: clampedLng });
      }
    }
  };

  // Google Maps Embed URL (fallback için)
  const getEmbedUrl = () => {
    const zoomParam = currentZoom;
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${12000 / Math.pow(2, zoomParam - 13)}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${zoomParam}!5e0!3m2!1str!2str!4v1609876543210!5m2!1str!2str&q=${lat},${lng}`;
  };

  // Google Maps link
  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps?q=${lat},${lng}&zoom=${currentZoom}`;
  };

  // Konum adı alma
  const getLocationName = () => {
    if (lat >= 40.9 && lat <= 41.2 && lng >= 28.8 && lng <= 29.2) {
      return "İstanbul çevresinde";
    } else if (lat >= 39.8 && lat <= 40.0 && lng >= 32.7 && lng <= 33.0) {
      return "Ankara çevresinde";
    } else if (lat >= 38.3 && lat <= 38.5 && lng >= 27.0 && lng <= 27.3) {
      return "İzmir çevresinde";
    } else if (lat >= 36.0 && lat <= 42.0 && lng >= 26.0 && lng <= 45.0) {
      return "Türkiye sınırları içinde";
    } else {
      return "Türkiye dışında";
    }
  };

  // Loading state
  const handleMapLoad = () => {
    setIsLoading(false);
  };

  // Render Google Maps veya iframe
  const renderMap = () => {
    if (useGoogleMaps) {
      return (
        <div 
          ref={mapRef} 
          className={`w-full h-full ${interactiveMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
          style={{ minHeight: '384px' }}
        />
      );
    }

    // Fallback iframe
    return (
      <iframe
        ref={iframeRef}
        key={`map-${lat}-${lng}-${currentZoom}`}
        src={getEmbedUrl()}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '384px' }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${title} konumu - Zoom: ${currentZoom}`}
        onLoad={handleMapLoad}
        className="w-full h-full"
      />
    );
  };

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
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
              {useGoogleMaps ? 'Google Maps yükleniyor...' : 'Harita yükleniyor...'}
            </Typography>
          </div>
        </div>
      )}
      
      {renderMap()}
      
      {/* Interactive mode overlay (iframe için de çalışacak) */}
      {interactiveMode && (
        <div 
          className="absolute inset-0 bg-blue-500/20 cursor-crosshair z-10 flex items-center justify-center"
          onClick={(e) => {
            if (!useGoogleMaps) {
              // İframe modu için basit koordinat hesaplama
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const width = rect.width;
              const height = rect.height;
              
              // Basit koordinat hesaplama (yaklaşık)
              const latRange = 0.01; // ±0.01 derece yaklaşık 1km
              const lngRange = 0.01;
              
              const newLat = lat + ((height / 2 - y) / height) * latRange;
              const newLng = lng + ((x - width / 2) / width) * lngRange;
              
              console.log('📍 İframe modunda koordinat seçildi:', newLat, newLng);
              updateLocation(newLat, newLng);
              setInteractiveMode(false);
            }
          }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg pointer-events-none">
            <div className="text-sm font-medium text-gray-800 text-center">
              {useGoogleMaps ? "⚠️ Google Maps modu" : "🎯 Iframe modunda konum seç"}
            </div>
            <div className="text-xs text-gray-600 text-center mt-1">
              {useGoogleMaps ? "Google Maps API için API key gerekiyor" : "Haritaya tıklayarak yaklaşık konum seçebilirsiniz"}
            </div>
          </div>
        </div>
      )}
      
      {/* Konum overlay */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-red-500" />
          <div className="text-sm">
            <div className="font-medium text-gray-800">{getLocationName()}</div>
            <div className="text-xs text-gray-600 font-mono">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
            <div className="text-xs text-gray-500">
              {useGoogleMaps ? '🎯 Gerçek Google Maps' : '📱 İframe Modu'}
            </div>
          </div>
        </div>
      </div>

      {/* Kontrol butonları */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button
          onClick={() => {
            console.log('📍 MapPin butonu tıklandı, şuan:', interactiveMode, 'useGoogleMaps:', useGoogleMaps);
            setInteractiveMode(!interactiveMode);
          }}
          className={`p-2 backdrop-blur-sm rounded-lg shadow-sm transition-colors ${
            interactiveMode 
              ? "bg-blue-500 text-white hover:bg-blue-600" 
              : "bg-white/90 text-gray-600 hover:bg-white"
          }`}
          title={useGoogleMaps ? (interactiveMode ? "Hassas seçimi iptal et" : "Hassas konum seçimi") : (interactiveMode ? "Yaklaşık seçimi iptal et" : "Yaklaşık konum seçimi")}
        >
          <MapPinIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setShowCoordinates(!showCoordinates)}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
          title={showCoordinates ? "Koordinat girişini gizle" : "Koordinat girişini göster"}
        >
          <GlobeAltIcon className="w-4 h-4 text-gray-600" />
        </button>
        
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
          title="Google Maps'te aç"
        >
          <MagnifyingGlassIcon className="w-4 h-4 text-blue-600" />
        </a>
      </div>
      
      {/* Zoom kontrolleri */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          disabled={currentZoom >= 20}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded shadow-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Yakınlaştır"
        >
          <PlusIcon className="w-3 h-3 text-gray-700" />
        </button>
        
        <div className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded shadow-sm text-xs text-center font-medium text-gray-700 min-w-[28px]">
          {currentZoom}
        </div>
        
        <button
          onClick={handleZoomOut}
          disabled={currentZoom <= 1}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded shadow-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Uzaklaştır"
        >
          <MinusIcon className="w-3 h-3 text-gray-700" />
        </button>
      </div>
      
      {/* Alt bilgi */}
      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 shadow">
        {useGoogleMaps ? (
          interactiveMode ? "🎯 Hassas Seçim Aktif" : "🗺️ Google Maps API"
        ) : (
          "📱 İframe Modu"
        )} • Zoom: {currentZoom}
      </div>
      
      {/* Koordinat giriş paneli */}
      {showCoordinates && (
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t p-3 z-15">
          <div className="text-xs text-gray-600 mb-2 text-center">
            🎯 Hassas koordinat girişi (8 basamak hassasiyet ~1.1m)
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Enlem (Latitude)
              </label>
              <input
                type="number"
                step="0.00000001"
                value={tempLat}
                onChange={(e) => setTempLat(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="41.00820000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Boylam (Longitude)
              </label>
              <input
                type="number"
                step="0.00000001"
                value={tempLng}
                onChange={(e) => setTempLng(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="28.97840000"
              />
            </div>
          </div>
          
          <button
            onClick={handleCoordinateUpdate}
            className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            📍 Hassas Konumu Güncelle
          </button>
        </div>
      )}
    </div>
  );
}