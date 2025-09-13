import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';
export interface LiteratureInput {
    query: string;
    language: 'english' | 'telugu' | 'sanskrit';
    searchType: 'herb' | 'compound' | 'therapeutic_use' | 'general';
    filters?: {
        sources?: string[];
        dateRange?: {
            start: Date;
            end: Date;
        };
        verificationStatus?: string[];
    };
}
export interface LiteratureOutput {
    results: LiteratureResult[];
    totalFound: number;
    searchMetadata: {
        query: string;
        language: string;
        searchType: string;
        processingTime: number;
    };
}
export interface LiteratureResult {
    id: string;
    title: string;
    content: string;
    source: {
        type: 'traditional_text' | 'scientific_paper' | 'database' | 'manuscript';
        name: string;
        author?: string;
        year?: number;
        reliability: number;
    };
    relevanceScore: number;
    extractedEntities: {
        herbs: string[];
        compounds: string[];
        therapeuticUses: string[];
        doshas: string[];
    };
    language: string;
    translationAvailable: boolean;
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
    updateKnowledgeBase(newData: Record<string, unknown>): Promise<void>;
}
