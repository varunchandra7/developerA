import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import Dashboard from './pages/Dashboard';
import AgentManagement from './pages/AgentManagement';
import Navigation from './components/Navigation';
import './App.css';

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