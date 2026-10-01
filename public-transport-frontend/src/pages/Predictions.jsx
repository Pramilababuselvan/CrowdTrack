import React, { useState, useEffect } from 'react';
import { Cpu, Play, Calculator, History, CheckCircle, RefreshCw, Zap, Users } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import { api } from '../services/api';

export default function Predictions() {
  const [buses, setBuses] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Simulator controls
  const [selectedBusId, setSelectedBusId] = useState('');
  const [simCapacity, setSimCapacity] = useState(60);
  const [simPassengers, setSimPassengers] = useState(48);
  const [simPeakHour, setSimPeakHour] = useState(true);
  const [simReportScore, setSimReportScore] = useState(2.0); // 0.0 to 3.0
  const [simReportsCount, setSimReportsCount] = useState(3);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const loadData = async () => {
    try {
      setLoadingHistory(true);
      const [busList, predHistory] = await Promise.all([
        api.getBuses().catch(() => []),
        api.getAllPredictions().catch(() => []),
      ]);

      setBuses(busList);
      setHistory(predHistory);

      if (busList.length > 0 && !selectedBusId) {
        setSelectedBusId(busList[0].id);
        setSimCapacity(busList[0].capacity);
        setSimPassengers(busList[0].currentPassengers);
        setSimPeakHour(busList[0].peakHour);
      }
    } catch (err) {
      console.error('Failed to load predictions data:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectBus = (e) => {
    const id = Number(e.target.value);
    setSelectedBusId(id);
    const bus = buses.find((b) => b.id === id);
    if (bus) {
      setSimCapacity(bus.capacity);
      setSimPassengers(bus.currentPassengers);
      setSimPeakHour(bus.peakHour);
    }
  };

  // Run the rule-based prediction locally for instant interactive feedback
  const runSimulation = () => {
    const cap = simCapacity > 0 ? simCapacity : 1;
    const occ = Math.round(((simPassengers / cap) * 100) * 10) / 10;

    let base = 'LOW';
    if (occ > 100) base = 'OVERCROWDED';
    else if (occ >= 80) base = 'HIGH';
    else if (occ >= 50) base = 'MEDIUM';

    let finalLevel = base;
    const steps = [];
    steps.push(`1. Raw Occupancy = (${simPassengers} / ${cap}) × 100 = ${occ}% [Base: ${base}]`);

    if (simPeakHour) {
      if (base === 'LOW' && occ >= 40) {
        finalLevel = 'MEDIUM';
        steps.push(`2. Peak Hour Modifier: Active. Borderline occupancy (≥40%) shifted LOW -> MEDIUM.`);
      } else if (base === 'MEDIUM' && occ >= 70) {
        finalLevel = 'HIGH';
        steps.push(`2. Peak Hour Modifier: Active. Borderline occupancy (≥70%) shifted MEDIUM -> HIGH.`);
      } else {
        steps.push(`2. Peak Hour Modifier: Active. No shift triggered for base ${base}.`);
      }
    } else {
      steps.push(`2. Peak Hour Modifier: Inactive. Normal schedule.`);
    }

    if (simReportsCount > 0) {
      steps.push(`3. User Reports: ${simReportsCount} observations (Average score: ${simReportScore.toFixed(2)}/3.00).`);
      if (simReportScore >= 2.2 && (finalLevel === 'LOW' || finalLevel === 'MEDIUM')) {
        finalLevel = 'HIGH';
        steps.push(`4. Report Elevation: High community score (≥2.2) elevated prediction to HIGH.`);
      } else if (simReportScore >= 2.7) {
        finalLevel = 'OVERCROWDED';
        steps.push(`4. Report Elevation: Extreme report score (≥2.7) elevated prediction to OVERCROWDED.`);
      } else {
        steps.push(`4. Report Impact: Reports reinforce current level without override.`);
      }
    } else {
      steps.push(`3. No user reports active for this time window.`);
    }

    steps.push(`5. Final Deterministic Rule Result: ${finalLevel}.`);

    setSimResult({
      occupancy: occ,
      finalLevel,
      steps,
    });
  };

  useEffect(() => {
    runSimulation();
  }, [simCapacity, simPassengers, simPeakHour, simReportScore, simReportsCount]);

  const handleSaveToBackend = async () => {
    if (!selectedBusId) return;
    try {
      setSimulating(true);
      await api.triggerPrediction(selectedBusId);
      await loadData();
      alert('Prediction successfully computed by Spring Boot and saved to MySQL!');
    } catch (err) {
      alert('Failed to trigger backend prediction: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Rule Engine Simulator & History</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Interactive deterministic evaluation tool and persisted historical prediction logs.
        </p>
      </div>

      {/* Simulator Section */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6',
          }}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Interactive Rule-Based Simulator</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Adjust parameters in real-time to observe deterministic decision branching.
            </p>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '2rem' }}>
          {/* Controls */}
          <div>
            <div className="form-group">
              <label className="form-label">Preset Bus (Optional)</label>
              <select
                className="form-select"
                value={selectedBusId}
                onChange={handleSelectBus}
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    Bus {b.busNumber} — {b.route}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Bus Capacity (Seats)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={simCapacity}
                  onChange={(e) => setSimCapacity(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Passengers</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={simPassengers}
                  onChange={(e) => setSimPassengers(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Peak Hour Switch */}
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Peak Hour Surge Modifier</span>
              <button
                type="button"
                onClick={() => setSimPeakHour(!simPeakHour)}
                className={`badge ${simPeakHour ? 'badge-high' : 'badge-low'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <Zap size={12} /> {simPeakHour ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>

            {/* Simulated Reports Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Simulated User Report Score (0 to 3)</span>
                <strong style={{ color: '#fff' }}>{simReportScore.toFixed(1)} / 3.0</strong>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={simReportScore}
                onChange={(e) => setSimReportScore(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6', marginTop: '0.4rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0.0 (Low reports)</span>
                <span>1.0 (Med reports)</span>
                <span>2.0 (High reports)</span>
                <span>3.0 (Overcrowded)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleSaveToBackend}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={simulating || !selectedBusId}
              >
                <Play size={16} />
                <span>{simulating ? 'Computing...' : 'Persist Prediction to MySQL'}</span>
              </button>
            </div>
          </div>

          {/* Right: Step-by-Step Logic Execution Trail */}
          <div style={{
            background: '#0b0f19',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#60a5fa' }}>
                Algorithmic Trace
              </span>
              {simResult && <CrowdBadge level={simResult.finalLevel} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
              {simResult?.steps.map((st, i) => (
                <div key={i} style={{
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  color: i === simResult.steps.length - 1 ? '#34d399' : '#e2e8f0',
                  lineHeight: 1.4,
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                }}>
                  {st}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Predictions Log Table */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Prediction History Database</h3>
          </div>
          <button onClick={loadData} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} className={loadingHistory ? 'animate-spin' : ''} />
            <span>Refresh History</span>
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Bus No.</th>
                <th>Route</th>
                <th>Occupancy %</th>
                <th>Crowd Result</th>
                <th>Explanation / Rule Trail</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No predictions logged yet. Run a prediction to record history!
                  </td>
                </tr>
              ) : (
                history.map((pred) => (
                  <tr key={pred.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(pred.predictionTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td><strong>Bus {pred.bus?.busNumber}</strong></td>
                    <td>{pred.bus?.route}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>
                        {pred.occupancyPercentage}%
                      </span>
                    </td>
                    <td>
                      <CrowdBadge level={pred.crowdLevel} size="sm" />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '350px' }}>
                      {pred.explanation}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
