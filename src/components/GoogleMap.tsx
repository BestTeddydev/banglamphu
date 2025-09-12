'use client';

import { useEffect, useRef } from 'react';

interface MapMarker {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'attraction' | 'restaurant' | 'menu';
  price?: number;
  category?: string;
  cuisine?: string;
}

interface GoogleMapProps {
  markers: MapMarker[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ markers, center, zoom = 13 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markers.length > 0) {
      updateMarkers();
    }
  }, [markers]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultCenter = center || {
      lat: 13.7563, // Bangkok coordinates
      lng: 100.5018
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    updateMarkers();
  };

  const openGoogleMaps = (coordinates: { lat: number; lng: number }, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const mapMarker = new window.google.maps.Marker({
        position: marker.coordinates,
        map: mapInstanceRef.current,
        title: marker.name,
        icon: getMarkerIcon(marker.type)
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; min-width: 280px; max-width: 320px;">
            <!-- Image -->
            ${marker.images && marker.images.length > 0 ? `
              <div style="margin-bottom: 12px;">
                <img 
                  src="${marker.images[0]}" 
                  alt="${marker.name}"
                  style="
                    width: 100%; 
                    height: 120px; 
                    object-fit: cover; 
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                  "
                  onerror="this.src='/placeholder-restaurant.jpg'"
                />
              </div>
            ` : ''}
            
            <!-- Title -->
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937; line-height: 1.3;">
              ${marker.name}
            </h3>
            
            <!-- Type Badge -->
            <div style="margin-bottom: 10px;">
              <span style="
                background: ${getTypeColor(marker.type)}; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 12px; 
                font-size: 12px; 
                font-weight: 500;
              ">
                ${getTypeLabel(marker.type)}
              </span>
            </div>
            
            <!-- Description -->
            ${marker.description ? `
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563; line-height: 1.4;">
                ${marker.description.length > 100 ? marker.description.substring(0, 100) + '...' : marker.description}
              </p>
            ` : ''}
            
            <!-- Category -->
            ${marker.category ? `
              <div style="margin-bottom: 8px;">
                <span style="font-size: 12px; color: #6b7280; font-weight: 500;">🏷️ ${marker.category}</span>
              </div>
            ` : ''}
            
            <!-- Cuisine -->
            ${marker.cuisine ? `
              <div style="margin-bottom: 8px;">
                <span style="font-size: 12px; color: #6b7280; font-weight: 500;">🍽️ ${marker.cuisine}</span>
              </div>
            ` : ''}
            
            <!-- Price -->
            ${marker.price ? `
              <div style="margin-bottom: 12px;">
                <span style="font-size: 14px; color: #059669; font-weight: bold;">💰 ฿${marker.price.toLocaleString()}</span>
              </div>
            ` : ''}
            
            <!-- Google Maps Button -->
            <button 
              onclick="window.openGoogleMaps(${marker.coordinates.lat}, ${marker.coordinates.lng}, '${marker.name.replace(/'/g, "\\'")}')"
              style="
                background: #3b82f6; 
                color: white; 
                border: none; 
                padding: 10px 16px; 
                border-radius: 8px; 
                font-size: 14px; 
                font-weight: 500; 
                cursor: pointer; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                gap: 8px;
                width: 100%;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.background='#2563eb'"
              onmouseout="this.style.background='#3b82f6'"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              เปิดแผนที่
            </button>
          </div>
        `
      });

      mapMarker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, mapMarker);
      });

      markersRef.current.push(mapMarker);
    });

    // Fit map to show all markers
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(marker.coordinates);
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const getMarkerIcon = (type: string) => {
    const colors = {
      attraction: '#FF6B6B',
      restaurant: '#4ECDC4',
      menu: '#45B7D1'
    };

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type as keyof typeof colors] || '#FF6B6B',
      fillOpacity: 0.8,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8
    };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      attraction: 'แหล่งท่องเที่ยว',
      restaurant: 'ร้านอาหาร',
      menu: 'เมนูอาหาร'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      attraction: '#ef4444', // red-500
      restaurant: '#14b8a6', // teal-500
      menu: '#3b82f6' // blue-500
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
    </div>
  );
}
