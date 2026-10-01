import React, { useState } from 'react';
import { Bus, Plus, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import { api } from '../services/api';

export default function AddBus({ setActiveTab }) {
  const [busNumber, setBusNumber] = useState('');
  const [route, setRoute] = useState('');
  const [capacity, setCapacity] = useState(60);
  const [currentPassengers, setCurrentPassengers] = useState(30);
  const [peakHour, setPeakHour] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Live rule calculation preview
  const occupancy = capacity > 0 ? Math.round(((currentPassengers / capacity) * 100) * 10) / 10 : 0;
  let previewLevel = 'LOW';
  if (occupancy > 100) previewLevel = 'OVERCROWDED';
  else if (occupancy >= 80) previewLevel = 'HIGH';
  else if (occupancy >= 50) previewLevel = 'MEDIUM';

  // Peak hour adjustment in preview
  if (peakHour) {
    if (previewLevel === 'LOW' && occupancy >= 40) previewLevel = 'MEDIUM';
    else if (previewLevel === 'MEDIUM' && occupancy >= 70) previewLevel = 'HIGH';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createBus({
        busNumber,
        route,
        capacity: Number(capacity),
        currentPassengers: Number(currentPassengers),
        peakHour,
      });

      setSuccess(true);
      setTimeout(() => {
        setActiveTab('buses');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <button
        onClick={() => setActiveTab('buses')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Fleet</span>
      </button>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bus size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Register New Transit Bus</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Add a new bus route with passenger capacity and peak-hour condition.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle2 size={18} />
            <span>Bus successfully added to MySQL! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Bus Number / Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 107 or 570X"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Route Details</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tambaram - CIT"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Total Seating Capacity</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Passengers Onboard</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={currentPassengers}
                onChange={(e) => setCurrentPassengers(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Peak hour toggle */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
                <Zap size={16} color="#fbbf24" />
                <span>Peak Hour Transit Condition</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Applies peak hour load shift to borderline occupancy levels.
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={peakHour}
                onChange={(e) => setPeakHour(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{peakHour ? 'YES' : 'NO'}</span>
            </label>
          </div>

          {/* Live Preview Box */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(59, 130, 246, 0.06)',
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            marginBottom: '1.75rem',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#60a5fa', marginBottom: '0.5rem' }}>
              Live Rule Engine Prediction Preview
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Occupancy: <strong>{currentPassengers} / {capacity} ({occupancy}%)</strong>
                </span>
                {peakHour && <span style={{ fontSize: '0.75rem', color: '#fbbf24', marginLeft: '0.5rem' }}>+ Peak Hour Rule Active</span>}
              </div>
              <CrowdBadge level={previewLevel} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('buses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Plus size={16} />
              <span>{loading ? 'Saving Bus...' : 'Add Bus to System'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
