import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, MapPin, Clock, AlertCircle, Zap, ShieldCheck, Users } from 'lucide-react';
import { LeafletMap } from '../components/ui/LeafletMap';
import { ListingMap } from '../components/explore/ListingMap';
import { supabase } from '../lib/supabase';
import './Explore.css';

interface FoodItem {
  id: string;
  name: string;
  type: string;
  quantity: string;
  distance: string;
  expiry: string;
  donor: string;
  urgencyScore: number; // 0-100
  urgencyLevel: 'high' | 'medium' | 'low';
  urgencyLabel: string;
  verified: boolean;
  demand: string;
  // Safety & System Data
  foodType?: string;
  preparedAt?: string;
  storageTempType?: string;
  currentTemp?: string;
  packagingType?: string;
  storageEnv?: string;
  maxSafeDuration?: string;
  remainingSafeTime?: string;
  safetyBuffer?: string;
  transportFeasible?: string;
  vendorTrustScore?: number;
  pastAccuracyScore?: number;
}

const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1', name: 'KFC Fried Chicken Bucket', type: 'Fast Food',
    quantity: '15 pieces', distance: '0.8 km', expiry: '30 mins',
    donor: 'KFC', urgencyScore: 95, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 30 min', verified: true, demand: 'Very High',
    latitude: 12.3260, longitude: 76.6127,
    foodType: 'Deep Fried Meat (TCS Food)', preparedAt: '20:30',
    storageTempType: 'Ambient / Cooling', currentTemp: '42°C (Danger Zone)',
    packagingType: 'Vented Cardboard Bucket', storageEnv: 'Countertop',
    maxSafeDuration: '4 hrs', remainingSafeTime: '30 mins', safetyBuffer: '0 mins',
    transportFeasible: '⚠️ MARGINAL', vendorTrustScore: 88, pastAccuracyScore: 95
  },
  {
    id: '2', name: 'Veg Dum Biryani', type: 'Main Course',
    quantity: '10 portions', distance: '1.2 km', expiry: '4 hours',
    donor: 'Taj Hotel', urgencyScore: 60, urgencyLevel: 'medium',
    urgencyLabel: '⏰ Medium - 4 hr', verified: true, demand: 'High',
    latitude: 12.3346, longitude: 76.5619,
    foodType: 'Mixed Cooked Rice & Veg', preparedAt: '22:00',
    storageTempType: 'Heated', currentTemp: '65°C',
    packagingType: 'Sealed Alum Containers', storageEnv: 'Warming Cabinet',
    maxSafeDuration: '6+ hrs', remainingSafeTime: '4 hrs', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 98, pastAccuracyScore: 99
  },
  {
    id: '3', name: 'Masala Dosa & Sambar', type: 'South Indian',
    quantity: '5 portions', distance: '2.5 km', expiry: '1 hour',
    donor: 'MTR (Mavalli Tiffin Room)', urgencyScore: 85, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1 hr', verified: false, demand: 'Medium',
    latitude: 12.3213, longitude: 76.6183,
    foodType: 'Fermented Batter Crepe & Stew', preparedAt: '21:30',
    storageTempType: 'Mixed (Dosa/Sambar)', currentTemp: 'Sambar 68°C / Dosa 32°C',
    packagingType: 'Foil Wraps & Plastic Tubs', storageEnv: 'Prep Table',
    maxSafeDuration: '4 hrs', remainingSafeTime: '1 hr 30 mins', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 95, pastAccuracyScore: 92
  },
  {
    id: '4', name: 'McDonald\'s Happy Meals', type: 'Fast Food',
    quantity: '3 meals', distance: '3.1 km', expiry: '5 hours',
    donor: 'McDonald\'s', urgencyScore: 30, urgencyLevel: 'low',
    urgencyLabel: '✅ Low Priority - 5 hr', verified: true, demand: 'Low',
    latitude: 12.3382, longitude: 76.6019,
    foodType: 'Burgers & Fries', preparedAt: '23:00',
    storageTempType: 'Chilled', currentTemp: '4°C',
    packagingType: 'Paper Bags & Cardboard', storageEnv: 'Walk-in Fridge',
    maxSafeDuration: '2-3 days', remainingSafeTime: '6 hrs', safetyBuffer: '-1 hr',
    transportFeasible: '✅ YES', vendorTrustScore: 85, pastAccuracyScore: 89
  },
  {
    id: '5', name: 'Paneer Butter Masala', type: 'North Indian',
    quantity: '20 portions', distance: '0.4 km', expiry: '45 mins',
    donor: 'Haldiram\'s', urgencyScore: 92, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 45 min', verified: true, demand: 'Very High',
    latitude: 12.3232, longitude: 76.6278,
    foodType: 'Dairy-Based Gravy (High Risk)', preparedAt: '20:45',
    storageTempType: 'Cooling / Ambient', currentTemp: '48°C (Danger Zone)',
    packagingType: 'Sealed Plastic Tubs', storageEnv: 'Countertop',
    maxSafeDuration: '4 hrs', remainingSafeTime: '45 mins', safetyBuffer: '0 mins',
    transportFeasible: '✅ YES (Barely)', vendorTrustScore: 92, pastAccuracyScore: 94
  },
  {
    id: '6', name: 'Chole Bhature', type: 'North Indian',
    quantity: '8 portions', distance: '1.8 km', expiry: '8 hours',
    donor: 'Bikanerwala', urgencyScore: 20, urgencyLevel: 'low',
    urgencyLabel: '✅ Low Priority - 8 hr', verified: true, demand: 'Moderate',
    latitude: 12.3396, longitude: 76.6201,
    foodType: 'Spiced Chickpea & Bread', preparedAt: '22:30',
    storageTempType: 'Cold Storage', currentTemp: '3°C',
    packagingType: 'Microwavable Containers', storageEnv: 'Commercial Fridge',
    maxSafeDuration: '3-4 days', remainingSafeTime: '9 hrs', safetyBuffer: '-1 hr',
    transportFeasible: '✅ YES', vendorTrustScore: 90, pastAccuracyScore: 88
  },
  {
    id: '7', name: 'Buffet surplus (rice, curries, desserts)', type: '5⭐ Buffet',
    quantity: '~40 servings', distance: '1.8 km', expiry: '45 mins',
    donor: 'Radisson Blu Plaza', urgencyScore: 96, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 45 min', verified: true, demand: 'Very High',
    latitude: 12.299551, longitude: 76.664234,
    foodType: 'Mixed Buffet (Rice/Gravies)', preparedAt: '20:00',
    storageTempType: 'Heated', currentTemp: '62°C',
    packagingType: 'Buffet Trays / Foils', storageEnv: 'Bain-marie (Hot)',
    maxSafeDuration: '6 hrs', remainingSafeTime: '2 hrs', safetyBuffer: '-1 hr 15m',
    transportFeasible: '✅ YES', vendorTrustScore: 97, pastAccuracyScore: 96
  },
  {
    id: '8', name: 'South Indian + Continental mains', type: 'Luxury Dining',
    quantity: '~30 plates', distance: '2.3 km', expiry: '1 hour',
    donor: 'Grand Mercure', urgencyScore: 75, urgencyLevel: 'high',
    urgencyLabel: '⚡ High Priority - 1 hr', verified: true, demand: 'High',
    latitude: 12.295921, longitude: 76.639982,
    foodType: 'Mixed Cuisine (Pasta/Curry)', preparedAt: '21:15',
    storageTempType: 'Cooling', currentTemp: '55°C (Danger Zone)',
    packagingType: 'Commercial Food Pans', storageEnv: 'Kitchen Staging',
    maxSafeDuration: '4 hrs', remainingSafeTime: '1 hr 30 mins', safetyBuffer: '-30 mins',
    transportFeasible: '✅ YES', vendorTrustScore: 94, pastAccuracyScore: 91
  },
];

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
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
            allergens: d.allergens
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
    return matchSearch && matchFilter && !claimedIds.includes(item.id);
  });

  const handleConfirmClaim = async () => {
    if (!selectedFoodId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login as an NGO to claim food.");
        return;
      }

      const { error } = await supabase
        .from('listings')
        .update({ 
          status: 'Claimed', 
          claimed_by: user.id 
        })
        .eq('id', selectedFoodId);

      if (error) throw error;

      setClaimedIds(prev => [...prev, selectedFoodId]);
      setSuccessMsg(`Claim confirmed for ${claimQuantity || 'selected quantity'}! The donor has been notified and this order is now in your dashboard.`);
      setShowSuccess(true);
      setSelectedFoodId(null);
    } catch (err) {
      console.error('Error claiming food:', err);
      alert("Failed to confirm claim. Please try again.");
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
    <div className="explore-container">
      {/* Enriched Claim Donation Modal */}
      {selectedFood && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <Card className="glass" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', borderBottom: '2px solid rgba(79, 99, 61, 0.1)', paddingBottom: '16px' }}>Claim Donation Detail</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Left Column: System & Safety Data */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px solid rgba(79, 99, 61, 0.1)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} /> 🛡️ Trust & Safety Insights
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

                <div style={{ padding: '20px', background: 'rgba(79, 99, 61, 0.05)', borderRadius: '16px', border: '1px solid rgba(79, 99, 61, 0.2)' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>
                    ⚙️ System Logistics
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                    <p><strong>Max Safe:</strong> {selectedFood.maxSafeDuration}</p>
                    <p><strong>Remaining:</strong> <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.remainingSafeTime}</span></p>
                    <p><strong>Buffer:</strong> {selectedFood.safetyBuffer}</p>
                    <p><strong>Transport:</strong> <span style={{ fontWeight: 800 }}>{selectedFood.transportFeasible}</span></p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Trust Score</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.vendorTrustScore}%</div>
                    </div>
                    <div style={{ flex: 1, background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Accuracy</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedFood.pastAccuracyScore}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Donor & Logistics Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 800 }}>Donor Info</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>#ID-{selectedFood.id.slice(0, 4)}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
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
              <label style={{ display: 'block', fontSize: '1rem', marginBottom: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>Quantiy Selection</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <input 
                  type="number" 
                  min="1"
                  max={parseInt(selectedFood.quantity, 10) || 40}
                  value={claimQuantity || 1} 
                  onChange={(e) => setClaimQuantity(e.target.value)} 
                  style={{ width: '80px', padding: '12px', borderRadius: '12px', border: '2px solid var(--color-primary-light)', background: 'var(--color-bg)', color: 'var(--color-primary)', fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold' }}
                />
                <input 
                  type="range"
                  min="1"
                  max={parseInt(selectedFood.quantity, 10) || 40}
                  value={claimQuantity || 1} 
                  onChange={(e) => setClaimQuantity(e.target.value)} 
                  style={{ flex: 1, accentColor: 'var(--color-primary)' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <Button size="lg" variant="outline" onClick={() => setSelectedFoodId(null)} style={{ boxShadow: 'none' }}>Back to Explore</Button>
              <Button size="lg" onClick={handleConfirmClaim}>Confirm Claim Now</Button>
            </div>

            <Button 
              variant="glass"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFood.donor)}`, '_blank')}
              style={{ width: '100%', marginTop: '12px', background: 'rgba(79, 99, 61, 0.1)', color: 'var(--color-primary)' }}
            >
              <MapPin size={16} /> Navigate in Google Maps
            </Button>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Card className="glass" style={{ maxWidth: '400px', width: '90%', padding: '32px', textAlign: 'center', animation: 'jump 0.5s ease-out' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', fontSize: '2rem', boxShadow: '0 10px 20px rgba(79, 99, 61, 0.3)' }}>✅</div>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>Success!</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>{successMsg}</p>
            <Button fullWidth onClick={() => setShowSuccess(false)}>Awesome!</Button>
          </Card>
        </div>
      )}
      
      <div className="explore-header">
        <h1 className="page-title">Find Food <span className="gradient-text">Nearby</span></h1>
        <p className="page-subtitle">Real-time surplus food available, sorted by urgency. Claim before it expires!</p>
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
              <div className="food-card-title-row">
                <h3 className="food-name">{item.name}</h3>
                {item.verified && (
                  <span className="verified-badge"><ShieldCheck size={14} /> Verified</span>
                )}
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
        <div className="empty-state">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
  </div>
);
