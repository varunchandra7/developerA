#!/usr/bin/env tsx
/**
 * Database Seeding Script for AyurDiscovery AI Platform
 *
 * This script populates the MongoDB database with comprehensive seed data including:
 * - Traditional Ayurvedic herbs with Telugu/Sanskrit names
 * - Modern pharmaceutical compounds
 * - Literature references and research papers
 * - Cross-reference mappings between traditional and modern knowledge
 * - User profiles for different researcher types
 * - Agent configurations and metrics
 */
/**
 * Main seeding function
 */
export declare function seedDatabase(): Promise<void>;
/**
 * Create database indexes for optimal performance
 */
declare function createIndexes(): Promise<void>;
/**
 * Verify that seeded data was created correctly
 */
declare function verifySeededData(): Promise<void>;
/**
 * Export individual seed functions for selective seeding
 */
export declare const seedFunctions: {
    seedUsers: () => Promise<void>;
    seedHerbs: () => Promise<void>;
    seedCompounds: () => Promise<void>;
    seedLiterature: () => Promise<void>;
    seedAgents: () => Promise<void>;
    createIndexes: typeof createIndexes;
    verifySeededData: typeof verifySeededData;
};
export {};
