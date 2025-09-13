import React, { useEffect, useState } from 'react';
import { useAgent } from '../context/AgentContext';
import AgentCard from '../components/AgentCard';
import SystemStatus from '../components/SystemStatus';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAgent();
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    // Fetch agents data
    const fetchAgents = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await fetch('http://localhost:3001/api/agents');
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_AGENTS', payload: data.agents });
        } else {
          throw new Error('Failed to fetch agents');
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to backend services' });
        setSystemHealth('error');
      }
    };

    // Fetch system health
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
          setSystemHealth('healthy');
        } else {
          setSystemHealth('warning');
        }
      } catch (error) {
        setSystemHealth('error');
      }
    };

    fetchAgents();
    fetchHealth();

    // Set up periodic health checks
    const healthInterval = setInterval(fetchHealth, 30000); // Check every 30 seconds

    return () => clearInterval(healthInterval);
  }, [dispatch]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AyurDiscovery AI Dashboard</h1>
        <p>Traditional Ayurvedic Knowledge meets Modern AI Drug Discovery</p>
      </header>

      <SystemStatus health={systemHealth} />

      <section className="agents-section">
        <h2>Multi-Agent System Status</h2>
        {state.loading ? (
          <div className="loading">Loading agents...</div>
        ) : state.error ? (
          <div className="error">
            <p>⚠️ {state.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="agents-grid">
            {state.agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>

      <section className="stats-section">
        <h2>Platform Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Agents</h3>
            <p className="stat-number">{state.agents.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="stat-card">
            <h3>Compounds Analyzed</h3>
            <p className="stat-number">0</p>
            <small>Ready for integration</small>
          </div>
          <div className="stat-card">
            <h3>Literature Sources</h3>
            <p className="stat-number">0</p>
            <small>Ready for integration</small>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;