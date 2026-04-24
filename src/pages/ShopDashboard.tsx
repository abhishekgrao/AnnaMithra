import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Package, Clock, MapPin, Activity, FileText, Download, Plus, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import './Dashboard.css';

export const ShopDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [listingToCancel, setListingToCancel] = useState<string | null>(null);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMyListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  };

  const handleCancelClick = (id: string) => {
    setListingToCancel(id);
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!listingToCancel) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingToCancel)
        .select();

      if (error) throw error;
      
      // Update local state
      setMyListings(prev => prev.filter(item => item.id !== listingToCancel));
      setListingToCancel(null);
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert("Failed to cancel listing. Please try again.");
    }
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Tax Benefit Receipt - AnnaMithra</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; padding: 40px; color: #2a3520; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; } th { background: #f9f9f9; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1 style="color: #4F633D;">AnnaMithra - Official Donation Receipt</h1>');
      printWindow.document.write('<p><strong>Shop Name:</strong> Demo Bakery</p>');
      printWindow.document.write('<p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p>');
      printWindow.document.write('<p><strong>Total Donated This Month:</strong> 124 Items</p>');
      printWindow.document.write('<p><strong>Estimated Tax Benefit Eligible:</strong> ₹ 4,500</p>');
      printWindow.document.write('<h3>Recent Donations (Eligible for 80G Tax Benefits)</h3>');
      printWindow.document.write('<table><tr><th>Date</th><th>Food Donated</th><th>Quantity</th><th>NGO Name</th><th>Value (₹)</th></tr>');
      printWindow.document.write('<tr><td>Oct 12</td><td>Assorted Pastries</td><td>20 items</td><td>Hope NGO</td><td>₹ 800</td></tr>');
      printWindow.document.write('<tr><td>Oct 10</td><td>Fresh Bread</td><td>15 loaves</td><td>Smile Foundation</td><td>₹ 450</td></tr>');
      printWindow.document.write('<tr><td>Oct 08</td><td>Vegetable Curries</td><td>30 meals</td><td>Helping Hands</td><td>₹ 1,200</td></tr>');
      printWindow.document.write('</table>');
      printWindow.document.write('<p style="margin-top: 40px; font-size: 0.9em; color: #555;">This document serves as proof of donation for tax deduction purposes under applicable sections. AnnaMithra verified.</p>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownloadTerms = (dateStr: string) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Accepted Terms - AnnaMithra</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; padding: 40px; color: #2a3520; line-height: 1.6; } h1, h2 { color: #4F633D; } ol { padding-left: 20px; } li { margin-bottom: 12px; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>AnnaMithra - Signed Terms & Conditions</h1>');
      printWindow.document.write('<p><strong>Date Accepted:</strong> ' + dateStr + '</p>');
      printWindow.document.write('<h2>Surplus Food Listing – Terms & Conditions</h2>');
      printWindow.document.write('<ol>');
      printWindow.document.write('<li><strong>Food Safety Responsibility:</strong> You confirm that the listed food is safe for consumption at the time of listing and has been stored and handled according to basic hygiene standards.</li>');
      printWindow.document.write('<li><strong>Accurate Information:</strong> You will provide correct details including food type, quantity, preparation time, and estimated expiry.</li>');
      printWindow.document.write('<li><strong>No Expired or Unsafe Food:</strong> You will not list food that is spoiled, contaminated, or past safe consumption limits.</li>');
      printWindow.document.write('<li><strong>Timely Handover:</strong> You agree to hand over the food within the specified time window and in the condition described.</li>');
      printWindow.document.write('<li><strong>No Sale of Donated Food:</strong> Food listed as donation must be provided free of cost to NGOs or recipients through the platform.</li>');
      printWindow.document.write('<li><strong>Liability Limitation:</strong> AnnaMithra acts only as a connecting platform. The responsibility for food quality remains with the supplier. NGOs/recipients accept food at their discretion.</li>');
      printWindow.document.write('<li><strong>Right to Remove Listings:</strong> The platform reserves the right to remove any listing that violates safety or policy guidelines.</li>');
      printWindow.document.write('<li><strong>Compliance with Local Regulations:</strong> You agree to follow applicable food safety and donation regulations.</li>');
      printWindow.document.write('</ol>');
      printWindow.document.write('<br><p><em>Electronically verified by AnnaMithra Network.</em></p>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const activeListings = [
    { id: 'm1', name: 'Assorted Pastries', qty: '20 items', time: '45 mins', urgency: 85, status: 'Claimed', ngo: 'Hope NGO', dist: '1.2 km', demand: 'High', date: new Date().toLocaleDateString() },
    { id: 'm2', name: 'Fresh Bread', qty: '15 loaves', time: '3 hrs', urgency: 35, status: 'Available', ngo: null, dist: '0.8 km', demand: 'Medium', date: new Date().toLocaleDateString() }
  ];

  // Map supabase items to frontend structure
  const dynamicListings = myListings.map((d: any) => {
    const expDate = d.expiry_time ? new Date(d.expiry_time) : new Date(Date.now() + (d.expiry_days || 1) * 86400000);
    const now = new Date();
    const hoursLeft = Math.max(0, (expDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    const urgency = d.urgency_score || (hoursLeft < 2 ? 90 : hoursLeft < 6 ? 60 : 30);
    
    return {
      id: d.id,
      name: d.title,
      qty: d.quantity,
      time: hoursLeft < 1 ? `${Math.round(hoursLeft * 60)} mins` : `${Math.round(hoursLeft)} hrs`,
      urgency,
      status: d.status || 'Available',
      ngo: null,
      dist: '0.0 km (You)',
      demand: 'High',
      date: new Date(d.created_at).toLocaleDateString(),
      calories: d.calories,
      protein: d.protein,
      carbs: d.carbs,
      fat: d.fat,
      allergens: d.allergens
    };
  });

  const allListings = [...dynamicListings, ...activeListings];

  const donationHistory = [
    { date: 'Oct 12', food: 'Assorted Pastries', qty: '20 items', ngo: 'Hope NGO', value: '₹ 800' },
    { date: 'Oct 10', food: 'Fresh Bread', qty: '15 loaves', ngo: 'Smile Foundation', value: '₹ 450' },
    { date: 'Oct 08', food: 'Vegetable Curries', qty: '30 meals', ngo: 'Helping Hands', value: '₹ 1,200' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Shop <span className="gradient-text">Dashboard</span></h1>
          <p className="page-subtitle">Manage your surplus listings and track your social impact.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/upload')} className="nav-login-btn" style={{ position: 'relative', top: '0', right: '0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Plus size={18} />
            Add New Listing
          </button>
        </div>
      </div>

      {/* Active Surplus Listings */}
      <h2 style={{ marginTop: '16px', fontSize: '1.4rem' }}>Your Current Listings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {allListings.map((list) => (
          <Card key={list.id} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>{list.name}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{list.qty}</p>
              </div>
              <span className={`tag-badge`} style={{ background: list.status === 'Available' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: list.status === 'Available' ? '#22c55e' : '#3b82f6', border: 'none' }}>
                {list.status}
              </span>
            </div>

            {list.ngo && (
              <div style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.03)', padding: '10px 14px', borderRadius: '8px', color: 'var(--color-text)' }}>
                Claimed by: <strong>{list.ngo}</strong>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}><Clock size={14} /> {list.time} left</span>
                <span style={{ color: list.urgency > 50 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{list.urgency > 50 ? 'Urgent' : 'Expiring Soon'}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${list.urgency}%`, height: '100%', background: list.urgency > 50 ? '#ef4444' : '#f59e0b' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {list.dist}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> {list.demand} Demand</span>
            </div>

            {/* Nutrition Facts in Dashboard */}
            {list.calories !== undefined && list.calories !== null && (
              <div style={{ padding: '10px', background: 'rgba(79, 99, 61, 0.04)', borderRadius: '8px', border: '1px dashed rgba(79, 99, 61, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Nutrition</span>
                  {list.allergens && <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>⚠️ {list.allergens}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span><strong>{Math.round(list.calories)}</strong> kcal</span>
                  <span><strong>{list.protein}g</strong> P</span>
                  <span><strong>{list.carbs}g</strong> C</span>
                  <span><strong>{list.fat}g</strong> F</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(79, 99, 61, 0.3)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Edit3 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleCancelClick(list.id)}
                  style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(239, 68, 68, 0.3)', background: 'transparent', color: '#ef4444', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Trash2 size={16} /> Cancel
                </button>
              </div>
              <button onClick={() => handleDownloadTerms(list.date)} style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(79, 99, 61, 0.05)', color: 'var(--color-primary)', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>
                <FileText size={14} /> View Accepted T&amp;C
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Donation History & Tax Benefits */}
      <h2 style={{ marginTop: '24px', fontSize: '1.4rem' }}>Donation History &amp; Tax Benefits</h2>
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', background: 'rgba(79, 99, 61, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Total Donated This Month</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text)' }}>124 Items</h3>
            </div>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Estimated Tax Benefit Eligible</p>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#22c55e' }}>₹ 4,500</h3>
            </div>
          </div>
          <button onClick={handleDownloadPdf} className="nav-login-btn" style={{ position: 'relative', top: '0', right: '0', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--color-primary)' }}>
            <Download size={18} />
            Download Receipt (PDF)
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Food Donated</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Quantity</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)' }}>NGO Name</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px 24px' }}>{item.date}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.food}</td>
                  <td style={{ padding: '16px 24px' }}>{item.qty}</td>
                  <td style={{ padding: '16px 24px' }}>{item.ngo}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#22c55e' }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 24px', background: 'rgba(34, 197, 94, 0.05)', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} /> Eligible for tax deductions under Section 80G
        </div>
      </Card>

      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Listing?"
        message="This action will permanently remove the food listing from the platform and it will no longer be visible to NGOs."
        confirmText="Yes, Cancel Listing"
        cancelText="No, Keep It"
        isDanger={true}
      />
    </div>
  );
};
