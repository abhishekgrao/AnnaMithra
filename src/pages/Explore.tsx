import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, MapPin, Clock, AlertCircle, Zap, ShieldCheck, Users } from 'lucide-react';
import { LeafletMap } from '../components/ui/LeafletMap';
import { ListingMap } from '../components/explore/ListingMap';
import { supabase } from '../lib/supabase';
import './Explore.css';

import { type FoodItem, MOCK_FOOD_ITEMS } from '../data/mockData';

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [distFilter, setDistFilter] = useState<'all' | 'sell' | 'donate'>('all');
  const [items, setItems] = useState<FoodItem[]>(MOCK_FOOD_ITEMS);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [claimQuantity, setClaimQuantity] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
    fetchLiveDonations();
  }, []);

  useEffect(() => {
    if (selectedFoodId) {
      const element = document.getElementById(`food-card-${selectedFoodId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedFoodId]);

  const fetchLiveDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .neq('status', 'Claimed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        const liveItems: FoodItem[] = data.map((d: any) => {
          const expDate = d.expiry_time ? new Date(d.expiry_time) : new Date(Date.now() + (d.expiry_days || 1) * 86400000);
          const now = new Date();
          const hoursLeft = Math.max(0, (expDate.getTime() - now.getTime()) / (1000 * 60 * 60));

          let urgencyLevel: 'high' | 'medium' | 'low' = 'low';
          let urgencyLabel = '✅ Low Priority';
          let urgencyScore = d.urgency_score || 30;

          if (hoursLeft < 2 || urgencyScore > 80) {
            urgencyLevel = 'high';
            urgencyLabel = hoursLeft < 24 ? `⚡ High Priority - ${Math.round(hoursLeft * 60)} min` : `⚡ High Priority`;
            urgencyScore = urgencyScore || 90;
          } else if (hoursLeft < 6 || urgencyScore > 50) {
            urgencyLevel = 'medium';
            urgencyLabel = `⏰ Medium - ${Math.round(hoursLeft)} hr`;
            urgencyScore = urgencyScore || 60;
          }

          return {
            id: d.id,
            name: d.title,
            type: d.category || 'Surplus Food',
            quantity: d.quantity,
            distance: '0.5 km',
            expiry: hoursLeft < 1 ? `${Math.round(hoursLeft * 60)} mins` : hoursLeft < 24 ? `${Math.round(hoursLeft)} hours` : `${d.expiry_days || 1} days`,
            donor: d.source || 'Local Donor',
            urgencyScore,
            urgencyLevel,
            urgencyLabel,
            verified: true,
            demand: 'High',
            latitude: d.latitude,
            longitude: d.longitude,
            donor_id: d.donor_id,
            // Safety & System Data
            foodType: d.food_type || 'General Food',
            preparedAt: d.prepared_at || 'Recently',
            storageTempType: d.storage_temp_type || 'Ambient',
            currentTemp: d.current_temp || 'Ambient',
            packagingType: d.packaging_type || 'Standard Packaging',
            storageEnv: d.storage_env || 'Food Prep Area',
            maxSafeDuration: d.max_safe_duration || '4 hrs',
            remainingSafeTime: d.remaining_safe_time || '2 hrs',
            safetyBuffer: d.safety_buffer || '0 mins',
            transportFeasible: d.transport_feasible || '✅ YES',
            vendorTrustScore: d.vendor_trust_score || 95,
            pastAccuracyScore: d.past_accuracy_score || 100,
            // Nutrition fields
            calories: d.calories,
            protein: d.protein,
            carbs: d.carbs,
            fat: d.fat,
            allergens: d.allergens,
            distributionType: d.distribution_type || 'both'
          };
        });

        // Combine with mock data and filter:
        // Keep if (lat && lng) OR if added by ME
        const filteredByGeo = [...liveItems, ...MOCK_FOOD_ITEMS].filter(item => {
          const hasGeo = (item as any).latitude && (item as any).longitude;
          const isMine = currentUserId && (item as any).donor_id === currentUserId;
          return hasGeo || isMine;
        });

        const uniqueItems = filteredByGeo.filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
        );

        setItems(uniqueItems);
      } else {
        // Even with no live data, filter mock items
        setItems(MOCK_FOOD_ITEMS.filter(item => (item as any).latitude && (item as any).longitude));
      }
    } catch (err) {
      console.error('Failed to fetch live donations:', err);
      setItems(MOCK_FOOD_ITEMS);
    }
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === 'all' || item.urgencyLevel === filter;
    
    // Distribution Filter Logic
    let matchDist = true;
    if (distFilter === 'sell') matchDist = item.distributionType === 'sell' || item.distributionType === 'both';
    if (distFilter === 'donate') matchDist = item.distributionType === 'donate' || item.distributionType === 'both';
    
    return matchSearch && matchFilter && matchDist && !claimedIds.includes(item.id);
  });

  const handleConfirmClaim = async () => {
    if (!selectedFoodId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login as an NGO to claim food.");
        return;
      }

      // Check if it's a mock item (numeric ID) or a real Supabase item (UUID)
      const isMock = !selectedFoodId.includes('-'); 

      if (!isMock) {
        const { error } = await supabase
          .from('listings')
          .update({
            status: 'Claimed',
            claimed_by: user.id
          })
          .eq('id', selectedFoodId);

        if (error) throw error;
      } else {
        console.log('Simulating claim for mock item:', selectedFoodId);
      }

      setClaimedIds(prev => [...prev, selectedFoodId]);
      setSuccessMsg(`Claim confirmed for ${claimQuantity || 'selected quantity'}! The donor has been notified and this order is now in your dashboard.`);
      setShowSuccess(true);
      setSelectedFoodId(null);
    } catch (err) {
      console.error('Error claiming food:', err);
      alert("Failed to confirm claim. If this is a real listing, please check your connection. Mock items are now handled.");
    }
  };

  const selectedFood = items.find(i => i.id === selectedFoodId);

  // Transform items for the map
  const mapListings = filteredItems.map(item => ({
    id: item.id,
    title: item.name,
    latitude: (item as any).latitude || 12.3396,
    longitude: (item as any).longitude || 76.6201,
    quantity: item.quantity,
    source: item.donor,
    category: item.type,
    urgency_score: item.urgencyScore
  }));

  return (
    <div className="page-container explore-page">
      {/* Enriched Claim Donation Modal */}
      {selectedFood && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedFoodId(null)}
        >
          <div 
            style={{ 
              maxWidth: '800px', 
              width: '95%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '32px', 
              position: 'relative', 
              background: '#F0EFE9', 
              borderRadius: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', borderBottom: '2px solid rgba(79, 99, 61, 0.1)', paddingBottom: '16px' }}>Claim Donation Detail</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>

              {/* Left Column: System & Safety Data */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} /> TRUST & SAFETY INSIGHTS
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                    <p><strong>Food Type:</strong> {selectedFood.foodType}</p>
                    <p><strong>Prepared:</strong> {selectedFood.preparedAt}</p>
                    <p><strong>Storage:</strong> {selectedFood.storageTempType}</p>
                    <p><strong>Temp:</strong> <span style={{ color: selectedFood.currentTemp?.includes('Danger') ? '#ef4444' : 'inherit', fontWeight: 700 }}>{selectedFood.currentTemp}</span></p>
                    <p><strong>Packaging:</strong> {selectedFood.packagingType}</p>
                    <p><strong>Environment:</strong> {selectedFood.storageEnv}</p>
                  </div>
                </div>

                <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>
                    ⚙️ SYSTEM LOGISTICS
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                    <p><strong>Max Safe:</strong> {selectedFood.maxSafeDuration}</p>
                    <p><strong>Remaining:</strong> <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.remainingSafeTime}</span></p>
                    <p><strong>Buffer:</strong> {selectedFood.safetyBuffer}</p>
                    <p><strong>Transport:</strong> <span style={{ fontWeight: 800 }}>{selectedFood.transportFeasible}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: '#F9FAFB', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Trust Score</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.vendorTrustScore}%</div>
                    </div>
                    <div style={{ flex: 1, background: '#F9FAFB', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Accuracy</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.pastAccuracyScore}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donor & Logistics Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>DONOR INFO</h4>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>#ID-{selectedFood.id.slice(0, 4)}</span>
                  </div>
                  <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                    <p><strong>Name:</strong> {selectedFood.donor}</p>
                    <p><strong>Item:</strong> {selectedFood.name}</p>
                    <p><strong>Available:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{selectedFood.quantity}</span></p>
                    <p><strong>Distance:</strong> {selectedFood.distance}</p>
                    <p><strong>Expires In:</strong> <span style={{ color: selectedFood.urgencyLevel === 'high' ? '#ef4444' : 'inherit', fontWeight: 800 }}>{selectedFood.expiry}</span></p>
                  </div>
                </div>

                <LeafletMap
                  location={selectedFood.donor}
                  lat={(selectedFood as any).latitude}
                  lng={(selectedFood as any).longitude}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Quantity Selection</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F3F4F6', padding: '6px', borderRadius: '12px' }}>
                  <button 
                    onClick={() => setClaimQuantity(prev => Math.max(1, (parseInt(prev, 10) || 1) - 1).toString())}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >-</button>
                  <input 
                    type="number"
                    value={claimQuantity || 1}
                    onChange={(e) => setClaimQuantity(e.target.value)}
                    style={{ width: '50px', border: 'none', background: 'transparent', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}
                  />
                  <button 
                    onClick={() => setClaimQuantity(prev => Math.min(parseInt(selectedFood.quantity, 10) || 40, (parseInt(prev, 10) || 1) + 1).toString())}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>
              <input 
                type="range"
                min="1"
                max={parseInt(selectedFood.quantity, 10) || 40}
                value={claimQuantity || 1} 
                onChange={(e) => setClaimQuantity(e.target.value)} 
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <Button size="lg" variant="outline" onClick={() => setSelectedFoodId(null)} style={{ background: 'white', borderRadius: '16px' }}>Back to Explore</Button>
              <Button size="lg" onClick={handleConfirmClaim} style={{ borderRadius: '16px' }}>Confirm Claim Now</Button>
            </div>

            <Button 
              variant="outline"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFood.donor)}`, '_blank')}
              style={{ width: '100%', marginTop: '12px', background: 'rgba(79, 99, 61, 0.05)', color: 'var(--color-primary)', border: 'none', borderRadius: '12px' }}
            >
              <MapPin size={16} /> Navigate in Google Maps
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '400px', width: '90%', padding: '32px', textAlign: 'center', background: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontSize: '2rem', boxShadow: '0 10px 20px rgba(79, 99, 61, 0.3)' }}>✅</div>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>Success!</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>{successMsg}</p>
            <Button fullWidth onClick={() => setShowSuccess(false)} style={{ borderRadius: '12px' }}>Awesome!</Button>
          </div>
        </div>
      )}

      <div className="explore-header">
        <h1 className="page-title">Find Food <span className="gradient-text">Nearby</span></h1>
        <p className="page-subtitle">Real-time surplus food available, sorted by urgency. Claim before it expires!</p>
      </div>

      {/* Top Distribution Filter Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ 
          background: 'rgba(79, 99, 61, 0.05)', 
          padding: '6px', 
          borderRadius: '20px', 
          display: 'flex', 
          gap: '4px',
          border: '1px solid rgba(79, 99, 61, 0.1)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          {(['all', 'sell', 'donate'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDistFilter(mode)}
              style={{
                padding: '10px 28px',
                borderRadius: '16px',
                border: 'none',
                background: distFilter === mode ? 'var(--color-primary)' : 'transparent',
                color: distFilter === mode ? 'white' : 'var(--color-text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.5px'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="search-filter-bar glass" id="map-anchor">
        <div className="search-input-wrap">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search food name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-inner-input"
          />
        </div>
        <div className="filter-chips">
          {(['all', 'high', 'medium', 'low'] as const).map(f => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'active' : ''} chip-${f}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '🌐 All' : f === 'high' ? '⚡ High' : f === 'medium' ? '⏰ Medium' : '✅ Low'}
            </button>
          ))}
        </div>
        <Button variant="glass" className="map-btn" onClick={() => window.scrollTo({ top: document.getElementById('interactive-map')?.offsetTop || 0, behavior: 'smooth' })}>
          <MapPin size={16} /> Map View
        </Button>
      </div>

      {/* Interactive Map Section */}
      <div id="interactive-map" style={{ marginBottom: '32px' }}>
        <ListingMap
          listings={mapListings}
          onMarkerClick={(listing) => setSelectedFoodId(listing.id)}
        />
      </div>

      {/* Fallback alert for high urgency */}
      {filteredItems.some(i => i.urgencyLevel === 'high') && (
        <div className="urgency-alert">
          <Zap size={16} />
          <span>
            <strong>{filteredItems.filter(i => i.urgencyLevel === 'high').length} high-priority items</strong> available near you — claim now before auto-redistribution triggers!
          </span>
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="food-grid">
          {[...filteredItems].sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0)).map((item) => (
            <Card
              key={item.id}
              id={`food-card-${item.id}`}
              className={`food-card urgency-border-${item.urgencyLevel} ${selectedFoodId === item.id ? 'selected-jump' : ''}`}
            >
              <div className="food-card-top">
                <span className="food-type-badge">{item.type}</span>
                <span className={`urgency-badge ${item.urgencyLevel}`}>
                  {item.urgencyLabel}
                </span>
              </div>
              <div className="food-card-title-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {item.distributionType === 'sell' && <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>🟢 SELL</span>}
                  {item.distributionType === 'both' && <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>🟡 BOTH</span>}
                  {item.distributionType === 'donate' && <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>🔵 DONATE</span>}
                  {item.verified && (
                    <span className="verified-badge"><ShieldCheck size={14} /> Verified</span>
                  )}
                </div>
                <h3 className="food-name" style={{ margin: 0 }}>{item.name}</h3>
              </div>
              <p className="donor-name">from {item.donor}</p>

              <div className="food-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Quantity</span>
                  <span className="meta-value">{item.quantity}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label"><Clock size={12} /> Expires in</span>
                  <span className={`meta-value ${item.urgencyLevel === 'high' ? 'text-danger' : ''}`}>{item.expiry}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label"><MapPin size={12} /> Distance</span>
                  <span className="meta-value">{item.distance}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label"><Users size={12} /> Demand</span>
                  <span className="meta-value">{item.demand}</span>
                </div>
              </div>

              <div className="urgency-bar-wrap">
                <div className="urgency-bar-label">
                  <Zap size={12} /> Urgency Score
                  <span className="urgency-score-num">{item.urgencyScore}/100</span>
                </div>
                <div className="urgency-bar">
                  <div
                    className={`urgency-bar-fill ${item.urgencyLevel}`}
                    style={{ width: `${item.urgencyScore}%` }}
                  />
                </div>
              </div>

              <Button fullWidth onClick={() => { setSelectedFoodId(item.id); setClaimQuantity(''); }}>
                Claim Now
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="page-container notifications-page">
          <Card className="empty-card">
            <AlertCircle size={48} className="empty-icon" />
            <h3>No Food Available</h3>
            <p>There is currently no surplus food matching your filters. Try expanding your search or check back soon.</p>
            <div className="fallback-info">
              <RefreshCwIcon />
              <p><strong>Auto-Redistribution Active:</strong> We are notifying backup NGOs and nearest shelters automatically.</p>
            </div>
            <Button variant="outline" onClick={() => { setItems(MOCK_FOOD_ITEMS); setFilter('all'); setSearchQuery(''); setClaimedIds([]); }}>
              Refresh Listings
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

const RefreshCwIcon = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>
  </div>
);
