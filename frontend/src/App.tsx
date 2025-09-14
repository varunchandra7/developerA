import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import { AgentProvider } from './context/AgentContext';
import AgentManagement from './pages/AgentManagement';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AgentProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<AgentManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AgentProvider>
  );
};

export default App;