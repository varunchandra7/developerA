// Demo backend server without database dependency
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './backend/middleware/requestLogger';
import { errorHandler } from './backend/middleware/errorHandler';

// Set environment variables for demo
process.env['NODE_ENV'] = 'development';
process.env['PORT'] = '3001';
process.env['JWT_SECRET'] = 'demo-secret';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Logging middleware
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
    version: '1.0.0',
    services: {
      database: 'offline (demo mode)',
      agents: 'active',
      api: 'operational'
    }
  });
});

// API routes
app.get('/api/agents', (req, res) => {
  res.json({
    success: true,
    data: {
      agents: [
        {
          id: 'literature-agent-001',
          name: 'Literature Processing Agent',
          type: 'literature_processor',
          status: 'active',
          description: 'Processes Ayurvedic literature and extracts compound information',
          capabilities: ['text_processing', 'telugu_support', 'sanskrit_parsing', 'compound_extraction'],
          metrics: {
            totalTasks: 150,
            successfulTasks: 147,
            failedTasks: 3,
            averageExecutionTime: 2400
          }
        },
        {
          id: 'compound-agent-001',
          name: 'Compound Analysis Agent',
          type: 'compound_analyzer',
          status: 'active',
          description: 'Analyzes chemical compounds for drug discovery potential',
          capabilities: ['chemical_analysis', 'molecular_modeling', 'property_prediction', 'safety_assessment'],
          metrics: {
            totalTasks: 89,
            successfulTasks: 86,
            failedTasks: 3,
            averageExecutionTime: 3200
          }
        },
        {
          id: 'coordinator-agent-001',
          name: 'Agent Coordinator',
          type: 'coordinator',
          status: 'active',
          description: 'Coordinates workflows between different specialized agents',
          capabilities: ['workflow_orchestration', 'task_distribution', 'result_synthesis', 'quality_control'],
          metrics: {
            totalTasks: 45,
            successfulTasks: 44,
            failedTasks: 1,
            averageExecutionTime: 5600
          }
        }
      ]
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: 'demo-' + Math.random().toString(36).substr(2, 9),
      processingTime: 45
    }
  });
});

// Demo compound analysis endpoint
app.post('/api/analyze/compound', (req, res) => {
  const { compoundName, smiles } = req.body;
  
  res.json({
    success: true,
    data: {
      compound: compoundName || 'Unknown Compound',
      smiles: smiles || 'CCO',
      analysis: {
        molecularWeight: 46.07,
        logP: -0.31,
        toxicityScore: 0.2,
        drugLikeness: 0.75,
        bioavailability: 0.85,
        ayurvedicProperties: {
          rasa: ['Madhura', 'Tikta'],
          virya: 'Sheeta',
          vipaka: 'Madhura',
          dosha: ['Vata-shamak', 'Pitta-shamak']
        }
      },
      recommendations: [
        'Suitable for cardiovascular applications',
        'Low toxicity profile',
        'Good oral bioavailability',
        'Compatible with Ayurvedic principles'
      ]
    },
    metadata: {
      timestamp: new Date().toISOString(),
      processingTime: 1200,
      agentId: 'compound-agent-001'
    }
  });
});

// Demo literature search endpoint
app.get('/api/search/literature', (req, res) => {
  const query = req.query['q'] || 'ashwagandha';
  
  res.json({
    success: true,
    data: {
      query,
      results: [
        {
          id: 'lit-001',
          title: 'Withania somnifera (Ashwagandha) in Modern Drug Discovery',
          source: 'Journal of Ayurvedic Medicine',
          excerpt: 'Ashwagandha demonstrates significant adaptogenic properties...',
          compounds: ['Withanolide A', 'Withanoside D', 'Withaferol A'],
          confidence: 0.92
        },
        {
          id: 'lit-002',
          title: 'Traditional Ayurvedic Formulations and Modern Pharmacology',
          source: 'International Journal of Traditional Medicine',
          excerpt: 'Classical texts describe numerous applications...',
          compounds: ['Withanolide B', 'Withanoside VI'],
          confidence: 0.87
        }
      ],
      totalFound: 156,
      searchTime: 340
    },
    metadata: {
      timestamp: new Date().toISOString(),
      agentId: 'literature-agent-001'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env['PORT'] || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 AyurDiscovery AI Backend Server Started`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Agents API: http://localhost:${PORT}/api/agents`);
  console.log(`🔬 Compound Analysis: POST http://localhost:${PORT}/api/analyze/compound`);
  console.log(`📚 Literature Search: GET http://localhost:${PORT}/api/search/literature`);
  console.log(`💡 Demo Mode: Database-free operation for development`);
  console.log(`✨ Multi-Agent System: Ready for drug discovery workflows`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});