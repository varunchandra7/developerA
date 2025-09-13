import React from 'react';
import { Agent } from '../context/AgentContext';
import './AgentCard.css';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4a7c59';
      case 'inactive':
        return '#999';
      case 'error':
        return '#d33';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'inactive':
        return '⏸️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="agent-card">
      <div className="agent-header">
        <div className="agent-icon">🤖</div>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <div className="agent-status" style={{ color: getStatusColor(agent.status) }}>
            {getStatusIcon(agent.status)} {agent.status.toUpperCase()}
          </div>
        </div>
      </div>
      
      {agent.description && (
        <p className="agent-description">{agent.description}</p>
      )}
      
      {agent.capabilities && agent.capabilities.length > 0 && (
        <div className="agent-capabilities">
          <h4>Capabilities:</h4>
          <ul>
            {agent.capabilities.map((capability, index) => (
              <li key={index}>{capability}</li>
            ))}
          </ul>
        </div>
      )}
      
      {agent.metrics && (
        <div className="agent-metrics">
          <h4>Performance:</h4>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Total Tasks:</span>
              <span className="metric-value">{agent.metrics.totalTasks}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">
                {agent.metrics.totalTasks > 0 
                  ? Math.round((agent.metrics.successfulTasks / agent.metrics.totalTasks) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCard;