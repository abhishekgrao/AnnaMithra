import React from 'react';
import { Card } from '../components/ui/Card';
import { BarChart3, TrendingDown, Package, CheckCircle2, Leaf, Zap, Trophy, MapPin, RefreshCw } from 'lucide-react';
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

const HEATMAP_ZONES = [
  { name: 'Koramangala', waste: 85, demand: 30, type: 'surplus' },
  { name: 'Indiranagar', waste: 70, demand: 45, type: 'surplus' },
  { name: 'BTM Layout', waste: 20, demand: 90, type: 'demand' },
  { name: 'Jayanagar', waste: 30, demand: 80, type: 'demand' },
  { name: 'Whitefield', waste: 65, demand: 55, type: 'balanced' },
  { name: 'Hebbal', waste: 10, demand: 95, type: 'demand' },
];

export const NgoDashboard: React.FC = () => {
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
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Items Donated</p>
                <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--color-primary)' }}>1,204</h3>
              </div>
              <button className="nav-login-btn" style={{ position: 'static', margin: 0, background: 'var(--color-secondary)' }}>
                ⬇️ Download Receipt
              </button>
            </div>

            <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Past History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🍱</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>50 Meals Distributed</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Yesterday • ID: #4829</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>Completed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🥦</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>20kg Fresh Produce</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>3 Days Ago • ID: #4801</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>Completed</span>
              </div>
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
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--color-primary)' }}>
            <Package size={24} /> Current Order
          </h3>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
            No orders on the way. Select from the <strong style={{ color: 'var(--color-primary)' }}>"Explore"</strong> tab to order!
          </p>
        </div>
        
        <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.05)', maxWidth: '400px' }} />

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#f59e0b' }}>
            <Zap size={24} /> Listings Status
          </h3>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
            No orders sold right now. Go to <strong style={{ color: '#f59e0b' }}>"Donate"</strong> to add your listing!
          </p>
        </div>
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
