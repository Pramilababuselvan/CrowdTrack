import React from 'react';
import CrowdBadge from './CrowdBadge';
import { Users, Zap, MessageSquare, Plus, Minus } from 'lucide-react';

export default function BusCard({ bus, onUpdatePassengers, onSelectReport }) {
  const occupancy = bus.occupancyPercentage || 0;
  const isOvercrowded = bus.crowdLevel === 'OVERCROWDED';
  const fillClass = 
    occupancy > 100 ? 'fill-overcrowded' :
    occupancy >= 80 ? 'fill-high' :
    occupancy >= 50 ? 'fill-medium' : 'fill-low';

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}>
              Bus {bus.busNumber}
            </span>
            {bus.peakHour && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}>
                <Zap size={11} /> PEAK
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {bus.route}
          </div>
        </div>

        <CrowdBadge level={bus.crowdLevel} size="sm" />
      </div>

      {/* Occupancy Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Occupancy</span>
          <span style={{ fontWeight: 700, color: occupancy > 100 ? '#ef4444' : '#ffffff' }}>
            {occupancy}% {isOvercrowded && '(Capacity Exceeded)'}
          </span>
        </div>
        <div className="occupancy-bar-bg">
          <div
            className={`occupancy-bar-fill ${fillClass}`}
            style={{ width: `${Math.min(100, occupancy)}%` }}
          />
        </div>
      </div>

      {/* Passenger Stats & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0.85rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
          <Users size={16} color="var(--text-muted)" />
          <span>
            <strong style={{ color: '#fff' }}>{bus.currentPassengers}</strong> / {bus.capacity} seats
          </span>
        </div>

        {/* Quick passenger update controls */}
        {onUpdatePassengers && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => onUpdatePassengers(bus.id, Math.max(0, bus.currentPassengers - 5))}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.45rem', height: '26px' }}
              title="Minus 5 passengers"
            >
              <Minus size={13} />
            </button>
            <button
              onClick={() => onUpdatePassengers(bus.id, bus.currentPassengers + 5)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.45rem', height: '26px' }}
              title="Add 5 passengers"
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Advice or Reports info */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        lineHeight: 1.3,
      }}>
        {bus.advice || 'Normal service operational.'}
      </div>

      {/* Action Footer */}
      {onSelectReport && (
        <button
          onClick={() => onSelectReport(bus)}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: 'auto' }}
        >
          <MessageSquare size={14} />
          <span>Report Live Crowd</span>
        </button>
      )}
    </div>
  );
}
