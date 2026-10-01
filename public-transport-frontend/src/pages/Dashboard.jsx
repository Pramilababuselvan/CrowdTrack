import React, { useState, useEffect } from 'react';
import {
  Bus,
  Users,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  MessageSquarePlus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import BusCard from '../components/BusCard';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab, onSelectReportBus }) {
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [statsData, busList] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getBuses().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
      } else {
        // Fallback calculations from bus list if stats API was partial
        const low = busList.filter(b => b.crowdLevel === 'LOW').length;
        const med = busList.filter(b => b.crowdLevel === 'MEDIUM').length;
        const high = busList.filter(b => b.crowdLevel === 'HIGH').length;
        const over = busList.filter(b => b.crowdLevel === 'OVERCROWDED').length;
        setStats({
          totalBuses: busList.length,
          lowCrowd: low,
          mediumCrowd: med,
          highCrowd: high,
          overcrowded: over,
          totalReports: 5,
          totalPredictions: busList.length,
          recentPredictions: [],
          topCrowdedBuses: busList.slice(0, 3),
        });
      }

      setBuses(busList);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdatePassengers = async (busId, newCount) => {
    try {
      await api.updatePassengers(busId, newCount);
      // Refresh state
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update passenger count:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading live crowd analytics...</p>
        </div>
      </div>
    );
  }

  const total = stats?.totalBuses || buses.length || 1;
  const lowPct = Math.round(((stats?.lowCrowd || 0) / total) * 100);
  const medPct = Math.round(((stats?.mediumCrowd || 0) / total) * 100);
  const highPct = Math.round(((stats?.highCrowd || 0) / total) * 100);
  const overPct = Math.round(((stats?.overcrowded || 0) / total) * 100);

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Transport Crowd Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time rule-based crowd estimation across municipal transit corridors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchDashboardData}
            className="btn btn-secondary"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setActiveTab('add-bus')}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>Add Bus</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Total Buses */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6',
          }}>
            <Bus size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Buses
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalBuses || 0}</div>
          </div>
        </div>

        {/* Low Crowd */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--crowd-low-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--crowd-low)',
          }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Low Crowd (0-49%)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--crowd-low)' }}>
              {stats?.lowCrowd || 0}
            </div>
          </div>
        </div>

        {/* Medium Crowd */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--crowd-med-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--crowd-med)',
          }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Medium Crowd (50-79%)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--crowd-med)' }}>
              {stats?.mediumCrowd || 0}
            </div>
          </div>
        </div>

        {/* High & Overcrowded */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--crowd-over-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
          }}>
            <AlertTriangle size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              High & Overcrowded
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>
              {(stats?.highCrowd || 0) + (stats?.overcrowded || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Crowd Distribution Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Fleet Crowd Spectrum</h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--crowd-low)' }}>● Low: {lowPct}%</span>
            <span style={{ color: 'var(--crowd-med)' }}>● Medium: {medPct}%</span>
            <span style={{ color: 'var(--crowd-high)' }}>● High: {highPct}%</span>
            <span style={{ color: 'var(--crowd-over)' }}>● Overcrowded: {overPct}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', height: '14px', borderRadius: '999px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.05)' }}>
          <div style={{ width: `${lowPct}%`, background: '#10b981', transition: 'width 0.5s' }} title={`Low: ${lowPct}%`} />
          <div style={{ width: `${medPct}%`, background: '#f59e0b', transition: 'width 0.5s' }} title={`Medium: ${medPct}%`} />
          <div style={{ width: `${highPct}%`, background: '#f97316', transition: 'width 0.5s' }} title={`High: ${highPct}%`} />
          <div style={{ width: `${overPct}%`, background: '#ef4444', transition: 'width 0.5s' }} title={`Overcrowded: ${overPct}%`} />
        </div>
      </div>

      {/* Main Grid: Active Fleet Overview & Recent Predictions */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '2rem' }}>
        {/* Left: Active Buses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Live Fleet Status</h3>
            <button onClick={() => setActiveTab('buses')} className="btn btn-secondary btn-sm">
              View All Buses ({buses.length})
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {buses.slice(0, 4).map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                onUpdatePassengers={handleUpdatePassengers}
                onSelectReport={(b) => {
                  onSelectReportBus(b);
                  setActiveTab('reports');
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Recent Predictions Log */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Predictions</h3>
            <button onClick={() => setActiveTab('predictions')} className="btn btn-secondary btn-sm">
              Log Details
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentPredictions && stats.recentPredictions.length > 0 ? (
              stats.recentPredictions.map((pred, idx) => (
                <div key={idx} style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Bus {pred.busNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {pred.route} • {pred.occupancyPercentage}%
                    </div>
                  </div>
                  <CrowdBadge level={pred.crowdLevel} size="sm" />
                </div>
              ))
            ) : (
              buses.slice(0, 5).map((bus) => (
                <div key={bus.id} style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Bus {bus.busNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {bus.route} • {bus.occupancyPercentage}%
                    </div>
                  </div>
                  <CrowdBadge level={bus.crowdLevel} size="sm" />
                </div>
              ))
            )}

            <button
              onClick={() => setActiveTab('reports')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <MessageSquarePlus size={14} />
              <span>Submit Passenger Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
