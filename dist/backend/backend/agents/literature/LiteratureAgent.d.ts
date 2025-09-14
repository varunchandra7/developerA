import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
export interface LiteratureInput {
    query: string;
    language: 'english' | 'telugu' | 'sanskrit' | 'auto';
    searchType: 'herb' | 'compound' | 'therapeutic_use' | 'general' | 'formulation' | 'preparation';
    filters?: {
        sources?: string[];
        dateRange?: {
            start: Date;
            end: Date;
        };
        verificationStatus?: ('verified' | 'peer_reviewed' | 'traditional' | 'experimental')[];
        reliability?: number;
        documentTypes?: ('traditional_text' | 'scientific_paper' | 'clinical_study' | 'review' | 'database' | 'manuscript')[];
        regions?: ('india' | 'sri_lanka' | 'nepal' | 'global')[];
    };
    contextualSearch?: {
        semanticSearch: boolean;
        includeSynonyms: boolean;
        crossLinguistic: boolean;
        culturalContext: boolean;
    };
    maxResults?: number;
    includeTranslations?: boolean;
    analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
}
export interface LiteratureOutput {
    results: LiteratureResult[];
    totalFound: number;
    searchMetadata: {
        query: string;
        language: string;
        searchType: string;
        processingTime: number;
        nlpAnalysis: {
            queryComplexity: number;
            languageDetected: string;
            conceptsExtracted: string[];
            synonymsUsed: string[];
        };
    };
    aggregatedInsights: {
        mostRelevantConcepts: Array<{
            concept: string;
            frequency: number;
            confidence: number;
        }>;
        crossLinguisticMappings: Array<{
            term: string;
            translations: Record<string, string>;
        }>;
        therapeuticPatterns: Array<{
            pattern: string;
            frequency: number;
            sources: string[];
        }>;
        timelineTrends: Array<{
            period: string;
            developments: string[];
        }>;
    };
    recommendations: {
        relatedQueries: string[];
        suggestedReadings: string[];
        expertConsultation: string[];
        culturalNotes: string[];
    };
}
export interface LiteratureResult {
    id: string;
    title: string;
    content: string;
    source: {
        type: 'traditional_text' | 'scientific_paper' | 'clinical_study' | 'review' | 'database' | 'manuscript';
        name: string;
        author?: string;
        year?: number;
        reliability: number;
        region: string;
        culturalContext: string[];
    };
    relevanceScore: number;
    extractedEntities: {
        herbs: Array<{
            name: string;
            confidence: number;
            synonyms: string[];
        }>;
        compounds: Array<{
            name: string;
            confidence: number;
            chemicalName?: string;
        }>;
        therapeuticUses: Array<{
            use: string;
            confidence: number;
            doshaContext?: string[];
        }>;
        doshas: string[];
        preparations: Array<{
            name: string;
            method: string;
            ingredients?: string[];
        }>;
        formulations: Array<{
            name: string;
            type: string;
            composition?: string[];
        }>;
    };
    language: string;
    translationAvailable: boolean;
    translations?: {
        english?: string;
        telugu?: string;
        sanskrit?: string;
    };
    culturalContext: {
        region: string;
        tradition: string;
        significance: string;
        modernRelevance: string;
    };
    qualityMetrics: {
        textualQuality: number;
        sourceCredibility: number;
        factualAccuracy: number;
        culturalAuthenticity: number;
    };
}
/**
 * Literature Agent for processing Ayurvedic texts and scientific literature
 * Handles multilingual search, entity extraction, and knowledge synthesis
 */
export declare class LiteratureAgent extends AgentBase {
    private traditionaltexts;
    private scientificDatabase;
    private teluguVocabulary;
    private sanskritVocabulary;
    constructor();
    protected processTask(input: AgentInput): Promise<AgentOutput>;
    private validateLiteratureInput;
    private performLiteratureSearch;
    private translateQuery;
    private searchTraditionalTexts;
    private searchScientificLiterature;
    private extractEntitiesFromResults;
    private rankResultsByRelevance;
    private calculateRelevanceScore;
    private applyFilters;
    private isRelevantToSearchType;
    private calculateConfidenceScore;
    private getSourcesConsulted;
    private initializeKnowledgeBase;
    updateKnowledgeBase(_newData: Record<string, unknown>): Promise<void>;
    /**
     * Advanced NLP Analysis for query understanding and context extraction
     */
    private performNLPAnalysis;
    /**
     * Generate aggregated insights from search results
     */
    private generateAggregatedInsights;
    /**
     * Generate intelligent recommendations based on search results
     */
    private generateRecommendations;
    private detectLanguage;
    private extractConcepts;
    private findSynonyms;
    private calculateQueryComplexity;
    private analyzeConceptFrequency;
    private generateCrossLinguisticMappings;
    private identifyTherapeuticPatterns;
    private analyzeTimelineTrends;
    private generateRelatedQueries;
    private suggestReadings;
    private recommendExpertConsultation;
    private generateCulturalNotes;
}
