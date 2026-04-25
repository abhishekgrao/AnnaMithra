import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import {
  Bike, Package, CheckCircle2, Clock, MapPin, Navigation,
  Star, Phone, AlertTriangle, Trophy, Zap,
  ChevronRight, ThumbsUp, Route
} from 'lucide-react';
import './Dashboard.css';

// Hardcoded active orders for hackathon demo
const MOCK_ACTIVE_ORDERS = [
  {
    id: 'ord-001',
    foodItem: 'Paneer Butter Masala',
    quantity: '15 portions',
    rescuePartner: "Haldiram's",
    servePartner: 'Akshaya Patra Foundation',
    pickupAddress: '42/3, MG Road, Mysuru',
    dropoffAddress: 'Akshaya Patra Kitchen, Vijayanagar, Mysuru',
    pickupLat: 12.3396,
    pickupLng: 76.6201,
    status: 'in_transit',
    estimatedTime: '18 mins',
    distance: '3.2 km',
    urgency: 'high',
    assignedAt: '10:15 AM',
    expiresIn: '45 mins',
  },
];

const MOCK_COMPLETED_ORDERS = [
  {
    id: 'ord-100',
    foodItem: 'Assorted Pastries',
    quantity: '20 items',
    rescuePartner: 'Baskin & Scones',
    servePartner: 'Hope NGO',
    distance: '1.8 km',
    completedAt: '25 Apr, 9:42 AM',
    rating: 5,
    kindnessPoints: 25,
    timeTaken: '22 mins',
  },
  {
    id: 'ord-101',
    foodItem: 'Fresh Bread Loaves',
    quantity: '30 loaves',
    rescuePartner: 'Vishal Mega Mart',
    servePartner: 'Smile Foundation',
    distance: '2.1 km',
    completedAt: '24 Apr, 6:15 PM',
    rating: 4,
    kindnessPoints: 20,
    timeTaken: '28 mins',
  },
  {
    id: 'ord-102',
    foodItem: 'Veg Dum Biryani',
    quantity: '10 kg',
    rescuePartner: 'Taj Hotel',
    servePartner: 'Helping Hands Trust',
    distance: '4.5 km',
    completedAt: '24 Apr, 1:30 PM',
    rating: 5,
    kindnessPoints: 35,
    timeTaken: '35 mins',
  },
  {
    id: 'ord-103',
    foodItem: 'Fruit Platters',
    quantity: '8 trays',
    rescuePartner: 'Grand Mercure',
    servePartner: 'City Shelter B',
    distance: '1.2 km',
    completedAt: '23 Apr, 11:00 AM',
    rating: 5,
    kindnessPoints: 15,
    timeTaken: '14 mins',
  },
];

// Pending pickups that can be accepted
const MOCK_PENDING_PICKUPS = [
  {
    id: 'pnd-001',
    foodItem: 'KFC Fried Chicken Bucket',
    quantity: '5 buckets',
    rescuePartner: 'KFC MG Road',
    pickupAddress: 'KFC, MG Road, Mysuru',
    distance: '1.5 km',
    expiresIn: '30 mins',
    urgency: 'high',
    reward: 30,
  },
  {
    id: 'pnd-002',
    foodItem: 'Italian Pasta Selection',
    quantity: '12 portions',
    rescuePartner: 'Loyal World',
    pickupAddress: 'Loyal World Mall, Mysuru',
    distance: '2.8 km',
    expiresIn: '1.5 hrs',
    urgency: 'medium',
    reward: 20,
  },
  {
    id: 'pnd-003',
    foodItem: 'Vada Pav & Garlic Bread',
    quantity: '25 pieces',
    rescuePartner: "King's Coffee",
    pickupAddress: "King's Coffee, Saraswathipuram",
    distance: '0.8 km',
    expiresIn: '20 mins',
    urgency: 'critical',
    reward: 40,
  },
];

export const MithraDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');
  const [activeOrders, setActiveOrders] = useState(MOCK_ACTIVE_ORDERS);
  const [pendingPickups, setPendingPickups] = useState(MOCK_PENDING_PICKUPS);
  const [completedOrders] = useState(MOCK_COMPLETED_ORDERS);

  const totalKindness = completedOrders.reduce((sum, o) => sum + o.kindnessPoints, 0);
  const totalDeliveries = completedOrders.length;
  const avgRating = (completedOrders.reduce((sum, o) => sum + o.rating, 0) / completedOrders.length).toFixed(1);
  const totalKmSaved = completedOrders.reduce((sum, o) => sum + parseFloat(o.distance), 0).toFixed(1);

  const handleAcceptPickup = (id: string) => {
    const pickup = pendingPickups.find(p => p.id === id);
    if (!pickup) return;

    // Move to active
    const newActive = {
      id: pickup.id,
      foodItem: pickup.foodItem,
      quantity: pickup.quantity,
      rescuePartner: pickup.rescuePartner,
      servePartner: 'Auto-Assigned NGO',
      pickupAddress: pickup.pickupAddress,
      dropoffAddress: 'Nearest Serve Partner',
      pickupLat: 12.3396,
      pickupLng: 76.6201,
      status: 'accepted' as const,
      estimatedTime: '~15 mins',
      distance: pickup.distance,
      urgency: pickup.urgency,
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresIn: pickup.expiresIn,
    };

    setActiveOrders(prev => [...prev, newActive]);
    setPendingPickups(prev => prev.filter(p => p.id !== id));
    setActiveTab('active');
    alert(`Pickup accepted! Head to ${pickup.pickupAddress} now.`);
  };

  const handleCompleteOrder = (id: string) => {
    setActiveOrders(prev => prev.filter(o => o.id !== id));
    alert('🎉 Order delivered! +25 Kindness Points earned.');
  };

  const stats = [
    { label: 'Deliveries Done', value: totalDeliveries.toString(), icon: <Package size={22} />, color: '#4F633D', trend: '+3 this week' },
    { label: 'Kindness Points', value: totalKindness.toString(), icon: <Trophy size={22} />, color: '#6B8E23', trend: '+45 pts' },
    { label: 'Avg Rating', value: `${avgRating}★`, icon: <Star size={22} />, color: '#f59e0b', trend: 'Top 10%' },
    { label: 'KM Covered', value: `${totalKmSaved}`, icon: <Route size={22} />, color: '#0ea5e9', trend: 'This month' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Mithra <span className="gradient-text">Dashboard</span></h1>
          <p className="page-subtitle">Volunteer delivery hub — pick up, deliver, earn kindness.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(79, 99, 61, 0.1)',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Bike size={18} /> Online & Ready
          </div>
        </div>
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

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginTop: '24px',
        marginBottom: '20px',
        background: 'rgba(0,0,0,0.03)',
        borderRadius: '16px',
        padding: '4px',
      }}>
        {[
          { key: 'active' as const, label: `Active (${activeOrders.length})`, icon: <Zap size={16} /> },
          { key: 'pending' as const, label: `Nearby Pickups (${pendingPickups.length})`, icon: <AlertTriangle size={16} /> },
          { key: 'completed' as const, label: `Completed (${completedOrders.length})`, icon: <CheckCircle2 size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.key ? 'white' : 'var(--color-text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active Orders */}
      {activeTab === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeOrders.length === 0 ? (
            <Card style={{ padding: '48px', textAlign: 'center' }}>
              <Bike size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px', color: 'var(--color-text-muted)' }}>No Active Deliveries</h3>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Check <strong>Nearby Pickups</strong> to accept a delivery request!
              </p>
            </Card>
          ) : (
            activeOrders.map(order => (
              <Card key={order.id} style={{ padding: '0', overflow: 'hidden' }}>
                {/* Urgency Banner */}
                <div style={{
                  padding: '10px 20px',
                  background: order.urgency === 'high' || order.urgency === 'critical'
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={16} />
                    {order.urgency === 'critical' ? 'CRITICAL — Expires Soon!' : order.urgency === 'high' ? 'HIGH URGENCY' : 'ACTIVE DELIVERY'}
                  </span>
                  <span>⏱ {order.expiresIn} left</span>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Food Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>{order.foodItem}</h3>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{order.quantity}</p>
                    </div>
                    <span style={{
                      padding: '6px 14px',
                      background: order.status === 'in_transit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: order.status === 'in_transit' ? '#22c55e' : '#3b82f6',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      {order.status === 'in_transit' ? '🚴 In Transit' : '✅ Accepted'}
                    </span>
                  </div>

                  {/* Route Info */}
                  <div style={{
                    background: 'rgba(79, 99, 61, 0.04)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pickup From</div>
                        <div style={{ fontWeight: 600 }}>{order.rescuePartner}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.pickupAddress}</div>
                      </div>
                    </div>
                    <div style={{ borderLeft: '2px dashed rgba(0,0,0,0.1)', marginLeft: '15px', height: '20px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Navigation size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Deliver To</div>
                        <div style={{ fontWeight: 600 }}>{order.servePartner}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.dropoffAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Chips */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Route size={14} /> {order.distance}
                    </div>
                    <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> ETA: {order.estimatedTime}
                    </div>
                    <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} /> Assigned: {order.assignedAt}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`, '_blank')}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '14px',
                        border: '1.5px solid rgba(79, 99, 61, 0.3)', background: 'transparent',
                        color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Navigation size={18} /> Navigate
                    </button>
                    <button
                      style={{
                        flex: 1, padding: '14px', borderRadius: '14px',
                        border: 'none',
                        background: 'rgba(0,0,0,0.04)',
                        color: 'var(--color-text)', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Phone size={18} /> Call Rescue
                    </button>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '14px',
                        border: 'none', background: 'var(--color-primary)', color: 'white',
                        fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <CheckCircle2 size={18} /> Delivered
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pending / Nearby Pickups */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              These pickups are near <strong>Vidyavardhaka College</strong>. Accept one to start earning!
            </p>
          </div>
          {pendingPickups.map(pickup => (
            <Card key={pickup.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>{pickup.foodItem}</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {pickup.quantity} • from <strong>{pickup.rescuePartner}</strong>
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: pickup.urgency === 'critical' ? 'rgba(239, 68, 68, 0.1)' : pickup.urgency === 'high' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  color: pickup.urgency === 'critical' ? '#ef4444' : pickup.urgency === 'high' ? '#f59e0b' : '#3b82f6',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}>
                  {pickup.urgency}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {pickup.distance}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Expires: {pickup.expiresIn}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Trophy size={14} /> +{pickup.reward} pts</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAcceptPickup(pickup.id)}
                  style={{
                    flex: 2, padding: '14px', borderRadius: '14px',
                    border: 'none', background: 'var(--color-primary)', color: 'white',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <Bike size={18} /> Accept Pickup
                </button>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.pickupAddress)}`, '_blank')}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px',
                    border: '1.5px solid rgba(79, 99, 61, 0.3)', background: 'transparent',
                    color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <Navigation size={16} /> View
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Orders */}
      {activeTab === 'completed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {completedOrders.map(order => (
            <Card key={order.id} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{order.foodItem}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                    {'★'.repeat(order.rating)}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {order.quantity} • {order.rescuePartner} → {order.servePartner}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {order.timeTaken}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Route size={12} /> {order.distance}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B8E23', fontWeight: 700 }}>
                    <Trophy size={12} /> +{order.kindnessPoints} pts
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {order.completedAt}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--color-text-muted)' }} />
            </Card>
          ))}

          {/* Summary Card */}
          <Card style={{
            padding: '24px',
            background: 'rgba(79, 99, 61, 0.04)',
            border: '1px dashed rgba(79, 99, 61, 0.2)',
            textAlign: 'center',
          }}>
            <ThumbsUp size={32} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 4px', color: 'var(--color-primary)' }}>
              {totalDeliveries} Deliveries Complete
            </h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              You've covered {totalKmSaved} km and earned {totalKindness} Kindness Points this month.
              Keep going, Mithra! 💚
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
