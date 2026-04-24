import React from 'react';
import { Card } from '../components/ui/Card';
import { Package, Clock, MapPin, Activity, FileText, Download, Plus, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const ShopDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleDownloadPdf = () => {
    // Generate a simple print-based PDF or Blob
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

  const activeListings = [
    { name: 'Assorted Pastries', qty: '20 items', time: '45 mins', urgency: 85, status: 'Claimed', ngo: 'Hope NGO', dist: '1.2 km', demand: 'High' },
    { name: 'Fresh Bread', qty: '15 loaves', time: '3 hrs', urgency: 35, status: 'Available', ngo: null, dist: '0.8 km', demand: 'Medium' }
  ];

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
        <button onClick={() => navigate('/upload')} className="nav-login-btn" style={{ position: 'relative', top: '0', right: '0', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} />
          Add New Listing
        </button>
      </div>

      {/* Active Surplus Listings */}
      <h2 style={{ marginTop: '16px', fontSize: '1.4rem' }}>Active Surplus Listings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {activeListings.map((list, i) => (
          <Card key={i} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(79, 99, 61, 0.3)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Edit3 size={16} /> Edit
              </button>
              <button style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(239, 68, 68, 0.3)', background: 'transparent', color: '#ef4444', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Trash2 size={16} /> Cancel
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
    </div>
  );
};
