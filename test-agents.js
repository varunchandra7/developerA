"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LiteratureAgent_1 = require("./backend/agents/literature/LiteratureAgent");
const CompoundAgent_1 = require("./backend/agents/compound/CompoundAgent");
const AgentCoordinator_1 = require("./backend/agents/coordinator/AgentCoordinator");
console.log('Testing AyurDiscovery AI Agent System...');
try {
    // Test Literature Agent instantiation
    const literatureAgent = new LiteratureAgent_1.LiteratureAgent();
    console.log('✅ LiteratureAgent created successfully');
    console.log(`   - ID: ${literatureAgent.id}`);
    console.log(`   - Name: ${literatureAgent.name}`);
    console.log(`   - Type: ${literatureAgent.type}`);
    console.log(`   - Status: ${literatureAgent.status}`);
    // Test Compound Agent instantiation
    const compoundAgent = new CompoundAgent_1.CompoundAgent();
    console.log('✅ CompoundAgent created successfully');
    console.log(`   - ID: ${compoundAgent.id}`);
    console.log(`   - Name: ${compoundAgent.name}`);
    console.log(`   - Type: ${compoundAgent.type}`);
    console.log(`   - Status: ${compoundAgent.status}`);
    // Test Agent Coordinator instantiation
    const coordinator = new AgentCoordinator_1.AgentCoordinator();
    console.log('✅ AgentCoordinator created successfully');
    console.log('\n🎉 All agent systems initialized successfully!');
    console.log('📊 System Status:');
    console.log(`   - Literature Agent: ${literatureAgent.status}`);
    console.log(`   - Compound Agent: ${compoundAgent.status}`);
    console.log(`   - Multi-agent system: Ready`);
}
catch (error) {
    console.error('❌ Error testing agent system:', error);
    process.exit(1);
}
