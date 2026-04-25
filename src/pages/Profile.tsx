import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  User, ShieldCheck, MapPin, Camera,
  Award, TrendingUp, History, Star,
  Info, CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LeafletMap } from '../components/ui/LeafletMap';
import './Profile.css';

export const Profile: React.FC = () => {
  const [trustScore, setTrustScore] = useState(88);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // Badge added as requested
  const [verifyForm, setVerifyForm] = useState({
    section8: '',
    pan: '',
    aadhar: '',
    address: '',
    section12a: '',
    section80g: ''
  });
  const [verificationPhoto, setVerificationPhoto] = useState<File | null>(null);
  const [verificationPhotoUrl, setVerificationPhotoUrl] = useState<string | null>(null);
  const [verificationLocation, setVerificationLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showStatus = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const userType = localStorage.getItem('userType') || 'donor';
  const isDonor = userType === 'donor' || userType === 'shop' || userType === 'vendor';
  const isMithra = userType === 'mithra';
  const userAnnaMithraId = localStorage.getItem('annaMithraId') || 'AM-7742';
  const userName = isMithra ? 'Volunteer Mithra' : (isDonor ? 'Haldiram\'s' : 'Akshaya Patra');

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          section_8: verifyForm.section8,
          pan: verifyForm.pan,
          aadhar: verifyForm.aadhar,
          office_address: verifyForm.address,
          section_12a: verifyForm.section12a,
          section_80g: verifyForm.section80g,
          is_verified: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert("Success! Your verification docs are now live in the database for judicial review. Trust Score updated! 🚀");
      setIsVerified(true);
      setTrustScore(98);
      setShowVerifyModal(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationPhoto && !verificationLocation) {
      showStatus('Please take a photo and get live location first!', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // For the hackathon, we'll use a simulated image URL or base64 if we want to save to DB
      // But user just said "let it show in supabase", so I'll insert a record
      const { error } = await supabase
        .from('contribution_verifications')
        .insert([
          {
            user_id: user.id,
            image_url: verificationPhotoUrl || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80',
            latitude: verificationLocation?.lat || 12.3396,
            longitude: verificationLocation?.lng || 76.6201,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      showStatus('Proof submitted! AI analysis in progress... Your trust score will update shortly.', 'success');
      setTrustScore(prev => Math.min(prev + 2, 100));
      setVerificationPhoto(null);
      setVerificationPhotoUrl(null);
      setVerificationLocation(null);
    } catch (err: any) {
      showStatus('Error submitting verification: ' + err.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationPhoto(file);
      const url = URL.createObjectURL(file);
      setVerificationPhotoUrl(url);
      showStatus('Photo captured successfully!', 'success');
    }
  };

  const handleLiveLocation = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // Hardcoded VVCE coordinates as requested
      setVerificationLocation({ lat: 12.3396, lng: 76.6201 });
      setIsCapturing(false);
      showStatus('Location pinned: Vidyavardhaka College of Engineering', 'success');
    }, 1000);
  };

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Left Column: User Overview */}
        <div className="profile-main">
          <Card className="user-hero-card">
            <div className="user-avatar-wrap">
              <div className="user-avatar"><User size={40} /></div>
              <div className="user-status-badge">Verified Partner</div>
            </div>
            <div className="user-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ margin: 0 }}>{userName}</h1>
                {isVerified && (
                  <div className="verified-badge-premium" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4F633D', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <ShieldCheck size={12} /> {isMithra ? 'Verified Mithra' : (isDonor ? 'Verified Rescue Partner' : 'Verified Serve Partner')}
                  </div>
                )}
              </div>
              <div className="user-id-badge">
                <ShieldCheck size={16} />
                <span>ID: {userAnnaMithraId}</span>
              </div>
              <p>Registered as a Platinum Partner since April 2025</p>
              <Button size="sm" variant="outline" style={{ marginTop: '10px' }} onClick={() => setShowVerifyModal(true)}>
                {isMithra ? 'Mithra ID & Docs' : (isDonor ? 'Rescue Compliance Docs' : (isVerified ? 'Manage Verification Docs' : 'Apply for Official Verification'))}
              </Button>
            </div>
          </Card>

          <Card className="trust-score-card">
            <div className="trust-header">
              <div className="trust-title-wrap">
                <h3>AI Trust Score</h3>
                <p>Based on successful donations & verification history</p>
              </div>
              <div className="trust-percentage">{trustScore}%</div>
            </div>
            <div className="trust-progress-bg">
              <div className="trust-progress-fill" style={{ width: `${trustScore}%` }}></div>
            </div>
            <div className="trust-levels">
              <span>Rookie</span>
              <span>Trusted</span>
              <span>Champion</span>
            </div>
          </Card>

          <Card className="verification-card">
            <h3><Camera size={20} /> Verify New Contribution</h3>
            <p>Upload a photo of the food and current location to boost your trust score immediately.</p>

            {statusMsg && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeIn 0.3s ease',
                background: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                color: statusMsg.type === 'success' ? '#16a34a' : statusMsg.type === 'error' ? '#dc2626' : '#2563eb',
                border: `1px solid ${statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              }}>
                {statusMsg.type === 'success' ? <CheckCircle size={18} /> : statusMsg.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
                {statusMsg.text}
              </div>
            )}
            <div className="verification-upload-zone">
              <input 
                type="file" 
                id="verification-photo-input" 
                accept="image/*" 
                capture="environment" 
                style={{ display: 'none' }} 
                onChange={handlePhotoChange}
              />
              <div className="upload-btn-wrap">
                <Button 
                  variant="outline" 
                  className={`vbtn ${verificationPhoto ? 'active' : ''}`}
                  onClick={() => document.getElementById('verification-photo-input')?.click()}
                  style={verificationPhoto ? { borderColor: 'var(--color-primary)', background: 'rgba(79, 99, 61, 0.1)' } : {}}
                >
                  <Camera size={18} /> {verificationPhoto ? 'Photo Taken' : 'Take Photo'}
                </Button>
                <Button 
                  variant="outline" 
                  className={`vbtn ${verificationLocation ? 'active' : ''}`}
                  onClick={handleLiveLocation}
                  disabled={isCapturing}
                  style={verificationLocation ? { borderColor: 'var(--color-primary)', background: 'rgba(79, 99, 61, 0.1)' } : {}}
                >
                  <MapPin size={18} /> {isCapturing ? 'Locating...' : (verificationLocation ? 'VVCE Pinned' : 'Live Location')}
                </Button>
              </div>
              {verificationPhotoUrl && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <img src={verificationPhotoUrl} alt="Preview" style={{ width: '100%', maxHeight: '200px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--color-primary)' }} />
                </div>
              )}

              {verificationLocation && (
                <div style={{ marginTop: '16px' }}>
                  <LeafletMap 
                    location="Vidyavardhaka College of Engineering" 
                    lat={verificationLocation.lat} 
                    lng={verificationLocation.lng} 
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '-8px' }}>
                    Pinned: {verificationLocation.lat.toFixed(4)}, {verificationLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
            <Button fullWidth onClick={handleVerification} disabled={isVerifying || (!verificationPhoto && !verificationLocation)}>
              {isVerifying ? 'Analyzing Proof...' : 'Submit Evidence for AI Audit'}
            </Button>
          </Card>
        </div>

        {/* Right Column: Stats & History */}
        <div className="profile-sidebar">
          <Card className="impact-summary-card">
            <h3>Impact Summary</h3>
            <div className="impact-grid">
              <div className="impact-item">
                <Award size={24} className="impact-icon blue" />
                <div className="impact-val">124</div>
                <div className="impact-label">Meals Provided</div>
              </div>
              <div className="impact-item">
                <TrendingUp size={24} className="impact-icon green" />
                <div className="impact-val">4.2t</div>
                <div className="impact-label">CO2 Saved</div>
              </div>
              <div className="impact-item">
                <Star size={24} className="impact-icon yellow" />
                <div className="impact-val">12k</div>
                <div className="impact-label">Kindness Pts</div>
              </div>
            </div>
          </Card>

          <Card className="history-card">
            <h3><History size={20} /> Recent Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot success"></div>
                <div className="timeline-content">
                  <p><strong>15th Apr:</strong> Rescued 5kg rice. <span className="verified-link">Proof Verified ✓</span></p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot success"></div>
                <div className="timeline-content">
                  <p><strong>12th Apr:</strong> Fed 20 people in Bengaluru.</p>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p><strong>Pending:</strong> 10 Meals of Samosa for Verification.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="trust-info-card">
            <Info size={20} className="info-icon" />
            <p>Your Trust Score is visible to all NGOs. Higher scores ensure your donations are claimed 3x faster by primary partners.</p>
          </Card>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <Card className="glass" style={{ maxWidth: '500px', width: '90%', padding: '32px', position: 'relative', background: 'white' }}>
            <h2 style={{ marginBottom: '8px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={24} /> {isDonor ? 'Rescue Partner Verification' : 'Serve Partner Verification'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              {isDonor
                ? 'Submit your business credentials to unlock the Rescue badge and gain community trust.'
                : 'Submit your official documents to unlock high-priority claims and tax benefits.'}
            </p>

            <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Section 8 License No.</label>
                  <input required placeholder="SEC8-XXXXX" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} value={verifyForm.section8} onChange={e => setVerifyForm({ ...verifyForm, section8: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>PAN Number</label>
                  <input required placeholder="ABCDE1234F" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} value={verifyForm.pan} onChange={e => setVerifyForm({ ...verifyForm, pan: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Aadhar Number (Admin)</label>
                <input required placeholder="XXXX-XXXX-XXXX" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} value={verifyForm.aadhar} onChange={e => setVerifyForm({ ...verifyForm, aadhar: e.target.value })} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Office Address</label>
                <textarea required placeholder="Full registered address..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', height: '80px' }} value={verifyForm.address} onChange={e => setVerifyForm({ ...verifyForm, address: e.target.value })} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(79, 99, 61, 0.05)', borderRadius: '12px', border: '1px dashed var(--color-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Section 12A Registration</label>
                    <span style={{ fontSize: '0.6rem', color: 'var(--color-primary)', fontWeight: 800 }}>✨ 0 Tax</span>
                  </div>
                  <input placeholder="Registration No. (Optional)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontSize: '0.85rem' }} value={verifyForm.section12a} onChange={e => setVerifyForm({ ...verifyForm, section12a: e.target.value })} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(79, 99, 61, 0.05)', borderRadius: '12px', border: '1px dashed var(--color-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>80G Certificate</label>
                    <span style={{ fontSize: '0.6rem', color: 'var(--color-primary)', fontWeight: 800 }}>🎁 Donor Perk</span>
                  </div>
                  <input placeholder="80G Certificate No. (Optional)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', fontSize: '0.85rem' }} value={verifyForm.section80g} onChange={e => setVerifyForm({ ...verifyForm, section80g: e.target.value })} />
                </div>
              </div>
              <p style={{ margin: '0', fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                12A saves you tax. 80G ensures <strong>Donors get tax benefit!</strong>
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowVerifyModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.05)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isVerifying} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(79,99,61,0.3)', opacity: isVerifying ? 0.7 : 1 }}>
                  {isVerifying ? 'Saving to Database...' : 'Submit to Supabase'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
