import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  User, ShieldCheck, MapPin, Camera, 
  Award, TrendingUp, History, Star,
  Info
} from 'lucide-react';
import './Profile.css';

export const Profile: React.FC = () => {
  const [trustScore, setTrustScore] = useState(88);
  const [isVerifying, setIsVerifying] = useState(false);
  const userAaharaId = localStorage.getItem('aaharaId') || 'AS-7742';
  const userName = localStorage.getItem('userType') === 'donor' ? 'Haldiram\'s' : 'Akshaya Patra';

  const handleVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      alert('Proof submitted! AI analysis in progress...');
      setIsVerifying(false);
      setTrustScore(prev => Math.min(prev + 2, 100));
    }, 2000);
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
              <h1>{userName}</h1>
              <div className="user-id-badge">
                <ShieldCheck size={16} />
                <span>ID: {userAaharaId}</span>
              </div>
              <p>Registered as a Platinum Donor since April 2025</p>
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
            <div className="verification-upload-zone">
              <div className="upload-btn-wrap">
                <Button variant="outline" className="vbtn">
                  <Camera size={18} /> Take Photo
                </Button>
                <Button variant="outline" className="vbtn">
                  <MapPin size={18} /> Live Location
                </Button>
              </div>
            </div>
            <Button fullWidth onClick={handleVerification} disabled={isVerifying}>
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
    </div>
  );
};
