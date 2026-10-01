import React from 'react';
import {
  LayoutDashboard,
  Bus,
  PlusCircle,
  MessageSquarePlus,
  Cpu,
  BarChart3,
  Flame,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buses', label: 'Fleet Buses', icon: Bus },
    { id: 'add-bus', label: 'Add Bus', icon: PlusCircle },
    { id: 'reports', label: 'Commuter Reports', icon: MessageSquarePlus },
    { id: 'predictions', label: 'Prediction Engine', icon: Cpu },
    { id: 'statistics', label: 'Statistics & Charts', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(17, 24, 39, 0.98)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      gap: '0.5rem',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '0 0.75rem 1rem 0.75rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '0.75rem',
      }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
          Navigation
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={19} color={isActive ? '#ffffff' : '#9ca3af'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Info Widget */}
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', marginBottom: '0.35rem' }}>
          <Flame size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>College Project</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Deterministic rule-based crowd estimation. Spring Boot + Data JPA + MySQL.
        </p>
      </div>
    </aside>
  );
}
