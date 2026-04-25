import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronUp, Heart, Leaf, Truck, ArrowRight, ShieldCheck, 
  Zap, Users, Target, Info, Globe, Smartphone 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import './Landing.css';

export const Landing: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsScrolled(scrolled > 50);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      
      setScrollProgress(progress);
      setShowScrollTop(scrolled > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
  return (
    <div className={`landing-page ${isScrolled ? 'scrolled' : ''}`}>
      {/* Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="badge animate-fade-in">🌱 The Future of Food Redistribution</div>
          <h1 className="hero-main-title">
            Connecting <span className="text-gradient">Surplus</span><br />
            To <span className="text-gradient">Survival</span>
          </h1>
          <p className="hero-lead">
            AnnaMithra is the intelligent bridge between abundance and urgency. 
            We turn waste into wellness with real-time matching and verified trust.
          </p>
          <div className="hero-actions">
            <Link to="/login">
              <Button size="lg" className="cta-primary">
                Get Started Now <ArrowRight size={20} />
              </Button>
            </Link>
            <Button variant="glass" size="lg" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>
        </div>
        <div className="hero-visual-cards">
          <div className="v-card v-1">
            <div className="v-icon">🍔</div>
            <div className="v-text">45 Meals Rescued</div>
            <div className="v-tag">Just Now</div>
          </div>
          <div className="v-card v-2">
            <div className="v-icon">NGO</div>
            <div className="v-text">Hope Shelter Claimed</div>
            <div className="v-tag">Matched</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-section about-grid">
        <div className="section-image">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" alt="Impact" className="rounded-image" />
          <div className="image-overlay-card">
            <Heart className="icon" />
            <h3>Our Mission</h3>
            <p>Zero hunger through zero waste.</p>
          </div>
        </div>
        <div className="section-text">
          <div className="section-eyebrow">
            <Info size={16} /> ABOUT ANNAMITHRA
          </div>
          <h2 className="section-title">A Digital Bridge for a <span className="text-gradient">Human Problem</span></h2>
          <p>
            AnnaMithra isn't just an app; it's a movement. Every year, massive amounts of edible food are discarded while communities struggle with hunger. 
            We use location-based technology to ensure that surplus food reaches a table, not a landfill.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <Zap size={20} />
              <span>Real-time urgency matching system</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} />
              <span>AI-verified safety and quality audits</span>
            </div>
            <div className="feature-item">
              <Globe size={20} />
              <span>Micro-logistics for hyper-local delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Text Reveal */}
      <section className="reveal-section">
        <div className="reveal-container">
          <h2 className="reveal-text">
            Every plate you rescue <br />
            is a life you <span className="highlight">sustain</span>.
          </h2>
        </div>
      </section>

      {/* Targeting Section */}
      <section className="landing-section dark-section">
        <div className="section-header text-center">
          <div className="section-eyebrow justify-center">
            <Target size={16} /> TARGET AUDIENCE
          </div>
          <h2 className="section-title white">Who is this <span className="text-gradient">for?</span></h2>
        </div>
        <div className="target-grid">
          <div className="target-card">
            <div className="card-icon rescue"><Leaf size={32} /></div>
            <h3>Rescue (Donors)</h3>
            <p>Restaurants, Hotels, and Caterers with surplus food. Reduce your footprint and get tax benefits while helping your community.</p>
          </div>
          <div className="target-card">
            <div className="card-icon serve"><Heart size={32} /></div>
            <h3>Serve (NGOs)</h3>
            <p>Shelters, Orphanages, and NGOs. Get instant alerts when quality food is available nearby for those you support.</p>
          </div>
          <div className="target-card">
            <div className="card-icon deliver"><Truck size={32} /></div>
            <h3>Mithra (Volunteers)</h3>
            <p>Individual delivery partners. Spend 20 minutes of your time to bridge the gap between surplus and survival.</p>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="landing-section goals-grid">
        <div className="section-text">
          <div className="section-eyebrow">
            <Globe size={16} /> OUR TARGETS
          </div>
          <h2 className="section-title">What are we <span className="text-gradient">Targeting?</span></h2>
          <div className="goal-cards">
            <div className="goal-mini">
              <h4>90% Waste Reduction</h4>
              <p>Targeting near-zero edible food waste in partner zones.</p>
            </div>
            <div className="goal-mini">
              <h4>15 Min Response Time</h4>
              <p>Matching surplus to a recipient in under 15 minutes.</p>
            </div>
            <div className="goal-mini">
              <h4>Verified Safety</h4>
              <p>100% safety compliance through AI verification.</p>
            </div>
          </div>
        </div>
        <div className="section-image">
          <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" alt="Target" className="rounded-image shadow-xl" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-final">
        <div className="cta-box">
          <h2 className="white">Ready to be the <span className="text-gradient">Change?</span></h2>
          <p>Join the AnnaMithra network today and start making an impact.</p>
          <div className="cta-btns">
            <Link to="/login"><Button size="lg" className="cta-primary">Join Now</Button></Link>
            <Link to="/login"><Button variant="glass" size="lg">I have Surplus</Button></Link>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <ChevronUp size={24} />
      </button>

      {/* Simple Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <img src="/annamithralogo.jpeg" alt="Logo" width={40} />
          <span>AnnaMithra</span>
        </div>
        <p>&copy; 2026 AnnaMithra. Connecting Surplus to Survival.</p>
      </footer>
    </div>
  );
};
