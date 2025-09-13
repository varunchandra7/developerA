// Simple test to check if server starts without database
const express = require('express');
const app = express();

// Mock environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.JWT_SECRET = 'test-secret';

// Basic middleware
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Server started successfully!');
  server.close(); // Close after confirming it starts
});