import React from 'react';
import AgentCard from '../components/AgentCard';
import { useAgent } from '../context/AgentContext';
import './AgentManagement.css';

const AgentManagement: React.FC = () => {
  const { state } = useAgent();

  return (
    <div className="agent-management">
      <header className="page-header">
        <h1>Agent Management</h1>
        <p>Monitor and configure your AI agents</p>
      </header>

      <div className="management-content">
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
          <>
            <div className="agents-overview">
              <h2>Active Agents ({state.agents.length})</h2>
              <div className="agents-grid">
                {state.agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>

            <div className="management-actions">
              <h2>Management Actions</h2>
              <div className="actions-grid">
                <button className="action-button" disabled>
                  🔄 Restart All Agents
                  <small>Coming soon</small>
                </button>
                <button className="action-button" disabled>
                  📊 View Detailed Metrics
                  <small>Coming soon</small>
                </button>
                <button className="action-button" disabled>
                  ⚙️ Configure Settings
                  <small>Coming soon</small>
                </button>
                <button className="action-button" disabled>
                  📋 Export Logs
                  <small>Coming soon</small>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;