import React, { useState, useEffect, useRef } from 'react';
import { ExploreTabs } from '../components/explore/ExploreTabs';
import { ListingCard } from '../components/explore/ListingCard';
import { MapView } from '../components/explore/MapView';
import { fetchListings } from '../services/supabaseListings';
import type { Listing } from '../services/supabaseListings';
import { Loader } from '../components/ui/Loader';
import { supabase } from '../lib/supabase';

export const ExploreNew: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'supermarket' | 'dining'>('supermarket');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  
  // Refs for scrolling
  const listingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadListings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('listings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, (payload) => {
        console.log('Realtime update:', payload);
        loadListings(); // Simple approach: reload all on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchListings();
      setListings(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(l => l.type === activeTab);

  const handleMarkerClick = (id: string) => {
    setActiveListingId(id);
    // Scroll to the card
    const cardElement = listingRefs.current[id];
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Setup Intersection Observer to highlight active marker on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry
        let maxRatio = 0;
        let mostVisibleId = null;
        
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleId = entry.target.getAttribute('data-id');
          }
        });

        if (mostVisibleId) {
          setActiveListingId(mostVisibleId);
        }
      },
      { root: listContainerRef.current, threshold: [0.3, 0.5, 0.8] }
    );

    Object.values(listingRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredListings]); // Re-run when filtered listings change

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
      {/* Left List Pane */}
      <div 
        ref={listContainerRef}
        style={{ 
          flex: '1', 
          maxWidth: '500px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
          zIndex: 10,
          backgroundColor: 'white'
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '24px', color: 'var(--color-text)' }}>
          Explore <span style={{ color: 'var(--color-primary)' }}>AnnaMithra</span>
        </h1>

        <ExploreTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Loader onComplete={() => {}} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
            {filteredListings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
                No active {activeTab} listings at the moment.
              </div>
            ) : (
              filteredListings.map(listing => (
                <div 
                  key={listing.id} 
                  data-id={listing.id}
                  ref={(el) => { listingRefs.current[listing.id] = el; }}
                >
                  <ListingCard 
                    listing={listing} 
                    isActive={activeListingId === listing.id}
                    onClick={() => setActiveListingId(listing.id)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Map Pane */}
      <div style={{ flex: '2', height: '100%', position: 'relative' }}>
        <MapView 
          listings={filteredListings} 
          activeListingId={activeListingId} 
          onMarkerClick={handleMarkerClick} 
        />
      </div>
    </div>
  );
};

export default ExploreNew;
