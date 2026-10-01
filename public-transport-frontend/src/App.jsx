import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RuleExplainerModal from './components/RuleExplainerModal';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Buses from './pages/Buses';
import AddBus from './pages/AddBus';
import Reports from './pages/Reports';
import Predictions from './pages/Predictions';
import Statistics from './pages/Statistics';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crowdtrack_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: 'Transport Admin',
      email: 'admin@transport.com',
      role: 'ADMIN',
    };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReportBus, setSelectedReportBus] = useState(null);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('crowdtrack_user', JSON.stringify(userData));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crowdtrack_user');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-content">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onOpenExplainer={() => setIsExplainerOpen(true)}
        />

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onSelectReportBus={(bus) => {
                setSelectedReportBus(bus);
                setActiveTab('reports');
              }}
            />
          )}

          {activeTab === 'buses' && (
            <Buses
              setActiveTab={setActiveTab}
              onSelectReportBus={(bus) => {
                setSelectedReportBus(bus);
                setActiveTab('reports');
              }}
            />
          )}

          {activeTab === 'add-bus' && (
            <AddBus setActiveTab={setActiveTab} />
          )}

          {activeTab === 'reports' && (
            <Reports
              selectedBus={selectedReportBus}
              onSelectBus={(bus) => setSelectedReportBus(bus)}
            />
          )}

          {activeTab === 'predictions' && (
            <Predictions />
          )}

          {activeTab === 'statistics' && (
            <Statistics />
          )}
        </main>

        <RuleExplainerModal
          isOpen={isExplainerOpen}
          onClose={() => setIsExplainerOpen(false)}
        />
      </div>
    </div>
  );
}
