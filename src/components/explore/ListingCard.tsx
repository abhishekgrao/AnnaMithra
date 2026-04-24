import { forwardRef } from 'react';
import { Card } from '../ui/Card';
import { Clock, AlertTriangle, Package, Store } from 'lucide-react';
import type { Listing } from '../../services/supabaseListings';

interface ListingCardProps {
  listing: Listing;
  isActive: boolean;
  onClick: () => void;
}

export const ListingCard = forwardRef<HTMLDivElement, ListingCardProps>(
  ({ listing, isActive, onClick }, ref) => {
    const getUrgencyColor = (score: number) => {
      if (score >= 90) return '#ef4444'; // Red
      if (score >= 80) return '#f97316'; // Orange
      return '#22c55e'; // Green
    };

    const getUrgencyLabel = (score: number) => {
      if (score >= 90) return 'High';
      if (score >= 80) return 'Medium';
      return 'Low';
    };

    const urgencyColor = getUrgencyColor(listing.urgency_score);

    return (
      <div ref={ref} onClick={onClick} style={{ cursor: 'pointer' }}>
        <Card 
          style={{ 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            border: isActive ? `2px solid ${urgencyColor}` : '1px solid rgba(0,0,0,0.05)',
            transform: isActive ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease',
            backgroundColor: 'var(--color-bg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--color-text)' }}>
              {listing.title}
            </h3>
            <span style={{ 
              background: `${urgencyColor}20`, 
              color: urgencyColor, 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <AlertTriangle size={14} />
              {getUrgencyLabel(listing.urgency_score)} Urgency
            </span>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <Store size={16} />
              <span>{listing.source}</span>
            </div>
            {listing.category && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <Package size={16} />
                <span>{listing.category} • {listing.quantity}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <Clock size={16} />
              <span>Expires in {listing.expiry_days} day{listing.expiry_days > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          {/* Urgency Progress Bar */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>
              <span>Urgency Score</span>
              <span style={{ fontWeight: 600, color: urgencyColor }}>{listing.urgency_score}/100</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${listing.urgency_score}%`, 
                height: '100%', 
                backgroundColor: urgencyColor,
                borderRadius: '3px'
              }} />
            </div>
          </div>
          
          {/* Nutrition Facts */}
          {listing.calories !== undefined && listing.calories !== null && (
            <div style={{ 
              marginTop: '12px', 
              padding: '10px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                Estimated Nutrition
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{Math.round(listing.calories)}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>kcal</div>
                </div>
                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{listing.protein}g</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Prot</div>
                </div>
                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{listing.carbs}g</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Carb</div>
                </div>
                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{listing.fat}g</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Fat</div>
                </div>
                {listing.allergens && (
                  <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#ef4444', fontStyle: 'italic', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    ⚠️ {listing.allergens}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }
);
ListingCard.displayName = 'ListingCard';
