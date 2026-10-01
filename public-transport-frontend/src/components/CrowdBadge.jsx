import React from 'react';

export default function CrowdBadge({ level, size = 'md' }) {
  const normalized = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      label: 'LOW CROWD',
      emoji: '🟢',
      className: 'badge-low',
    },
    MEDIUM: {
      label: 'MEDIUM CROWD',
      emoji: '🟡',
      className: 'badge-medium',
    },
    HIGH: {
      label: 'HIGH CROWD',
      emoji: '🟠',
      className: 'badge-high',
    },
    OVERCROWDED: {
      label: 'OVERCROWDED',
      emoji: '🔴',
      className: 'badge-overcrowded',
    },
  };

  const item = config[normalized] || config.LOW;
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.75rem';
  const padding = size === 'sm' ? '0.2rem 0.5rem' : size === 'lg' ? '0.45rem 1rem' : '0.3rem 0.75rem';

  return (
    <span
      className={`badge ${item.className}`}
      style={{ fontSize, padding }}
    >
      <span>{item.emoji}</span>
      <span>{item.label}</span>
    </span>
  );
}
