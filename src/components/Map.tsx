"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPinIcon, MagnifyingGlassIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { Loader } from "@googlemaps/js-api-loader";

/**
 * Map Props
 */
interface MapProps {
  latitude: number;
  longitude: number;
  title: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

/**
 * Google Maps global type guard
 */
declare global {
  interface Window {
    google?: typeof google;
  }
}

export default function Map({
  latitude,
  longitude,
  title,
  className = "",
  onLocationSelect,
}: MapProps) {
  // Internal state (source of truth = props; we mirror them here)
  const [lat, setLat] = useState<number>(latitude);
  const [lng, setLng] = useState<number>(longitude);
  const [tempLat, setTempLat] = useState<string>(latitude.toFixed(8));
  const [tempLng, setTempLng] = useState<string>(longitude.toFixed(8));

  const [showCoordinates, setShowCoordinates] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [isLoading, setIsLoading] = useState(true);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true); // true: native Google Maps, false: iframe fallback

  // Map instances
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  /**
   * Props -> state (ONE-WAY) sync
   * - Dependency’de lat/lng YOK; sadece dışarıdan gelen props değişince günceller.
   * - Böylece kullanıcı haritada nokta seçtiğinde parent -> props geriye eski değeri yazıp "zıplatamaz".
   */
  useEffect(() => {
    setLat(latitude);
    setLng(longitude);
    setTempLat(latitude.toFixed(8));
    setTempLng(longitude.toFixed(8));

    if (map && marker && useGoogleMaps) {
      const newPosition = { lat: latitude, lng: longitude };
      map.setCenter(newPosition);
      marker.setPosition(newPosition);
    }
  }, [latitude, longitude, map, marker, useGoogleMaps]);

  /**
   * Location update helper
   */
  const updateLocation = useCallback(
    (newLat: number, newLng: number) => {
      setLat(newLat);
      setLng(newLng);
      setTempLat(newLat.toFixed(8));
      setTempLng(newLng.toFixed(8));
      onLocationSelect?.(newLat, newLng);

      if (marker) {
        marker.setPosition({ lat: newLat, lng: newLng });
      }
      if (map) {
        map.setCenter({ lat: newLat, lng: newLng });
      }
    },
    [marker, map, onLocationSelect]
  );

  /**
   * Initialize Google Map
   */
  const initializeMap = useCallback(() => {
    console.log('🗺️ initializeMap çağırıldı');
    
    // Çoklu kontrol - DOM element mevcut mu?
    if (!mapRef.current) {
      console.error('❌ mapRef.current bulunamadı - DOM henüz hazır değil');
      // Tekrar deneme mekanığı
      setTimeout(() => {
        if (mapRef.current) {
          console.log('✅ DOM hazır, tekrar deneniyor...');
          initializeMap();
        }
      }, 500);
      return;
    }
    
    // Window kontrolü
    if (typeof window === 'undefined') {
      console.error('❌ window undefined');
      return;
    }

    // Google Maps API kontrolü
    if (!window.google || !window.google.maps) {
      console.error('❌ Google Maps API yüklü değil');
      return;
    }

    // Element boyut kontrolü
    const rect = mapRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn('⚠️ Map container boyutu sıfır, tekrar deneniyor...');
      setTimeout(() => initializeMap(), 200);
      return;
    }

    console.log('🔧 Google Maps instance oluşturuluyor...');
    console.log('📊 Container boyutu:', rect.width, 'x', rect.height);
    
    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: currentZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "on" }] },
        ],
      });

      const markerInstance = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        draggable: true,
        title,
      });

      // Map click -> pick location (when interactiveMode)
      mapInstance.addListener("click", (event) => {
        if (event.latLng) {
          updateLocation(event.latLng.lat(), event.latLng.lng());
     
        }
      });

    

      // Zoom change -> update zoom state (UI info)
      mapInstance.addListener("zoom_changed", () => {
        const zoom = mapInstance.getZoom();
        if (zoom) setCurrentZoom(zoom);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setIsLoading(false);
    } catch (err) {
      console.error("Google Maps init failed:", err);
      setUseGoogleMaps(false);
      setIsLoading(false);
    }
  }, [lat, lng, title, currentZoom, interactiveMode, updateLocation]);

  /**
   * Load Google Maps API (client-only)
   */
  useEffect(() => {
    let isMounted = true; // Component mount kontrolü
    
    const loadGoogleMaps = async () => {
      try {
        // Component unmount olduysa çık
        if (!isMounted) return;
        
        // DOM element kontrolü - component mount olana kadar bekle
        if (!mapRef.current) {
          console.log('⏳ mapRef henüz hazır değil, bekleniyor...');
          return;
        }
        
        console.log('🔍 Map component başlatılıyor...');
        // Use a demo Google Maps API key for development
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyB4-UzWK7QJJyPHQHZHG6AaP_WOaS7d1Jo'; // Demo key
        console.log('🔑 API Key kontrolü:', apiKey ? '✅ Mevcut' : '❌ Bulunamadı');
        
        // Google Maps'i her durumda yüklemeye zorla
        console.log('🌐 Google Maps API yükleniyor...');
        
        // Google Maps API zaten yüklü mü kontrol et
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps API zaten yüklü');
          // Kısa bir delay ekleyelim DOM'un tamamen hazır olması için
          setTimeout(() => {
            if (isMounted) initializeMap();
          }, 100);
          return;
        }

        console.log('🔄 Google Maps API Loader başlatılıyor...');
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
          mapIds: [], // Optional
          language: 'tr', // Turkish language
          region: 'TR' // Turkey region
        });

        await loader.load();
        console.log('✅ Google Maps API başarıyla yüklendi!');
        // API yüklendikten sonra da kısa bir delay
        setTimeout(() => {
          if (isMounted) initializeMap();
        }, 100);
      } catch (error) {
        console.error('❌ Google Maps API yüklenemedi:', error);
        console.log('❌ Google Maps başarısız, iframe kullanılacak');
        // Leaflet yerine iframe kullan
        if (isMounted) {
          setUseGoogleMaps(false);
          setIsLoading(false);
        }
      }
    };

    // Component mount olduktan sonra çalıştır
    const timer = setTimeout(() => {
      if (isMounted) {
        loadGoogleMaps();
      }
    }, 100); // 100ms delay ile DOM'un hazır olmasını bekle
    
    return () => {
      isMounted = false; // Cleanup
      clearTimeout(timer);
    };
  }, []); // Empty dependency array to avoid circular dependency

  /**
   * Manual coordinate update (from panel)
   */
  const handleCoordinateUpdate = () => {
    const newLat = parseFloat(tempLat);
    const newLng = parseFloat(tempLng);
    if (!isFinite(newLat) || !isFinite(newLng)) return;

    // Clamp
    const clampedLat = Math.max(-85, Math.min(85, newLat));
    const clampedLng = Math.max(-180, Math.min(180, newLng));
    updateLocation(clampedLat, clampedLng);
  };

  /**
   * UI helpers
   */
  const getEmbedUrl = () =>
    `https://www.google.com/maps?q=${lat},${lng}&z=${currentZoom}&output=embed`;

  const getGoogleMapsUrl = () => `https://www.google.com/maps?q=${lat},${lng}&zoom=${currentZoom}`;

  const getLocationName = () => {
    if (lat >= 40.9 && lat <= 41.2 && lng >= 28.8 && lng <= 29.2) return "İstanbul çevresinde";
    if (lat >= 39.8 && lat <= 40.0 && lng >= 32.7 && lng <= 33.0) return "Ankara çevresinde";
    if (lat >= 38.3 && lat <= 38.5 && lng >= 27.0 && lng <= 27.3) return "İzmir çevresinde";
    if (lat >= 36.0 && lat <= 42.0 && lng >= 26.0 && lng <= 45.0) return "Türkiye sınırları içinde";
    return "Türkiye dışında";
  };

  const handleMapLoad = () => setIsLoading(false);

  /**
   * Render Google Maps veya iframe
   */
  const renderMap = () => {
    if (useGoogleMaps) {
      return (
        <div 
          ref={mapRef} 
          className={`w-full h-full ${interactiveMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
          style={{ 
            minHeight: '384px',
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5', // Fallback background
            borderRadius: '8px'
          }}
        />
      );
    }

    // Fallback: iframe embed
    return (
      <iframe
        ref={iframeRef}
        key={`map-${lat}-${lng}-${currentZoom}`}
        src={getEmbedUrl()}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "384px" }}
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
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
            <Typography 
              variant="small" 
              color="gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              {useGoogleMaps ? "Google Maps yükleniyor..." : "Harita yükleniyor..."}
            </Typography>
          </div>
        </div>
      )}

      {renderMap()}

      {/* Interactive overlay (iframe modunda görsel uyarı) */}
      {interactiveMode && !useGoogleMaps && (
        <div
          className="absolute inset-0 bg-blue-500/20 cursor-crosshair z-10 flex items-center justify-center"
          onClick={(e) => {
            // NOT: Iframe üzerinde click'ten koordinat türetmek güvenilir değil.
            // Fallback modunda sadece görsel amaçlı overlay bırakıyoruz.
            setInteractiveMode(false);
          }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg pointer-events-none">
            <div className="text-sm font-medium text-gray-800 text-center">Iframe modunda konum seçimi desteklenmiyor</div>
            <div className="text-xs text-gray-600 text-center mt-1">Lütfen koordinatları kutudan girin veya Google Maps native modunu kullanın.</div>
          </div>
        </div>
      )}

      {/* Info badge (top-left) */}
      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-red-600" />
          <div className="text-sm">
            <div className="font-medium text-gray-900">{getLocationName()}</div>
            <div className="text-xs text-gray-700 font-mono">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
            <div className="text-xs text-gray-600">{useGoogleMaps ? "🎯 Google Maps" : "📱 Iframe"}</div>
          </div>
        </div>
      </div>

      {/* Controls (top-right) */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button
          onClick={() => setInteractiveMode((v) => !v)}
          className={`p-2 backdrop-blur-sm rounded-lg shadow-sm transition-colors ${
            interactiveMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white/95 text-gray-700 hover:bg-white border border-gray-200"
          }`}
          title={interactiveMode ? "Hassas seçimi kapat" : "Hassas konum seçimi"}
        >
          <MapPinIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowCoordinates((v) => !v)}
          className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors border border-gray-200"
          title={showCoordinates ? "Koordinat girişini gizle" : "Koordinat girişini göster"}
        >
          <GlobeAltIcon className="w-4 h-4 text-gray-700" />
        </button>

        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors border border-gray-200"
          title="Google Maps'te aç"
        >
          <MagnifyingGlassIcon className="w-4 h-4 text-blue-700" />
        </a>
      </div>

      {/* Footer badge */}
      <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-1 rounded text-xs text-gray-700 shadow border border-gray-200">
        {useGoogleMaps ? (interactiveMode ? "🎯 Hassas Seçim Aktif" : "🗺️ Google Maps") : "📱 Iframe"}
        {" • "}Zoom: {currentZoom} • Loading: {isLoading ? "Yes" : "No"}
      </div>

      {/* Coordinate panel */}
      {showCoordinates && (
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t p-3 z-15">
          <div className="text-xs text-gray-600 mb-2 text-center">🎯 Hassas koordinat girişi (8 basamak ~1m)</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Enlem (Latitude)</label>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Boylam (Longitude)</label>
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
            📍 Konumu Güncelle
          </button>
        </div>
      )}
    </div>
  );
}
