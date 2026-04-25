import React, { useEffect, useRef } from 'react';


interface Listing {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  quantity: string;
  source: string;
  category?: string;
  urgency_score?: number;
}

interface ListingMapProps {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (listing: Listing) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export const ListingMap: React.FC<ListingMapProps> = ({ 
  listings, 
  center = [12.3396, 76.6201], // VVCE Mysuru
  zoom = 15,
  onMarkerClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  // Mock nearby hotspots as "nodes"
  const hotspots = [
    { name: "King's Coffee", lat: 12.3382695, lng: 76.6019036, type: 'Cafe' },
    { name: "McDonald's", lat: 12.3260602, lng: 76.6127107, type: 'Fast Food' },
    { name: "Reliance Smart", lat: 12.3213642, lng: 76.618342, type: 'Grocery' },
    { name: 'Empire Restaurant', lat: 12.3346565, lng: 76.5619397, type: 'Restaurant' },
    { name: 'Loyal World Market', lat: 12.3232936, lng: 76.6278392, type: 'Grocery' },
    { name: 'VVCE College', lat: 12.3396, lng: 76.6201, type: 'Landmark' },
  ];
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const initMap = () => {
      if (!window.L || !mapRef.current) return;

      // Initialize map
      mapInstance.current = window.L.map(mapRef.current).setView(center, zoom);

      // Modern Light Tile Layer
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap © CARTO'
      }).addTo(mapInstance.current);

      // Custom Icon for Listings (Enlarged)
      const listingIcon = window.L.divIcon({
        className: 'custom-listing-marker',
        html: `<div style="background: #4F633D; width: 22px; height: 22px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(79, 99, 61, 0.6); transition: transform 0.2s;"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      // Custom Icon for Hotspots (Premium Node Styling)
      const hotspotIcon = window.L.divIcon({
        className: 'custom-hotspot-marker',
        html: `<div style="background: #ef4444; width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6); display: flex; align-items: center; justifyContent: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Add Listing Markers
      (listings || []).forEach(listing => {
        const marker = window.L.marker([listing.latitude, listing.longitude], { icon: listingIcon })
          .addTo(mapInstance.current);
        
        const popupContent = `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; min-width: 150px;">
            <h4 style="margin: 0 0 4px 0; color: #4F633D;">${listing.title}</h4>
            <p style="margin: 0; font-size: 0.8rem; color: #666;">Qty: ${listing.quantity}</p>
            <p style="margin: 4px 0; font-size: 0.75rem; color: #888;">From: ${listing.source}</p>
            <button id="claim-${listing.id}" style="margin-top: 8px; width: 100%; padding: 8px; background: #4F633D; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">View Details</button>
          </div>
        `;

        marker.on('click', (e: any) => {
          if (window.L && window.L.DomEvent) {
            window.L.DomEvent.stopPropagation(e);
          }
          if (onMarkerClick) onMarkerClick(listing);
        });

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`claim-${listing.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.preventDefault();
              if (onMarkerClick) onMarkerClick(listing);
            };
          }
        });
      });

      // Add Hotspot Markers
      hotspots.forEach(spot => {
        window.L.marker([spot.lat, spot.lng], { icon: hotspotIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<div style="font-size: 0.75rem; font-weight: 600;">${spot.name}</div>`);
      });

      // Special VVCE Marker
      window.L.marker([12.3396, 76.6201])
        .addTo(mapInstance.current)
        .bindPopup('<b>VVCE Mysuru</b><br>Reference Point')
        .openPopup();
    };

    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [listings]);

  return (
    <div 
      ref={mapRef} 
      className="listing-map-container"
      style={{ 
        width: '100%', 
        height: '450px', 
        borderRadius: '24px', 
        overflow: 'hidden',
        border: '1px solid rgba(79, 99, 61, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        zIndex: 1
      }} 
    />
  );
};
