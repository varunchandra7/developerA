// MongoDB initialization script
db = db.getSiblingDB('ayurdiscovery-ai');

// Create collections
db.createCollection('herbs');
db.createCollection('compounds'); 
db.createCollection('literature');
db.createCollection('agents');

// Create indexes for better performance
db.herbs.createIndex({ "name.english": "text", "name.sanskrit": "text", "name.telugu": "text" });
db.herbs.createIndex({ "therapeuticUses": 1 });
db.herbs.createIndex({ "properties.dosha": 1 });

db.compounds.createIndex({ "name": "text" });
db.compounds.createIndex({ "molecularFormula": 1 });
db.compounds.createIndex({ "source.plantSource": 1 });

db.literature.createIndex({ "title": "text", "abstract": "text", "keywords": "text" });
db.literature.createIndex({ "publication.year": -1 });
db.literature.createIndex({ "type": 1 });

db.agents.createIndex({ "name": 1 });
db.agents.createIndex({ "type": 1 });
db.agents.createIndex({ "status": 1 });

print('Database initialized successfully with indexes');