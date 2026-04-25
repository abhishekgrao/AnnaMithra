import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Heart, Leaf, Truck, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './HeroJourney.css';

export const HeroJourney: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phase = parseInt(entry.target.getAttribute('data-phase') || '0');
            setActivePhase(phase);
          }
        });
      },
      { threshold: 0.5 }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToLogin = () => {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-journey-wrapper">
      {/* Background Pulse Effect */}
      <div className={`journey-bg phase-${activePhase}`}>
        <div className="bg-gradient-overlay"></div>
      </div>

      {/* Phase 1: The Problem */}
      <section 
        className="journey-section" 
        data-phase="0" 
        ref={(el) => (observerRefs.current[0] = el)}
      >
        <div className="journey-content">
          <div className="journey-eyebrow">The Crisis</div>
          <h1 className="journey-title">
            1.3 Billion Tons <br />
            <span className="fade-text">of food wasted annually.</span>
          </h1>
          <p className="journey-subtitle">
            While millions go hungry, perfectly good food ends up in landfills. 
            We're here to change the narrative.
          </p>
          <div className="scroll-indicator" onClick={() => observerRefs.current[1]?.scrollIntoView({ behavior: 'smooth' })}>
            <span>The Solution</span>
            <ChevronDown className="bounce" />
          </div>
        </div>
      </section>

      {/* Phase 2: The Bridge */}
      <section 
        className="journey-section" 
        data-phase="1" 
        ref={(el) => (observerRefs.current[1] = el)}
      >
        <div className="journey-content">
          <div className="journey-eyebrow">The Solution</div>
          <h1 className="journey-title">
            Anna<span className="gradient-text">Mithra</span> <br />
            <span className="pulse-text">Bridges the gap.</span>
          </h1>
          <div className="pulse-visual">
            <div className="pulse-node rescue">
              <Leaf size={32} />
              <span>Rescue</span>
            </div>
            <div className="pulse-line">
              <div className="pulse-dot"></div>
            </div>
            <div className="pulse-node deliver">
              <Truck size={32} />
              <span>Mithra</span>
            </div>
            <div className="pulse-line">
              <div className="pulse-dot delay"></div>
            </div>
            <div className="pulse-node serve">
              <Heart size={32} />
              <span>Serve</span>
            </div>
          </div>
          <p className="journey-subtitle">
            Real-time, urgency-based matching that turns surplus into survival 
            in under 30 minutes.
          </p>
        </div>
      </section>

      {/* Phase 3: The Call */}
      <section 
        className="journey-section" 
        data-phase="2" 
        ref={(el) => (observerRefs.current[2] = el)}
      >
        <div className="journey-content">
          <div className="journey-eyebrow">The Impact</div>
          <h1 className="journey-title">
            From Surplus <br />
            <span className="gradient-text">to Survival.</span>
          </h1>
          <div className="impact-grid">
            <div className="impact-card">
              <Zap size={24} className="icon" />
              <h3>Real-Time</h3>
              <p>Instant alerts for priority pickups.</p>
            </div>
            <div className="impact-card">
              <ShieldCheck size={24} className="icon" />
              <h3>Verified</h3>
              <p>AI-audited food safety protocols.</p>
            </div>
          </div>
          <div className="hero-actions">
            <button className="cta-btn primary" onClick={scrollToLogin}>
              Join the Mission <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Quick Link to Login */}
      <button className="skip-journey" onClick={scrollToLogin}>
        Skip to Login
      </button>
    </div>
  );
};
