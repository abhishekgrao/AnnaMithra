import React from 'react';

interface ExploreTabsProps {
  activeTab: 'supermarket' | 'dining';
  setActiveTab: (tab: 'supermarket' | 'dining') => void;
}

export const ExploreTabs: React.FC<ExploreTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
      <button
        onClick={() => setActiveTab('supermarket')}
        style={{
          flex: 1,
          padding: '12px 24px',
          borderRadius: '30px',
          border: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === 'supermarket' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
          color: activeTab === 'supermarket' ? 'white' : 'var(--color-text)',
          boxShadow: activeTab === 'supermarket' ? '0 4px 12px rgba(103, 128, 86, 0.3)' : 'none'
        }}
      >
        Supermarkets
      </button>
      <button
        onClick={() => setActiveTab('dining')}
        style={{
          flex: 1,
          padding: '12px 24px',
          borderRadius: '30px',
          border: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === 'dining' ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
          color: activeTab === 'dining' ? 'white' : 'var(--color-text)',
          boxShadow: activeTab === 'dining' ? '0 4px 12px rgba(103, 128, 86, 0.3)' : 'none'
        }}
      >
        Dining & Cafes
      </button>
    </div>
  );
};
