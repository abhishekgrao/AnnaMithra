import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase } from '../lib/supabase';
import { Upload as UploadIcon, MapPin, CheckSquare, Square, ShieldCheck, AlertCircle, Search, RefreshCw, Info } from 'lucide-react';
import { searchFood } from '../services/foodApi';
import type { NutritionData } from '../services/foodApi';
import './Upload.css';

const SAFETY_CHECKLIST = [
  'Food has been stored at proper temperature',
  'Packaging is sealed and undamaged',
  'Expiry date has been verified',
  'Food is free from cross-contamination',
  'Prepared in a clean & hygienic environment',
];

const FOOD_CATEGORIES = [
  { value: 'Main Course', label: 'Main Course' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Healthy', label: 'Healthy & Salad' },
  { value: 'Raw', label: 'Raw Ingredients' },
];

const DIETARY_INFO = [
  { value: 'None', label: 'Not specified' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
  { value: 'Gluten Free', label: 'Gluten Free' },
  { value: 'Nut Free', label: 'Nut Free' },
];

const DISTRIBUTION_TYPES = [
  { value: 'sell', label: '🟢 Sell (Preferred for packaged/bakery)' },
  { value: 'donate', label: '🔵 Donate (Better for high urgency)' },
  { value: 'both', label: '🟡 Both (Flexible)' },
];

export const Upload: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [dietary, setDietary] = useState('None');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [instructions, setInstructions] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [manualCoords, setManualCoords] = useState<{lat: string, lng: string}>({lat: '', lng: ''});
  
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(SAFETY_CHECKLIST.length).fill(false));
  const [errorMsg, setErrorMsg] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [foodPhoto, setFoodPhoto] = useState<File | null>(null);
  const [foodPhotoUrl, setFoodPhotoUrl] = useState<string | null>(null);

  // Safety & Logistics State
  const [foodType, setFoodType] = useState('');
  const [preparedAt, setPreparedAt] = useState('');
  const [storageTempType, setStorageTempType] = useState('Ambient');
  const [currentTemp, setCurrentTemp] = useState('');
  const [packagingType, setPackagingType] = useState('');
  const [storageEnv, setStorageEnv] = useState('');
  const [distributionType, setDistributionType] = useState<'sell' | 'donate' | 'both'>('both');
  const [pickupWindow, setPickupWindow] = useState('');
  const [vehicleRequirement, setVehicleRequirement] = useState('Any');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Nutrition Search State
  const [isSearching, setIsSearching] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [nutritionMessage, setNutritionMessage] = useState('');
  const [isManualNutrition, setIsManualNutrition] = useState(false);
  const [manualNutrition, setManualNutrition] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    allergens: ''
  });
  
  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          setManualCoords({ lat: lat.toString(), lng: lng.toString() });
          setAddress(`GPS Data: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        },
        () => {
          alert("Could not fetch location. Please enter your address manually.");
        }
      );
    }
  };

  React.useEffect(() => {
    const lowTitle = title.toLowerCase();
    if (category === 'Bakery' || lowTitle.includes('bread') || lowTitle.includes('bun') || lowTitle.includes('biscuit')) {
      setDistributionType('sell');
    } else if (category === 'Main Course' || category === 'Dessert') {
      setDistributionType('both');
    } else if (category === 'Raw' || category === 'Healthy') {
      setDistributionType('donate');
    }
  }, [category, title]);

  const handleMapsLinkParse = () => {
    if (!mapsLink) return;
    
    // Extract lat/lng from Google Maps URL format: @lat,lng,zoom
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = mapsLink.match(regex);
    
    if (match && match[1] && match[2]) {
      const lat = match[1];
      const lng = match[2];
      setManualCoords({ lat, lng });
      setCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setAddress(`Extracted from Maps: ${lat}, ${lng}`);
      alert(`Location extracted! Lat: ${lat}, Lng: ${lng}`);
    } else {
      alert("Could not find coordinates in this link. Please ensure it's a standard Google Maps URL with '@lat,lng' format.");
    }
  };
  
  const handleSearch = async () => {
    if (!title.trim()) return;
    
    setIsSearching(true);
    setNutritionMessage('');
    try {
      const data = await searchFood(title);
      if (data) {
        setNutrition(data);
        // Auto-fill category if it seems healthy or bakery
        if (data.productName.toLowerCase().includes('bread')) setCategory('Bakery');
        if (data.calories < 100) setCategory('Healthy');
      } else {
        setNutrition(null);
        setNutritionMessage('No nutritional data found. Please enter manually below.');
        setIsManualNutrition(true);
      }
    } catch (err) {
      setNutritionMessage('Error fetching nutritional data.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoodPhoto(file);
      const url = URL.createObjectURL(file);
      setFoodPhotoUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!allChecked) return;
    if (!category) {
      setErrorMsg("Please select a valid food category.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be legally logged in to list a food donation.");
      }

      // We use the new 'listings' table as requested
      const { error } = await supabase.from('listings').insert([
        {
          donor_id: user.id,
          title: title,
          category: category,
          quantity: quantity,
          expiry_time: (new Date(expiryTime)).toISOString(),
          expiry_days: Math.max(1, Math.ceil(((new Date(expiryTime)).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
          latitude: manualCoords.lat ? parseFloat(manualCoords.lat) : (coords?.lat || 12.3396),
          longitude: manualCoords.lng ? parseFloat(manualCoords.lng) : (coords?.lng || 76.6201),
          source: user.email?.split('@')[0] || 'Community Donor',
          type: 'donation',
          urgency_score: 50, // Default mid urgency
          calories: isManualNutrition ? parseFloat(manualNutrition.calories) : nutrition?.calories,
          protein: isManualNutrition ? manualNutrition.protein : nutrition?.protein,
          carbs: isManualNutrition ? manualNutrition.carbs : nutrition?.carbs,
          fat: isManualNutrition ? manualNutrition.fat : nutrition?.fat,
          allergens: isManualNutrition ? manualNutrition.allergens : nutrition?.allergens,
          nutrition_source: isManualNutrition ? 'manual' : (nutrition ? 'open_food_facts' : null),
          // Safety & System Data
          food_type: foodType,
          prepared_at: preparedAt,
          storage_temp_type: storageTempType,
          current_temp: currentTemp,
          packaging_type: packagingType,
          storage_env: storageEnv,
          vendor_trust_score: 95, // Default for new donors
          past_accuracy_score: 100,
          transport_feasible: '✅ YES',
          distribution_type: distributionType,
          pickup_window: pickupWindow,
          vehicle_requirement: vehicleRequirement,
          access_instructions: accessInstructions,
          image_url: foodPhotoUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80'
        }
      ]);

      if (error) {
        throw error;
      }
      
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit donation to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="upload-container">
        <div className="success-state">
          <Card className="success-card">
            <div className="success-icon-wrap">✅</div>
            <h2>Donation Listed Successfully!</h2>
            <p>Your food donation has been stored securely in our network and is now being matched with nearby NGOs.</p>
            <div className="success-stats">
              <div className="success-stat">
                <span className="success-stat-val">~5 mins</span>
                <span className="success-stat-lbl">Avg Claim Time</span>
              </div>
              <div className="success-stat">
                <span className="success-stat-val">Live</span>
                <span className="success-stat-lbl">Broadcasting</span>
              </div>
              <div className="success-stat">
                <span className="success-stat-val">+10</span>
                <span className="success-stat-lbl">Kindness Pts</span>
              </div>
            </div>
            <Button onClick={() => setSubmitted(false)} variant="outline">Donate More Food</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container upload-page">
      <div className="upload-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title">Donate <span className="gradient-text">Food</span></h1>
        <p className="page-subtitle">List your surplus food to help feed the community. Takes under 2 minutes.</p>
      </div>

      <div className="upload-layout">
        <div className="upload-main">
          <Card className="upload-card">
            <h3 className="card-section-title">🍽️ Food Details</h3>
            <form onSubmit={handleSubmit} className="upload-form">
              
              {errorMsg && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px' }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group">
                <Input 
                  label="Food Name / Type" 
                  placeholder="e.g., 50 Servings of Pasta, Fresh Bread" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                  rightIcon={isSearching ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                  onIconClick={handleSearch}
                />

                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <input 
                    type="file" 
                    id="food-photo-input" 
                    accept="image/*" 
                    capture="environment" 
                    style={{ display: 'none' }} 
                    onChange={handlePhotoChange}
                  />
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('food-photo-input')?.click()}
                      style={foodPhotoUrl ? { borderColor: 'var(--color-primary)', background: 'rgba(79, 99, 61, 0.05)' } : {}}
                    >
                      <Camera size={18} /> {foodPhotoUrl ? 'Photo Added ✓' : 'Add Food Photo'}
                    </Button>
                    {foodPhotoUrl && (
                      <img src={foodPhotoUrl} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    )}
                  </div>
                </div>
                
                {/* Nutrition Card */}
                {(nutrition || nutritionMessage) && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '16px', 
                    background: 'var(--color-bg)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--color-primary-light)',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    {nutritionMessage ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Info size={14} /> {nutritionMessage}
                      </p>
                    ) : nutrition && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>Nutritional data available</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>via Open Food Facts</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          <div style={{ textAlign: 'center', background: 'white', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cals</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{Math.round(nutrition.calories)}</div>
                          </div>
                          <div style={{ textAlign: 'center', background: 'white', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Protein</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{nutrition.protein}g</div>
                          </div>
                          <div style={{ textAlign: 'center', background: 'white', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Carbs</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{nutrition.carbs}g</div>
                          </div>
                          <div style={{ textAlign: 'center', background: 'white', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fat</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{nutrition.fat}g</div>
                          </div>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <strong>Allergens:</strong> {nutrition.allergens}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '16px', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => setIsManualNutrition(!isManualNutrition)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: 'none', 
                      border: 'none', 
                      padding: 0, 
                      cursor: 'pointer',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    {isManualNutrition ? <CheckSquare size={18} /> : <Square size={18} />}
                    Manual Nutrition & Allergen Info
                  </button>
                  
                  {isManualNutrition && (
                    <div className="manual-nutrition-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                      gap: '10px',
                      background: 'rgba(79, 99, 61, 0.04)',
                      padding: '15px',
                      borderRadius: '10px',
                      marginTop: '12px'
                    }}>
                      <div className="form-group">
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Cals (kcal)</label>
                        <input 
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
                          placeholder="250"
                          value={manualNutrition.calories}
                          onChange={(e) => setManualNutrition({...manualNutrition, calories: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Protein (g)</label>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
                          placeholder="12"
                          value={manualNutrition.protein}
                          onChange={(e) => setManualNutrition({...manualNutrition, protein: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Carbs (g)</label>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
                          placeholder="30"
                          value={manualNutrition.carbs}
                          onChange={(e) => setManualNutrition({...manualNutrition, carbs: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Fat (g)</label>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
                          placeholder="8"
                          value={manualNutrition.fat}
                          onChange={(e) => setManualNutrition({...manualNutrition, fat: e.target.value})}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Allergens (e.g. Milk, Nuts)</label>
                        <input 
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.9rem' }}
                          placeholder="e.g. Contains Dairy and Gluten"
                          value={manualNutrition.allergens}
                          onChange={(e) => setManualNutrition({...manualNutrition, allergens: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ minWidth: '220px' }}>
                  <Select 
                    label="Food Category" 
                    options={FOOD_CATEGORIES} 
                    value={category} 
                    onChange={setCategory} 
                    placeholder="Select category"
                    required 
                  />
                </div>
                <div className="form-group">
                  <Input 
                    label="Quantity (approx.)" 
                    placeholder="e.g., 20 kg, 50 portions" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Input 
                    label="Expiry Date & Time" 
                    type="datetime-local" 
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group" style={{ minWidth: '220px' }}>
                  <Select 
                    label="Dietary Info" 
                    options={DIETARY_INFO} 
                    value={dietary} 
                    onChange={setDietary} 
                  />
                </div>
              </div>

              {/* Safety & Logistics Data Section */}
              <div 
                onClick={() => setActiveSection('safety')}
                style={{ 
                  marginTop: '32px', 
                  padding: '24px', 
                  background: activeSection === 'safety' ? 'rgba(79, 99, 61, 0.08)' : '#ffffff', 
                  borderRadius: '20px', 
                  border: '1px solid',
                  borderColor: activeSection === 'safety' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ 
                    padding: '10px', 
                    background: activeSection === 'safety' ? 'var(--color-primary)' : 'rgba(79, 99, 61, 0.1)', 
                    color: activeSection === 'safety' ? 'white' : 'var(--color-primary)', 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <ShieldCheck size={24} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary)' }}>Safety & Logistics Data</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Input 
                      label="Specific Food Type" 
                      placeholder="e.g., Deep Fried Meat, Mixed Cooked Rice" 
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Input 
                      label="Prepared At (Time)" 
                      type="datetime-local" 
                      value={preparedAt}
                      onChange={(e) => setPreparedAt(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Select 
                      label="Storage Temp Type" 
                      options={[
                        { value: 'Ambient', label: 'Ambient / Cooling' },
                        { value: 'Hot', label: 'Hot Holding (>60°C)' },
                        { value: 'Cold', label: 'Chilled (<5°C)' }
                      ]} 
                      value={storageTempType} 
                      onChange={setStorageTempType} 
                    />
                  </div>
                  <div className="form-group">
                    <Input 
                      label="Current Temperature (°C)" 
                      placeholder="e.g., 42, 65" 
                      value={currentTemp}
                      onChange={(e) => setCurrentTemp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Input 
                      label="Packaging Type" 
                      placeholder="e.g., Vented Cardboard, Foil Wrap" 
                      value={packagingType}
                      onChange={(e) => setPackagingType(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <Input 
                      label="Storage Environment" 
                      placeholder="e.g., Countertop, Refrigerator" 
                      value={storageEnv}
                      onChange={(e) => setStorageEnv(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ width: '100%' }}>
                    <Select 
                      label="Distribution Type (AI Suggested)" 
                      options={DISTRIBUTION_TYPES} 
                      value={distributionType} 
                      onChange={(val) => setDistributionType(val as any)} 
                      required 
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Tip: System suggests <strong>{distributionType}</strong> based on food type, but you can override.
                    </p>
                  </div>
                </div>
                <p style={{ margin: '16px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  * This data allows our system to calculate high-precision <strong>Safety Buffers</strong> and <strong>Urgency Scores</strong>.
                </p>
              </div>

              <div 
                onClick={() => setActiveSection('location')}
                style={{ 
                  marginTop: '24px', 
                  padding: '24px', 
                  background: activeSection === 'location' ? 'rgba(79, 99, 61, 0.08)' : '#ffffff', 
                  borderRadius: '20px', 
                  border: '1px solid',
                  borderColor: activeSection === 'location' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ 
                    background: activeSection === 'location' ? 'var(--color-primary)' : 'rgba(79, 99, 61, 0.1)', 
                    color: activeSection === 'location' ? 'white' : 'var(--color-primary)', 
                    padding: '10px', 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <MapPin size={24} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary)' }}>Pickup & Location Data</h3>
                </div>

                <div className="form-group">
                  <Input 
                    label="Pickup Location / Address" 
                    placeholder="Enter shop address or building name" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                  />
                  
                  <div style={{ marginTop: '16px' }}>
                    <Input 
                      label="Google Maps Link (Auto-Fetch Coordinates)" 
                      placeholder="Paste maps.google.com link here..." 
                      value={mapsLink}
                      onChange={(e) => setMapsLink(e.target.value)}
                      rightIcon={<Search size={18} />}
                      onIconClick={handleMapsLinkParse}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Tip: Search your location on Google Maps and paste the URL here to auto-pin your donation.
                    </p>
                  </div>

                  <div className="form-row" style={{ marginTop: '16px' }}>
                    <div className="form-group">
                      <Input 
                        label="Latitude" 
                        placeholder="e.g., 12.3396" 
                        value={manualCoords.lat}
                        onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <Input 
                        label="Longitude" 
                        placeholder="e.g., 76.6201" 
                        value={manualCoords.lng}
                        onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button type="button" className="fetch-location-btn" style={{ marginTop: '12px' }} onClick={fetchLocation}>
                    <MapPin size={15} /> Use My Current GPS
                  </button>
                </div>
              </div>

              {/* Logistics & Fulfillment Section */}
              <div 
                onClick={() => setActiveSection('logistics')}
                style={{ 
                  marginTop: '24px', 
                  padding: '24px', 
                  background: activeSection === 'logistics' ? 'rgba(79, 99, 61, 0.08)' : '#ffffff', 
                  borderRadius: '20px', 
                  border: '1px solid',
                  borderColor: activeSection === 'logistics' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ 
                    background: activeSection === 'logistics' ? 'var(--color-primary)' : 'rgba(79, 99, 61, 0.1)', 
                    color: activeSection === 'logistics' ? 'white' : 'var(--color-primary)', 
                    padding: '10px', 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <UploadIcon size={24} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary)' }}>Logistics & Fulfillment</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Input 
                      label="Preferred Pickup Window" 
                      placeholder="e.g., Today 4PM - 6PM, Within 1 hour" 
                      value={pickupWindow}
                      onChange={(e) => setPickupWindow(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <Select 
                      label="Vehicle Requirement" 
                      options={[
                        { value: 'Any', label: 'Any Vehicle (Bike/Car)' },
                        { value: 'Car', label: 'Car Required (Large volume)' },
                        { value: 'Van', label: 'Van/Truck Required' },
                        { value: 'Refrigerated', label: 'Refrigerated Transport Only' }
                      ]} 
                      value={vehicleRequirement} 
                      onChange={setVehicleRequirement} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <Input 
                    label="Access & Handling Instructions" 
                    placeholder="e.g., Parking available in basement, entry from Gate 2, heavy lifting" 
                    value={accessInstructions}
                    onChange={(e) => setAccessInstructions(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Additional Instructions (Optional)</label>
                <textarea
                  className="input-field textarea-field"
                  placeholder="Pickup notes, allergies, preparation method..."
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Safety Checklist */}
              <div className="safety-checklist">
                <div className="checklist-header">
                  <ShieldCheck size={18} />
                  <h4>Food Safety Checklist</h4>
                  <span className="checklist-badge">{checkedItems.filter(Boolean).length}/{SAFETY_CHECKLIST.length} checked</span>
                </div>
                <p className="checklist-sub">Please confirm all safety standards before submitting.</p>
                <div className="checklist-items">
                  {SAFETY_CHECKLIST.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`checklist-item ${checkedItems[i] ? 'checked' : ''}`}
                      onClick={() => toggleCheck(i)}
                    >
                      {checkedItems[i] ? <CheckSquare size={18} /> : <Square size={18} />}
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="termsCheckbox" 
                  checked={termsAccepted} 
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                  style={{ marginTop: '4px', accentColor: 'var(--color-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="termsCheckbox" style={{ fontSize: '0.9rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                  I confirm that this listing complies with the <span onClick={(e) => { e.preventDefault(); setShowTerms(true); }} style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold' }}>Terms &amp; Conditions</span> and is safe for redistribution.
                </label>
              </div>

              {!allChecked && (
                <div className="checklist-warning">
                  <AlertCircle size={15} />
                  <span>Please complete the safety checklist to submit.</span>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth disabled={isSubmitting || !allChecked || !termsAccepted}>
                {isSubmitting ? 'Uploading to Network...' : <><UploadIcon size={18} /> List Food Donation</>}
              </Button>
            </form>
          </Card>
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <Card className="glass" style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', padding: '32px', position: 'relative' }}>
              <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '12px' }}>Surplus Food Listing – Terms &amp; Conditions</h2>
              <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text)' }}>
                <p style={{ marginBottom: '16px' }}>By listing food on AnnaMithra, you agree to the following:</p>
                <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><strong>Food Safety Responsibility:</strong> You confirm that the listed food is safe for consumption at the time of listing and has been stored and handled according to basic hygiene standards.</li>
                  <li><strong>Accurate Information:</strong> You will provide correct details including food type, quantity, preparation time, and estimated expiry.</li>
                  <li><strong>No Expired or Unsafe Food:</strong> You will not list food that is spoiled, contaminated, or past safe consumption limits.</li>
                  <li><strong>Timely Handover:</strong> You agree to hand over the food within the specified time window and in the condition described.</li>
                  <li><strong>No Sale of Donated Food:</strong> Food listed as donation must be provided free of cost to NGOs or recipients through the platform.</li>
                  <li><strong>Liability Limitation:</strong> AnnaMithra acts only as a connecting platform. The responsibility for food quality remains with the supplier. NGOs/recipients accept food at their discretion.</li>
                  <li><strong>Right to Remove Listings:</strong> The platform reserves the right to remove any listing that violates safety or policy guidelines.</li>
                  <li><strong>Compliance with Local Regulations:</strong> You agree to follow applicable food safety and donation regulations.</li>
                </ol>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowTerms(false)}>Close &amp; Accept</Button>
              </div>
            </Card>
          </div>
        )}

        <div className="upload-sidebar">
          <Card className="why-card">
            <h3>💚 Why Donate?</h3>
            <ul className="why-list">
              <li>Reduce food waste & greenhouse gas emissions</li>
              <li>Directly feed people in your community</li>
              <li>Earn Kindness Score points & recognition</li>
              <li>Improve your organization's social impact</li>
              <li>Join 450+ verified donors on Aahar Setu</li>
            </ul>
          </Card>

          <Card className="impact-preview-card">
            <h4>📊 Your Estimated Impact</h4>
            <div className="impact-metrics">
              <div className="impact-metric">
                <span className="impact-val">~8</span>
                <span className="impact-lbl">Meals Created</span>
              </div>
              <div className="impact-metric">
                <span className="impact-val">~2.1kg</span>
                <span className="impact-lbl">CO₂ Saved</span>
              </div>
              <div className="impact-metric">
                <span className="impact-val">+10</span>
                <span className="impact-lbl">Kindness Pts</span>
              </div>
            </div>
          </Card>

          <Card className="volunteer-card">
            <h4>🚚 Need Pickup Help?</h4>
            <p>We can connect you with nearby volunteers or delivery partners for hassle-free pickup.</p>
            <Button variant="outline" size="sm" onClick={() => alert('Broadcasting request to local volunteer network...')}>Request Volunteer</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
