import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '../../services/supabaseListings';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on urgency
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const iconRed = createCustomIcon('#ef4444');
const iconOrange = createCustomIcon('#f97316');
const iconGreen = createCustomIcon('#22c55e');

const getMarkerIcon = (score: number) => {
  if (score >= 90) return iconRed;
  if (score >= 80) return iconOrange;
  return iconGreen;
};

// Component to handle map re-centering
const MapRecenter = ({ listings, activeListingId }: { listings: Listing[], activeListingId: string | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (activeListingId) {
      const activeListing = listings.find(l => l.id === activeListingId);
      if (activeListing && activeListing.latitude && activeListing.longitude) {
        map.setView([activeListing.latitude, activeListing.longitude], 14, {
          animate: true,
          duration: 1
        });
      }
    } else if (listings.length > 0) {
      // Find bounds of all valid listings
      const validListings = listings.filter(l => l.latitude && l.longitude);
      if (validListings.length > 0) {
        const bounds = L.latLngBounds(validListings.map(l => [l.latitude!, l.longitude!]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [activeListingId, listings, map]);

  return null;
};

interface MapViewProps {
  listings: Listing[];
  activeListingId: string | null;
  onMarkerClick: (id: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ listings, activeListingId, onMarkerClick }) => {
  // Mysuru center
  const center: [number, number] = [12.334, 76.619];

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapRecenter listings={listings} activeListingId={activeListingId} />

        {listings.map(listing => {
          if (!listing.latitude || !listing.longitude) return null;
          
          return (
            <Marker 
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
              icon={getMarkerIcon(listing.urgency_score)}
              eventHandlers={{
                click: () => onMarkerClick(listing.id)
              }}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>{listing.source}</strong>
                  <span>{listing.title}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
