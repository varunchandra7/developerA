import React from 'react';
import './SystemStatus.css';

interface SystemStatusProps {
  health: 'healthy' | 'warning' | 'error';
}

const SystemStatus: React.FC<SystemStatusProps> = ({ health }) => {
  const getStatusInfo = (health: string) => {
    switch (health) {
      case 'healthy':
        return {
          icon: '✅',
          message: 'All systems operational',
          className: 'status-healthy'
        };
      case 'warning':
        return {
          icon: '⚠️',
          message: 'Some services may be experiencing issues',
          className: 'status-warning'
        };
      case 'error':
        return {
          icon: '❌',
          message: 'System services unavailable',
          className: 'status-error'
        };
      default:
        return {
          icon: '❓',
          message: 'Status unknown',
          className: 'status-unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(health);

  return (
    <div className={`system-status ${statusInfo.className}`}>
      <div className="status-content">
        <span className="status-icon">{statusInfo.icon}</span>
        <div className="status-text">
          <h3>System Status</h3>
          <p>{statusInfo.message}</p>
        </div>
        <div className="status-timestamp">
          Last checked: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;