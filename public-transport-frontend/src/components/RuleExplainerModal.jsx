import React from 'react';
import { X, CheckCircle, Calculator, Users, Clock, ShieldCheck } from 'lucide-react';
import CrowdBadge from './CrowdBadge';

export default function RuleExplainerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem',
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        background: '#111827',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{
            padding: '0.5rem',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
          }}>
            <Calculator size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Prediction Architecture & Logic</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Deterministic Rule-Based Crowd Estimation (Zero AI / No Datasets)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          {/* Step 1 */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>1. Base Occupancy Percentage Calculation</span>
            </h3>
            <div style={{
              background: '#0b0f19',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#34d399',
              marginBottom: '0.75rem',
            }}>
              Occupancy % = (Current Passengers / Bus Capacity) × 100
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Example: 48 passengers in a 60-capacity bus = <strong>(48 / 60) × 100 = 80.0%</strong>.
            </p>
          </div>

          {/* Step 2: Thresholds */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '0.75rem' }}>
              2. Predefined Threshold Rules
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Occupancy Range</th>
                    <th>Classification</th>
                    <th>Typical State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>0% – 49%</strong></td>
                    <td><CrowdBadge level="LOW" size="sm" /></td>
                    <td style={{ color: 'var(--text-secondary)' }}>Seats available, relaxed travel</td>
                  </tr>
                  <tr>
                    <td><strong>50% – 79%</strong></td>
                    <td><CrowdBadge level="MEDIUM" size="sm" /></td>
                    <td style={{ color: 'var(--text-secondary)' }}>Most seats occupied, light standing</td>
                  </tr>
                  <tr>
                    <td><strong>80% – 100%</strong></td>
                    <td><CrowdBadge level="HIGH" size="sm" /></td>
                    <td style={{ color: 'var(--text-secondary)' }}>Aisle packed, minimal standing room</td>
                  </tr>
                  <tr>
                    <td><strong>&gt; 100%</strong></td>
                    <td><CrowdBadge level="OVERCROWDED" size="sm" /></td>
                    <td style={{ color: 'var(--text-secondary)' }}>Footboard crowding, severe overflow</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 3: Peak hour modifier */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} />
              <span>3. Peak-Hour Adjustment</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              During peak hours (e.g. morning/evening office rushes), boarding passenger turnover surges. The system applies a borderline sensitivity rule:
            </p>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              <li>If base is <strong>LOW</strong> but occupancy is ≥ 40% → Shifted to <strong>MEDIUM</strong></li>
              <li>If base is <strong>MEDIUM</strong> but occupancy is ≥ 70% → Shifted to <strong>HIGH</strong></li>
            </ul>
          </div>

          {/* Step 4: User report weighting */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
          }}>
            <h3 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} />
              <span>4. Weighted User Report Feedback</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Commuter reports contribute crowd score points (0 to 3):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>LOW: <strong>0 pts</strong></div>
              <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>MED: <strong>1 pt</strong></div>
              <div style={{ padding: '0.5rem', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '6px' }}>HIGH: <strong>2 pts</strong></div>
              <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>OVER: <strong>3 pts</strong></div>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              If recent user report average exceeds <strong>2.2 / 3.0</strong>, the crowd prediction is automatically escalated to warn upcoming passengers.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
