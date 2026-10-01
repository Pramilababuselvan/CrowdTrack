import React, { useState, useEffect } from 'react';
import {
  Bus,
  Search,
  Filter,
  PlusCircle,
  Trash2,
  Edit,
  Zap,
  Users,
  RefreshCw,
  LayoutGrid,
  List,
} from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import BusCard from '../components/BusCard';
import { api } from '../services/api';

export default function Buses({ setActiveTab, onSelectReportBus }) {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState('');
  const [crowdFilter, setCrowdFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await api.getBuses(search);
      setBuses(data);
    } catch (err) {
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [search]);

  const handleUpdatePassengers = async (busId, newCount) => {
    try {
      const updated = await api.updatePassengers(busId, newCount);
      setBuses((prev) => prev.map((b) => (b.id === busId ? updated : b)));
    } catch (err) {
      console.error('Failed to update passenger count:', err);
    }
  };

  const handleTogglePeakHour = async (bus) => {
    try {
      const updated = await api.updatePassengers(bus.id, bus.currentPassengers, !bus.peakHour);
      setBuses((prev) => prev.map((b) => (b.id === bus.id ? updated : b)));
    } catch (err) {
      console.error('Failed to toggle peak hour:', err);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to remove this bus from the fleet?')) {
      try {
        await api.deleteBus(busId);
        setBuses((prev) => prev.filter((b) => b.id !== busId));
      } catch (err) {
        alert('Failed to delete bus: ' + err.message);
      }
    }
  };

  const filteredBuses = buses.filter((b) => {
    if (crowdFilter === 'ALL') return true;
    return b.crowdLevel === crowdFilter;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Bus Fleet Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage transit fleet, adjust passenger counts, and monitor occupancy rules.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('add-bus')}
          className="btn btn-primary"
        >
          <PlusCircle size={16} />
          <span>Register New Bus</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search by route or bus number (e.g. 101, Tambaram)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Crowd Filter */}
          <select
            value={crowdFilter}
            onChange={(e) => setCrowdFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Crowd Levels</option>
            <option value="LOW">🟢 Low Crowd</option>
            <option value="MEDIUM">🟡 Medium Crowd</option>
            <option value="HIGH">🟠 High Crowd</option>
            <option value="OVERCROWDED">🔴 Overcrowded</option>
          </select>

          {/* Grid / Table Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '0.2rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Buses Listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <RefreshCw size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Updating bus fleet...</p>
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Bus size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Buses Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            No buses matched your search criteria or filter.
          </p>
          <button onClick={() => { setSearch(''); setCrowdFilter('ALL'); }} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredBuses.map((bus) => (
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
      ) : (
        /* Table View */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Bus No.</th>
                <th>Route</th>
                <th>Capacity</th>
                <th>Current Pax</th>
                <th>Occupancy %</th>
                <th>Peak Hour</th>
                <th>Prediction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.id}>
                  <td>
                    <strong>Bus {bus.busNumber}</strong>
                  </td>
                  <td>{bus.route}</td>
                  <td>{bus.capacity} seats</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleUpdatePassengers(bus.id, Math.max(0, bus.currentPassengers - 1))}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.1rem 0.4rem' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 600 }}>{bus.currentPassengers}</span>
                      <button
                        onClick={() => handleUpdatePassengers(bus.id, bus.currentPassengers + 1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.1rem 0.4rem' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: bus.occupancyPercentage > 100 ? '#ef4444' :
                             bus.occupancyPercentage >= 80 ? '#f97316' :
                             bus.occupancyPercentage >= 50 ? '#f59e0b' : '#10b981',
                    }}>
                      {bus.occupancyPercentage}%
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePeakHour(bus)}
                      className={`badge ${bus.peakHour ? 'badge-high' : 'badge-low'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle peak hour status"
                    >
                      <Zap size={11} /> {bus.peakHour ? 'YES' : 'NO'}
                    </button>
                  </td>
                  <td>
                    <CrowdBadge level={bus.crowdLevel} size="sm" />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          onSelectReportBus(bus);
                          setActiveTab('reports');
                        }}
                        className="btn btn-secondary btn-sm"
                        title="Submit Commuter Report"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Bus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
