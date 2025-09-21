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
  distanceFromPrevious?: number;
}

interface GoogleMapProps {
  markers: MapMarker[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  userLocation?: {
    lat: number;
    lng: number;
  };
  optimizedRoute?: MapMarker[];
  showRoute?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ markers, center, zoom = 13, userLocation, optimizedRoute, showRoute }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  console.log('====================================');
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  console.log('====================================');
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

      // Cleanup route
      if (routeRef.current) {
        routeRef.current.setMap(null);
        routeRef.current = null;
      }

      // Cleanup user location marker
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setMap(null);
        userLocationMarkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markers.length > 0) {
      updateMarkers();
    }
  }, [markers]);

  useEffect(() => {
    if (mapInstanceRef.current && userLocation) {
      updateUserLocation();
    }
  }, [userLocation]);

  useEffect(() => {
    if (mapInstanceRef.current && optimizedRoute && showRoute) {
      updateRoute();
    } else if (routeRef.current) {
      routeRef.current.setMap(null);
      routeRef.current = null;
    }
  }, [optimizedRoute, showRoute]);

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

    // Fit map to show all markers (including user location)
    const bounds = new window.google.maps.LatLngBounds();

    // Add user location to bounds if available
    if (userLocation) {
      bounds.extend(userLocation);
    }

    // Add all place markers to bounds
    markers.forEach(marker => {
      bounds.extend(marker.coordinates);
    });

    if (bounds.isEmpty() === false) {
      mapInstanceRef.current.fitBounds(bounds);
    }

    // Update user location if available
    if (userLocation) {
      updateUserLocation();
    }
  };

  const updateUserLocation = () => {
    if (!mapInstanceRef.current || !userLocation) return;

    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setMap(null);
    }

    // Add user location marker with person icon
    userLocationMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'ตำแหน่งของคุณ',
      icon: {
        path: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V7H3V9C3 10.1 3.9 11 5 11H7V22H9V16H15V22H17V11H19C20.1 11 21 10.1 21 9Z',
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 22)
      },
      zIndex: 1000
    });

    // Add pulsing circle around user location
    const pulsingCircle = new window.google.maps.Circle({
      strokeColor: '#4285F4',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#4285F4',
      fillOpacity: 0.1,
      map: mapInstanceRef.current,
      center: userLocation,
      radius: 200, // 200 meters
      zIndex: 999
    });

    // Add info window for user location
    const userInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
            👤 ตำแหน่งของคุณ
          </h3>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            จุดเริ่มต้นของการเดินทาง
          </p>
        </div>
      `
    });

    userLocationMarkerRef.current.addListener('click', () => {
      userInfoWindow.open(mapInstanceRef.current, userLocationMarkerRef.current);
    });
  };

  const updateRoute = () => {
    if (!mapInstanceRef.current || !optimizedRoute || optimizedRoute.length === 0) return;

    // Remove existing route
    if (routeRef.current) {
      routeRef.current.setMap(null);
    }

    // Create route path (only between places, not including user location)
    const routePath = optimizedRoute.map(place => place.coordinates);

    // Create polyline for the route with gradient effect
    routeRef.current = new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#10B981', // Green color for route
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map: mapInstanceRef.current,
      icons: [{
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          strokeColor: '#10B981',
          fillColor: '#10B981',
          fillOpacity: 1
        },
        offset: '50%',
        repeat: '200px'
      }]
    });


    // Add numbered markers for the route with different colors based on type
    optimizedRoute.forEach((place, index) => {
      const markerColor = getMarkerColor(place.type);
      const routeMarker = new window.google.maps.Marker({
        position: place.coordinates,
        map: mapInstanceRef.current,
        title: `${index + 1}. ${place.name}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
          scale: 16
        },
        label: {
          text: (index + 1).toString(),
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 'bold'
        },
        zIndex: 1001
      });

      // Add distance labels between points
      if (index > 0) {
        const previousPlace = optimizedRoute[index - 1];
        const midPoint = {
          lat: (place.coordinates.lat + previousPlace.coordinates.lat) / 2,
          lng: (place.coordinates.lng + previousPlace.coordinates.lng) / 2
        };

        const distanceLabel = new window.google.maps.Marker({
          position: midPoint,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#FFFFFF',
            fillOpacity: 0.9,
            strokeColor: '#10B981',
            strokeWeight: 2,
            scale: 8
          },
          label: {
            text: `${place.distanceFromPrevious?.toFixed(1) || '0.0'} กม.`,
            color: '#10B981',
            fontSize: '11px',
            fontWeight: 'bold'
          },
          zIndex: 1002
        });
      }

      // Add info window for route marker
      const routeInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; min-width: 300px; max-width: 350px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="
                background: ${markerColor}; 
                color: white; 
                width: 28px; 
                height: 28px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold; 
                font-size: 14px; 
                margin-right: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              ">
                ${index + 1}
              </div>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937;">
                ${place.name}
              </h3>
            </div>
            
            <div style="margin-bottom: 12px;">
              <span style="
                background: ${getTypeColor(place.type)}; 
                color: white; 
                padding: 6px 12px; 
                border-radius: 16px; 
                font-size: 12px; 
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">
                ${getTypeLabel(place.type)}
              </span>
            </div>
            
            ${place.description ? `
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
                ${place.description.length > 120 ? place.description.substring(0, 120) + '...' : place.description}
              </p>
            ` : ''}
            
            ${place.price ? `
              <div style="margin-bottom: 12px;">
                <span style="font-size: 16px; color: #059669; font-weight: bold;">
                  💰 ฿${place.price.toLocaleString()}
                </span>
              </div>
            ` : ''}
            
            ${place.distanceFromPrevious ? `
              <div style="margin-bottom: 12px; padding: 8px; background: #f3f4f6; border-radius: 8px;">
                <span style="font-size: 13px; color: #374151; font-weight: 500;">
                  📏 ระยะทางจากจุดก่อนหน้า: ${place.distanceFromPrevious.toFixed(1)} กม.
                </span>
              </div>
            ` : ''}
            
            <div style="display: flex; gap: 8px;">
              <button 
                onclick="window.openGoogleMaps(${place.coordinates.lat}, ${place.coordinates.lng}, '${place.name.replace(/'/g, "\\'")}')"
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
                  flex: 1;
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
          </div>
        `
      });

      routeMarker.addListener('click', () => {
        routeInfoWindow.open(mapInstanceRef.current, routeMarker);
      });
    });

    // Fit map to show all markers (user location + places)
    const bounds = new window.google.maps.LatLngBounds();

    // Add user location to bounds if available
    if (userLocation) {
      bounds.extend(userLocation);
    }

    // Add all place markers to bounds
    optimizedRoute.forEach(place => {
      bounds.extend(place.coordinates);
    });

    if (bounds.isEmpty() === false) {
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

  const getMarkerColor = (type: string) => {
    const colors = {
      attraction: '#ef4444', // red-500
      restaurant: '#14b8a6', // teal-500
      menu: '#3b82f6' // blue-500
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
    </div>
  );
}
