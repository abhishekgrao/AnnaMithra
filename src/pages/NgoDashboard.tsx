import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart3, TrendingDown, Package, CheckCircle2, Zap, Trophy, MapPin, RefreshCw, Clock, ExternalLink, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const WEEKLY_DATA = [
  { day: 'Mon', meals: 45, kg: 22 },
  { day: 'Tue', meals: 72, kg: 36 },
  { day: 'Wed', meals: 38, kg: 19 },
  { day: 'Thu', meals: 95, kg: 48 },
  { day: 'Fri', meals: 81, kg: 40 },
  { day: 'Sat', meals: 110, kg: 55 },
  { day: 'Sun', meals: 67, kg: 33 },
];
const MAX_MEALS = Math.max(...WEEKLY_DATA.map(d => d.meals));

export const NgoDashboard: React.FC = () => {
  const [claimedListings, setClaimedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const fetchMyClaims = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('claimed_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setClaimedListings(data);
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (item: any) => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const receiptContent = `
ANNA MITHRA - SURPLUS FOOD REDISTRIBUTION RECEIPT
------------------------------------------------
Date: ${today}
Receipt ID: AM-${item.id.substring(0, 8).toUpperCase()}

DONATION DETAILS:
Item Name: ${item.title}
Quantity: ${item.quantity}
Source: ${item.source || 'Local Donor'}
Category: ${item.category || 'General'}

NUTRITION INFO:
Calories: ${item.calories || 'N/A'} kcal
Protein: ${item.protein || 'N/A'}g
Carbs: ${item.carbs || 'N/A'}g
Fat: ${item.fat || 'N/A'}g

STATUS: CLAIMED & VERIFIED
------------------------------------------------
Thank you for contributing to a zero-waste future!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnnaMithra_Receipt_${item.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Food Saved', value: '452 kg', icon: <Package size={22} />, color: '#4F633D', trend: '+12%' },
    { label: 'Meals Distributed', value: '1,280', icon: <BarChart3 size={22} />, color: '#8BA194', trend: '+8%' },
    { label: 'Deliveries Received', value: '320', icon: <MapPin size={22} />, color: '#0ea5e9', trend: '+15%' },
    { label: 'Deliveries Sent', value: '45', icon: <CheckCircle2 size={22} />, color: '#f59e0b', trend: '+2%' },
    { label: 'Waste Reduced', value: '32%', icon: <TrendingDown size={22} />, color: '#3b82f6', trend: '+5%' },
    { label: 'Kindness Score', value: '210 pts', icon: <Trophy size={22} />, color: '#a855f7', trend: '+10' },
  ];

  const flowSteps = [
    { name: 'Upload', status: 'completed', count: 28 },
    { name: 'Match', status: 'completed', count: 26 },
    { name: 'Claim', status: 'active', count: 24 },
    { name: 'Pickup', status: 'pending', count: 22 },
    { name: 'Feedback', status: 'pending', count: 0 },
  ];

  const recentActivity = [
    { icon: '✅', text: 'Assorted Pastries claimed by Hope NGO', time: '5 mins ago', type: 'success' },
    { icon: '⚡', text: 'High priority: Paneer Tikka expiring in 45 mins', time: '10 mins ago', type: 'urgent' },
    { icon: '🔄', text: 'Auto-redistribution: Fruit Platters re-routed to Shelter B', time: '1 hr ago', type: 'fallback' },
    { icon: '🚚', text: 'Volunteer pickup confirmed for Biryani', time: '2 hrs ago', type: 'success' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">NGO <span className="gradient-text">Dashboard</span></h1>
        <p className="page-subtitle">Real-time analytics for your contribution to the circular food economy.</p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {stats.map((stat, i) => (
          <Card key={i} className="kpi-card">
            <div className="kpi-icon-row">
              <div className="kpi-icon" style={{ background: stat.color + '18', color: stat.color }}>
                {stat.icon}
              </div>
              <span className="kpi-trend" style={{ color: stat.color }}>↑ {stat.trend}</span>
            </div>
            <div className="kpi-value">{stat.value}</div>
            <div className="kpi-label">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Chart + Flow */}
      <div className="dashboard-main-row">
        <Card className="chart-card">
          <div className="chart-header">
            <h3>Weekly Redistribution</h3>
            <span className="tag-badge">Last 7 Days</span>
          </div>
          <div className="bar-chart">
            {WEEKLY_DATA.map((d, i) => (
              <div key={i} className="bar-col">
                <div className="bar-tooltip">{d.meals} meals</div>
                <div
                  className="chart-bar"
                  style={{ height: `${(d.meals / MAX_MEALS) * 100}%` }}
                />
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flow-tracker-card">
          <h3>System Flow Tracker</h3>
          <p className="card-desc">Active redistribution status</p>
          <div className="flow-tracker">
            {flowSteps.map((step, i) => (
              <div key={step.name} className="flow-track-step">
                <div className={`flow-track-circle ${step.status}`}>
                  {step.status === 'completed' ? <CheckCircle2 size={16} /> :
                    step.status === 'active' ? <Zap size={16} /> : i + 1}
                </div>
                <div className="flow-track-info">
                  <span className="flow-track-name">{step.name}</span>
                  {step.count > 0 && <span className="flow-track-count">{step.count} items</span>}
                </div>
                {i < flowSteps.length - 1 && (
                  <div className={`flow-track-line ${step.status === 'completed' ? 'filled' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flow-active-info glass">
            <Zap size={14} />
            <span><strong>Active:</strong> NGO claiming "Assorted Pastries" from Baskin &amp; Scones.</span>
          </div>
        </Card>
      </div>

      {/* NGO Impact & Log Section (Replaced Heatmap) */}
      <div className="dashboard-main-row" style={{ marginTop: '24px' }}>

        <Card className="donation-log-card">
          <div className="chart-header">
            <h3><Package size={18} /> Donation Log</h3>
            <span className="tag-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>Tax &amp; Trust</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Impact (Estimated)</p>
                <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--color-primary)' }}>1,204 Meals</h3>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                <Clock size={12} /> Today: {new Date().toLocaleDateString()}
              </div>
            </div>

            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Your Claim History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {claimedListings.length > 0 ? (
                claimedListings.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(79, 99, 61, 0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(79, 99, 61, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        {item.category?.includes('Grain') ? '🌾' : item.category?.includes('Bakery') ? '🍞' : item.category?.includes('Meal') ? '🍱' : '🍎'}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{item.title}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(item.created_at).toLocaleDateString()} • {item.quantity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadReceipt(item)}
                      style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} /> Receipt
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>No claim history yet.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="current-order-card" style={{ 
        marginTop: '24px', 
        background: 'var(--color-card-bg)', 
        border: '1px solid var(--color-primary-light)', 
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(79, 99, 61, 0.05)'
      }}>
        {claimedListings.filter(l => l.status === 'Claimed').length > 0 ? (
          <div style={{ width: '100%' }}>
             <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
              <Package size={24} /> Active Claims
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {claimedListings.filter(l => l.status === 'Claimed').map(order => (
                <div key={order.id} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>ON THE WAY</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: #{order.id.substring(0, 5)}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{order.title}</h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>From: <strong>{order.source}</strong></p>
                  
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Qty</div>
                      <div style={{ fontWeight: 700 }}>{order.quantity}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Expires</div>
                      <div style={{ fontWeight: 700, color: '#ef4444' }}>{order.expiry_days || 1}d</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.source)}`, '_blank')}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(79, 99, 61, 0.05)', color: 'var(--color-primary)', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <MapPin size={16} /> Navigate to Donor
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--color-primary)' }}>
              <Package size={24} /> Current Order
            </h3>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
              No orders on the way. Select from the <strong style={{ color: 'var(--color-primary)' }}>"Explore"</strong> tab to order!
            </p>
          </div>
        )}
      </Card>

      {/* Auto-Redistribution + Activity */}
      <div className="bottom-grid">
        <Card className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((act, i) => (
              <div key={i} className={`activity-item activity-${act.type}`}>
                <div className="activity-icon">{act.icon}</div>
                <div className="activity-body">
                  <p className="activity-text">{act.text}</p>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fallback-card">
          <div className="fallback-header">
            <RefreshCw size={18} />
            <h3>Auto Redistribution Stats</h3>
          </div>
          <p className="card-desc">Fallback system performance this week</p>
          <div className="fallback-stats">
            {[
              { label: 'Items Fallback-Triggered', val: '6' },
              { label: 'Shelters Notified', val: '12' },
              { label: 'Backup NGOs Alerted', val: '9' },
              { label: 'Recovery Rate', val: '91%' },
            ].map((s, i) => (
              <div key={i} className="fallback-stat">
                <div className="fallback-stat-val">{s.val}</div>
                <div className="fallback-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
