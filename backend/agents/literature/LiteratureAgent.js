"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteratureAgent = void 0;
const AgentBase_1 = require("../base/AgentBase");
const types_1 = require("../../../shared/types");
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Literature Agent for processing Ayurvedic texts and scientific literature
 * Handles multilingual search, entity extraction, and knowledge synthesis
 */
class LiteratureAgent extends AgentBase_1.AgentBase {
    constructor() {
        super('literature-agent-001', 'Literature Processing Agent', types_1.AgentType.KNOWLEDGE_CURATOR, 'Processes Ayurvedic literature and traditional texts for knowledge extraction', ['text_processing', 'knowledge_extraction', 'multilingual_support'], {
            maxConcurrentTasks: 3,
            timeoutMs: 180000, // 3 minutes for literature search
            retryAttempts: 2,
            enableLogging: true,
        });
        this.traditionaltexts = new Map();
        this.scientificDatabase = new Map();
        this.teluguVocabulary = new Map();
        this.sanskritVocabulary = new Map();
        this.initializeKnowledgeBase();
    }
    async processTask(input) {
        const startTime = Date.now();
        const literatureInput = input.data;
        try {
            // Validate literature-specific input
            this.validateLiteratureInput(literatureInput);
            // Perform literature search
            const searchResults = await this.performLiteratureSearch(literatureInput);
            // Extract entities from results
            const enrichedResults = await this.extractEntitiesFromResults(searchResults);
            // Calculate relevance scores
            const rankedResults = this.rankResultsByRelevance(enrichedResults, literatureInput.query);
            const output = {
                results: rankedResults,
                totalFound: rankedResults.length,
                searchMetadata: {
                    query: literatureInput.query,
                    language: literatureInput.language,
                    searchType: literatureInput.searchType,
                    processingTime: Date.now() - startTime,
                },
            };
            return {
                taskId: input.taskId,
                result: output,
                confidence: this.calculateConfidenceScore(rankedResults),
                metadata: {
                    agentType: 'literature',
                    processingSteps: ['search', 'entity_extraction', 'ranking'],
                    sourcesConsulted: this.getSourcesConsulted(literatureInput),
                },
                executionTime: Date.now() - startTime,
            };
        }
        catch (error) {
            logger_1.default.error(`Literature agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
    validateLiteratureInput(input) {
        if (!input.query || input.query.trim().length === 0) {
            throw new Error('Query is required for literature search');
        }
        if (!['english', 'telugu', 'sanskrit'].includes(input.language)) {
            throw new Error('Unsupported language for literature search');
        }
        if (!['herb', 'compound', 'therapeutic_use', 'general'].includes(input.searchType)) {
            throw new Error('Invalid search type for literature search');
        }
    }
    async performLiteratureSearch(input) {
        const results = [];
        // Translate query if needed
        const translatedQuery = await this.translateQuery(input.query, input.language);
        // Search traditional texts
        const traditionalResults = await this.searchTraditionalTexts(translatedQuery, input);
        results.push(...traditionalResults);
        // Search scientific literature
        const scientificResults = await this.searchScientificLiterature(translatedQuery, input);
        results.push(...scientificResults);
        // Apply filters if provided
        if (input.filters) {
            return this.applyFilters(results, input.filters);
        }
        return results;
    }
    async translateQuery(query, language) {
        // Mock implementation - in production, integrate with translation service
        if (language === 'telugu') {
            // Simple Telugu transliteration mapping
            const teluguTerms = this.teluguVocabulary.get(query.toLowerCase());
            return teluguTerms || query;
        }
        if (language === 'sanskrit') {
            // Simple Sanskrit transliteration mapping
            const sanskritTerms = this.sanskritVocabulary.get(query.toLowerCase());
            return sanskritTerms || query;
        }
        return query;
    }
    async searchTraditionalTexts(query, input) {
        // Mock implementation - search through traditional Ayurvedic texts
        const mockResults = [
            {
                id: 'charaka-1',
                title: 'Charaka Samhita - Sutrasthana',
                content: `Traditional knowledge about ${query} and its therapeutic applications...`,
                source: {
                    type: 'traditional_text',
                    name: 'Charaka Samhita',
                    author: 'Acharya Charaka',
                    reliability: 0.95,
                },
                relevanceScore: 0.85,
                extractedEntities: {
                    herbs: ['ashwagandha', 'brahmi'],
                    compounds: ['withanolides', 'bacosides'],
                    therapeuticUses: ['stress relief', 'cognitive enhancement'],
                    doshas: ['vata', 'pitta'],
                },
                language: input.language,
                translationAvailable: input.language !== 'english',
            },
        ];
        // Filter based on search type
        return mockResults.filter(result => this.isRelevantToSearchType(result, input.searchType));
    }
    async searchScientificLiterature(query, input) {
        // Mock implementation - search through scientific databases
        const mockResults = [
            {
                id: 'pubmed-1',
                title: `Pharmacological analysis of ${query} compounds`,
                content: `Scientific study on the bioactive compounds found in ${query}...`,
                source: {
                    type: 'scientific_paper',
                    name: 'Journal of Ethnopharmacology',
                    author: 'Research Team',
                    year: 2023,
                    reliability: 0.90,
                },
                relevanceScore: 0.80,
                extractedEntities: {
                    herbs: ['traditional_herb'],
                    compounds: ['bioactive_compound_1', 'bioactive_compound_2'],
                    therapeuticUses: ['anti-inflammatory', 'antioxidant'],
                    doshas: [],
                },
                language: 'english',
                translationAvailable: false,
            },
        ];
        return mockResults.filter(result => this.isRelevantToSearchType(result, input.searchType));
    }
    async extractEntitiesFromResults(results) {
        // Mock entity extraction - in production, use NLP models
        return results.map(result => ({
            ...result,
            extractedEntities: {
                ...result.extractedEntities,
                // Enhanced entity extraction would go here
            },
        }));
    }
    rankResultsByRelevance(results, query) {
        // Simple relevance scoring based on query terms in content
        const queryTerms = query.toLowerCase().split(' ');
        return results
            .map(result => ({
            ...result,
            relevanceScore: this.calculateRelevanceScore(result, queryTerms),
        }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 20); // Return top 20 results
    }
    calculateRelevanceScore(result, queryTerms) {
        const contentLower = result.content.toLowerCase();
        const titleLower = result.title.toLowerCase();
        let score = 0;
        queryTerms.forEach(term => {
            // Title matches get higher weight
            if (titleLower.includes(term)) {
                score += 0.3;
            }
            // Content matches
            if (contentLower.includes(term)) {
                score += 0.2;
            }
            // Entity matches
            const allEntities = [
                ...result.extractedEntities.herbs,
                ...result.extractedEntities.compounds,
                ...result.extractedEntities.therapeuticUses,
            ].join(' ').toLowerCase();
            if (allEntities.includes(term)) {
                score += 0.25;
            }
        });
        // Source reliability bonus
        score *= result.source.reliability;
        return Math.min(score, 1.0); // Cap at 1.0
    }
    applyFilters(results, filters) {
        return results.filter(result => {
            // Source filter
            if (filters.sources && !filters.sources.includes(result.source.name)) {
                return false;
            }
            // Date range filter
            if (filters.dateRange && result.source.year) {
                const year = result.source.year;
                if (year < filters.dateRange.start.getFullYear() ||
                    year > filters.dateRange.end.getFullYear()) {
                    return false;
                }
            }
            return true;
        });
    }
    isRelevantToSearchType(result, searchType) {
        switch (searchType) {
            case 'herb':
                return result.extractedEntities.herbs.length > 0;
            case 'compound':
                return result.extractedEntities.compounds.length > 0;
            case 'therapeutic_use':
                return result.extractedEntities.therapeuticUses.length > 0;
            case 'general':
                return true;
            default:
                return true;
        }
    }
    calculateConfidenceScore(results) {
        if (results.length === 0)
            return 0;
        const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
        const avgReliability = results.reduce((sum, r) => sum + r.source.reliability, 0) / results.length;
        return (avgRelevance + avgReliability) / 2;
    }
    getSourcesConsulted(input) {
        const sources = ['traditional_texts', 'scientific_literature'];
        if (input.language === 'telugu') {
            sources.push('telugu_manuscripts');
        }
        if (input.language === 'sanskrit') {
            sources.push('sanskrit_texts');
        }
        return sources;
    }
    initializeKnowledgeBase() {
        // Initialize Telugu vocabulary mappings
        this.teluguVocabulary.set('turmeric', 'పసుపు');
        this.teluguVocabulary.set('neem', 'వేప');
        this.teluguVocabulary.set('ashwagandha', 'అశ్వగంధ');
        // Initialize Sanskrit vocabulary mappings
        this.sanskritVocabulary.set('turmeric', 'हरिद्रा');
        this.sanskritVocabulary.set('neem', 'निम्ब');
        this.sanskritVocabulary.set('ashwagandha', 'अश्वगन्धा');
        logger_1.default.info('Literature Agent knowledge base initialized');
    }
    async updateKnowledgeBase(newData) {
        // Method to update the knowledge base with new literature data
        logger_1.default.info('Updating Literature Agent knowledge base');
        // Implementation would update the various maps and databases
    }
}
exports.LiteratureAgent = LiteratureAgent;
