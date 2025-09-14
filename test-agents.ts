import { CompoundAgent } from './backend/agents/compound/CompoundAgent';
import { AgentCoordinator } from './backend/agents/coordinator/AgentCoordinator';
import { LiteratureAgent } from './backend/agents/literature/LiteratureAgent';

console.log('Testing AyurDiscovery AI Agent System...');

try {
  // Test Literature Agent instantiation
  const literatureAgent = new LiteratureAgent();
  console.log('✅ LiteratureAgent created successfully');
  console.log(`   - ID: ${literatureAgent.id}`);
  console.log(`   - Name: ${literatureAgent.name}`);
  console.log(`   - Type: ${literatureAgent.type}`);
  console.log(`   - Status: ${literatureAgent.status}`);

  // Test Compound Agent instantiation
  const compoundAgent = new CompoundAgent();
  console.log('✅ CompoundAgent created successfully');
  console.log(`   - ID: ${compoundAgent.id}`);
  console.log(`   - Name: ${compoundAgent.name}`);
  console.log(`   - Type: ${compoundAgent.type}`);
  console.log(`   - Status: ${compoundAgent.status}`);

  // Test Agent Coordinator instantiation
  const coordinator = new AgentCoordinator();
  console.log('✅ AgentCoordinator created successfully');

  console.log('\n🎉 All agent systems initialized successfully!');
  console.log('📊 System Status:');
  console.log(`   - Literature Agent: ${literatureAgent.status}`);
  console.log(`   - Compound Agent: ${compoundAgent.status}`);
  console.log(`   - Multi-agent system: Ready`);

} catch (error) {
  console.error('❌ Error testing agent system:', error);
  process.exit(1);
}