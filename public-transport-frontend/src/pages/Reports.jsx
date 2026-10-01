import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Send, CheckCircle2, User, Clock, Bus, AlertCircle } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import { api } from '../services/api';

export default function Reports({ selectedBus, onSelectBus }) {
  const [buses, setBuses] = useState([]);
  const [reports, setReports] = useState([]);
  const [busId, setBusId] = useState(selectedBus ? selectedBus.id : '');
  const [crowdLevel, setCrowdLevel] = useState('HIGH');
  const [passengerCount, setPassengerCount] = useState(selectedBus ? selectedBus.currentPassengers : '');
  const [comment, setComment] = useState('');
  const [reporterName, setReporterName] = useState('Daily Commuter');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [busList, reportList] = await Promise.all([
        api.getBuses().catch(() => []),
        api.getReports().catch(() => []),
      ]);
      setBuses(busList);
      setReports(reportList);

      if (!busId && busList.length > 0) {
        setBusId(busList[0].id);
        setPassengerCount(busList[0].currentPassengers || 40);
      }
    } catch (err) {
      console.error('Error loading reports data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBus) {
      setBusId(selectedBus.id);
      setPassengerCount(selectedBus.currentPassengers || '');
    }
  }, [selectedBus]);

  const handleBusChange = (e) => {
    const id = Number(e.target.value);
    setBusId(id);
    const found = buses.find((b) => b.id === id);
    if (found) {
      setPassengerCount(found.currentPassengers || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.submitReport({
        busId: Number(busId),
        crowdLevel,
        passengerCount: passengerCount ? Number(passengerCount) : null,
        comment,
        reporterName,
      });

      setResult(res);
      setComment('');
      // Reload reports feed
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const crowdOptions = [
    { level: 'LOW', label: 'Low Crowd', emoji: '🟢', desc: 'Seats freely available' },
    { level: 'MEDIUM', label: 'Medium Crowd', emoji: '🟡', desc: 'Seats filling, moderate standing' },
    { level: 'HIGH', label: 'High Crowd', emoji: '🟠', desc: 'Aisle packed, heavy crowding' },
    { level: 'OVERCROWDED', label: 'Overcrowded', emoji: '🔴', desc: 'Footboard packed, cannot board' },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Commuter Crowd Reporting</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Crowdsourced passenger observations directly weight and fine-tune system predictions.
        </p>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
        {/* Left: Report Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}>
              <MessageSquarePlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Report Current Bus Crowd</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Submitted to Spring Boot backend and stored in MySQL
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
              fontSize: '0.84rem',
              marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          {/* Recalculation alert feedback */}
          {result && (
            <div style={{
              padding: '1.25rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Prediction Recalculated Successfully!</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem' }}>Updated Crowd Status for Bus {result.busNumber}:</span>
                <CrowdBadge level={result.crowdLevel} />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                "{result.calculationDetails}"
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Bus Route</label>
              <select
                className="form-select"
                value={busId}
                onChange={handleBusChange}
                required
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    Bus {b.busNumber} — {b.route} ({b.currentPassengers}/{b.capacity} pax)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Observed Crowd Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                {crowdOptions.map((opt) => {
                  const isSelected = crowdLevel === opt.level;
                  return (
                    <button
                      key={opt.level}
                      type="button"
                      onClick={() => setCrowdLevel(opt.level)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-input)',
                        border: isSelected ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#fff',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Estimated Passenger Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 48"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reporter Name / Alias</label>
                <input
                  type="text"
                  className="form-input"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Daily Commuter"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observation Notes / Stop Location</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Bus is filling rapidly at Chromepet; rear seats all taken."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
              disabled={loading}
            >
              <Send size={16} />
              <span>{loading ? 'Submitting & Recalculating...' : 'Submit Report & Recalculate'}</span>
            </button>
          </form>
        </div>

        {/* Right: Recent Reports Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Commuter Reports</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {reports.length} Reports Logged
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '650px', overflowY: 'auto' }}>
            {reports.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No commuter reports logged yet.
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="glass-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        Bus {rep.bus?.busNumber}
                        <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                          • {rep.bus?.route}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <User size={12} />
                        <span>{rep.reporterName || 'Anonymous'}</span>
                        <Clock size={12} style={{ marginLeft: '0.3rem' }} />
                        <span>{new Date(rep.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <CrowdBadge level={rep.crowdLevel} size="sm" />
                  </div>

                  {rep.passengerCount && (
                    <div style={{ fontSize: '0.78rem', color: '#60a5fa', marginBottom: '0.35rem' }}>
                      Reported Pax: <strong>{rep.passengerCount}</strong>
                    </div>
                  )}

                  {rep.comment && (
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      borderLeft: '2px solid #3b82f6',
                    }}>
                      "{rep.comment}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
