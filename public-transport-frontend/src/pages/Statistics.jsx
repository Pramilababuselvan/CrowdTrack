import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Bus, Zap, ShieldCheck } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import { api } from '../services/api';

export default function Statistics() {
  const [buses, setBuses] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busList, reportList] = await Promise.all([
          api.getBuses().catch(() => []),
          api.getReports().catch(() => []),
        ]);
        setBuses(busList);
        setReports(reportList);
      } catch (err) {
        console.error('Failed to load statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBuses = buses.length || 1;
  const lowCount = buses.filter((b) => b.crowdLevel === 'LOW').length;
  const medCount = buses.filter((b) => b.crowdLevel === 'MEDIUM').length;
  const highCount = buses.filter((b) => b.crowdLevel === 'HIGH').length;
  const overCount = buses.filter((b) => b.crowdLevel === 'OVERCROWDED').length;

  const maxCategoryCount = Math.max(lowCount, medCount, highCount, overCount, 1);

  // Peak hour analysis
  const peakBuses = buses.filter((b) => b.peakHour);
  const nonPeakBuses = buses.filter((b) => !b.peakHour);
  const avgPeakOccupancy = peakBuses.length
    ? Math.round(peakBuses.reduce((acc, b) => acc + (b.occupancyPercentage || 0), 0) / peakBuses.length)
    : 0;
  const avgNonPeakOccupancy = nonPeakBuses.length
    ? Math.round(nonPeakBuses.reduce((acc, b) => acc + (b.occupancyPercentage || 0), 0) / nonPeakBuses.length)
    : 0;

  return (
    <div className="page-wrapper animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Crowd Analytics & Statistics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Aggregate fleet occupancy metrics, route analytics, and rule evaluation distribution.
        </p>
      </div>

      {/* Crowd Distribution Bars */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={22} color="#3b82f6" />
          <span>Crowd Classification Distribution (Fleet of {buses.length} Buses)</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Low */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <span>🟢</span> Low Crowd (0-49%)
              </span>
              <span><strong>{lowCount}</strong> buses ({Math.round((lowCount / totalBuses) * 100)}%)</span>
            </div>
            <div className="occupancy-bar-bg" style={{ height: '14px' }}>
              <div
                className="occupancy-bar-fill fill-low"
                style={{ width: `${(lowCount / maxCategoryCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <span>🟡</span> Medium Crowd (50-79%)
              </span>
              <span><strong>{medCount}</strong> buses ({Math.round((medCount / totalBuses) * 100)}%)</span>
            </div>
            <div className="occupancy-bar-bg" style={{ height: '14px' }}>
              <div
                className="occupancy-bar-fill fill-medium"
                style={{ width: `${(medCount / maxCategoryCount) * 100}%` }}
              />
            </div>
          </div>

          {/* High */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <span>🟠</span> High Crowd (80-100%)
              </span>
              <span><strong>{highCount}</strong> buses ({Math.round((highCount / totalBuses) * 100)}%)</span>
            </div>
            <div className="occupancy-bar-bg" style={{ height: '14px' }}>
              <div
                className="occupancy-bar-fill fill-high"
                style={{ width: `${(highCount / maxCategoryCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Overcrowded */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <span>🔴</span> Overcrowded (&gt;100%)
              </span>
              <span><strong>{overCount}</strong> buses ({Math.round((overCount / totalBuses) * 100)}%)</span>
            </div>
            <div className="occupancy-bar-bg" style={{ height: '14px' }}>
              <div
                className="occupancy-bar-fill fill-overcrowded"
                style={{ width: `${(overCount / maxCategoryCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Peak vs Non-Peak & Reports Summary */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Peak vs Non-Peak Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#fbbf24" />
            <span>Peak Hour Impact Analysis</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>
                Peak Corridors
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0', color: '#f87171' }}>
                {avgPeakOccupancy}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Average Occupancy ({peakBuses.length} active routes)
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                Regular Hours
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0', color: '#34d399' }}>
                {avgNonPeakOccupancy}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Average Occupancy ({nonPeakBuses.length} active routes)
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture Card for College Demo */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#3b82f6" />
            <span>Architecture & Technology Stack</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Frontend</span>
              <strong>React.js + Vite + Modern CSS</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Backend Framework</span>
              <strong>Java + Spring Boot 3.3.4 (REST API)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Database / ORM</span>
              <strong>MySQL 8.0 + Spring Data JPA (Hibernate)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prediction Algorithm</span>
              <strong style={{ color: '#60a5fa' }}>Deterministic Rule Engine (No AI/ML)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Commuter Feedback</span>
              <strong>{reports.length} Reports Logged</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
