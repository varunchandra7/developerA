import { AgentType } from '../../../shared/types';
import logger from '../../utils/logger';
import { AgentBase, AgentInput, AgentOutput } from '../base/AgentBase';

// Enhanced interfaces for advanced literature processing
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
    reliability?: number; // 0-1 threshold
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
    mostRelevantConcepts: Array<{ concept: string; frequency: number; confidence: number }>;
    crossLinguisticMappings: Array<{ term: string; translations: Record<string, string> }>;
    therapeuticPatterns: Array<{ pattern: string; frequency: number; sources: string[] }>;
    timelineTrends: Array<{ period: string; developments: string[] }>;
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
    herbs: Array<{ name: string; confidence: number; synonyms: string[] }>;
    compounds: Array<{ name: string; confidence: number; chemicalName?: string }>;
    therapeuticUses: Array<{ use: string; confidence: number; doshaContext?: string[] }>;
    doshas: string[];
    preparations: Array<{ name: string; method: string; ingredients?: string[] }>;
    formulations: Array<{ name: string; type: string; composition?: string[] }>;
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
export class LiteratureAgent extends AgentBase {
  private traditionaltexts: Map<string, any>;
  private scientificDatabase: Map<string, any>;
  private teluguVocabulary: Map<string, string>;
  private sanskritVocabulary: Map<string, string>;

  constructor() {
    super(
      'literature-agent-001',
      'Literature Processing Agent',
      AgentType.KNOWLEDGE_CURATOR,
      'Processes Ayurvedic literature and traditional texts for knowledge extraction',
      ['text_processing', 'knowledge_extraction', 'multilingual_support'],
      {
        maxConcurrentTasks: 3,
        timeoutMs: 180000, // 3 minutes for literature search
        retryAttempts: 2,
        enableLogging: true,
      }
    );

    this.traditionaltexts = new Map();
    this.scientificDatabase = new Map();
    this.teluguVocabulary = new Map();
    this.sanskritVocabulary = new Map();

    this.initializeKnowledgeBase();
  }

  protected async processTask(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    const literatureInput = input.data as unknown as LiteratureInput;

    try {
      // Validate literature-specific input
      this.validateLiteratureInput(literatureInput);

      // Perform literature search
      const searchResults = await this.performLiteratureSearch(literatureInput);

      // Extract entities from results
      const enrichedResults = await this.extractEntitiesFromResults(searchResults);

      // Perform advanced NLP analysis
      const nlpAnalysis = await this.performNLPAnalysis(literatureInput.query, literatureInput.language);
      
      // Calculate relevance scores
      const rankedResults = this.rankResultsByRelevance(enrichedResults, literatureInput.query);

      // Generate aggregated insights
      const aggregatedInsights = await this.generateAggregatedInsights(rankedResults);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(literatureInput, rankedResults);

      const output: LiteratureOutput = {
        results: rankedResults,
        totalFound: rankedResults.length,
        searchMetadata: {
          query: literatureInput.query,
          language: literatureInput.language,
          searchType: literatureInput.searchType,
          processingTime: Date.now() - startTime,
          nlpAnalysis,
        },
        aggregatedInsights,
        recommendations,
      };

      return {
        taskId: input.taskId,
        result: output as unknown as Record<string, unknown>,
        confidence: this.calculateConfidenceScore(rankedResults),
        metadata: {
          agentType: 'literature',
          processingSteps: ['search', 'entity_extraction', 'ranking'],
          sourcesConsulted: this.getSourcesConsulted(literatureInput),
        },
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      logger.error(`Literature agent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private validateLiteratureInput(input: LiteratureInput): void {
    if (!input.query || input.query.trim().length === 0) {
      throw new Error('Query is required for literature search');
    }

    if (!['english', 'telugu', 'sanskrit', 'auto'].includes(input.language)) {
      throw new Error('Unsupported language for literature search');
    }

    if (!['herb', 'compound', 'therapeutic_use', 'general', 'formulation', 'preparation'].includes(input.searchType)) {
      throw new Error('Invalid search type for literature search');
    }
  }

  private async performLiteratureSearch(input: LiteratureInput): Promise<LiteratureResult[]> {
    const results: LiteratureResult[] = [];

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

  private async translateQuery(query: string, language: string): Promise<string> {
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

  private async searchTraditionalTexts(query: string, input: LiteratureInput): Promise<LiteratureResult[]> {
    // Mock implementation - search through traditional Ayurvedic texts
    const mockResults: LiteratureResult[] = [
      {
        id: 'charaka-1',
        title: 'Charaka Samhita - Sutrasthana',
        content: `Traditional knowledge about ${query} and its therapeutic applications...`,
        source: {
          type: 'traditional_text',
          name: 'Charaka Samhita',
          author: 'Acharya Charaka',
          reliability: 0.95,
          region: 'India',
          culturalContext: ['Ancient Ayurveda', 'Classical Sanskrit texts']
        },
        relevanceScore: 0.85,
        extractedEntities: {
          herbs: [
            { name: 'ashwagandha', confidence: 0.9, synonyms: ['winter cherry', 'withania'] },
            { name: 'brahmi', confidence: 0.85, synonyms: ['bacopa', 'water hyssop'] }
          ],
          compounds: [
            { name: 'withanolides', confidence: 0.8, chemicalName: 'Steroidal lactones' },
            { name: 'bacosides', confidence: 0.75, chemicalName: 'Triterpenoid saponins' }
          ],
          therapeuticUses: [
            { use: 'stress relief', confidence: 0.9, doshaContext: ['vata'] },
            { use: 'cognitive enhancement', confidence: 0.85, doshaContext: ['vata', 'pitta'] }
          ],
          doshas: ['vata', 'pitta'],
          preparations: [
            { name: 'churna', method: 'powder form', ingredients: ['dried root'] }
          ],
          formulations: [
            { name: 'ashwagandharishta', type: 'fermented preparation', composition: ['ashwagandha', 'honey', 'water'] }
          ]
        },
        language: input.language,
        translationAvailable: input.language !== 'english',
        translations: {
          english: 'Traditional knowledge about adaptogenic herbs...',
          telugu: 'అశ్వగంధ గురించి సాంప్రదాయిక జ్ఞానం...',
          sanskrit: 'अश्वगन्धा विषये पारम्परिक ज्ञानम्...'
        },
        culturalContext: {
          region: 'Ancient India',
          tradition: 'Classical Ayurveda',
          significance: 'Foundational text for understanding Ayurvedic principles',
          modernRelevance: 'Scientific validation of traditional uses'
        },
        qualityMetrics: {
          textualQuality: 0.95,
          sourceCredibility: 0.98,
          factualAccuracy: 0.90,
          culturalAuthenticity: 1.0
        }
      },
    ];

    // Filter based on search type
    return mockResults.filter(result => 
      this.isRelevantToSearchType(result, input.searchType)
    );
  }

  private async searchScientificLiterature(query: string, input: LiteratureInput): Promise<LiteratureResult[]> {
    // Mock implementation - search through scientific databases
    const mockResults: LiteratureResult[] = [
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
          region: 'Global',
          culturalContext: ['Modern scientific research', 'Peer-reviewed studies']
        },
        relevanceScore: 0.80,
        extractedEntities: {
          herbs: [
            { name: 'traditional_herb', confidence: 0.85, synonyms: ['medicinal plant'] }
          ],
          compounds: [
            { name: 'bioactive_compound_1', confidence: 0.9, chemicalName: 'C20H24O5' },
            { name: 'bioactive_compound_2', confidence: 0.8, chemicalName: 'C15H18O3' }
          ],
          therapeuticUses: [
            { use: 'anti-inflammatory', confidence: 0.95 },
            { use: 'antioxidant', confidence: 0.88 }
          ],
          doshas: [],
          preparations: [
            { name: 'standardized extract', method: 'solvent extraction', ingredients: ['plant material', 'ethanol'] }
          ],
          formulations: [
            { name: 'capsule form', type: 'pharmaceutical preparation', composition: ['extract', 'excipients'] }
          ]
        },
        language: 'english',
        translationAvailable: false,
        culturalContext: {
          region: 'Global research',
          tradition: 'Modern pharmacology',
          significance: 'Evidence-based validation of traditional uses',
          modernRelevance: 'Clinical application potential'
        },
        qualityMetrics: {
          textualQuality: 0.92,
          sourceCredibility: 0.95,
          factualAccuracy: 0.98,
          culturalAuthenticity: 0.6
        }
      },
    ];

    return mockResults.filter(result => 
      this.isRelevantToSearchType(result, input.searchType)
    );
  }

  private async extractEntitiesFromResults(results: LiteratureResult[]): Promise<LiteratureResult[]> {
    // Mock entity extraction - in production, use NLP models
    return results.map(result => ({
      ...result,
      extractedEntities: {
        ...result.extractedEntities,
        // Enhanced entity extraction would go here
      },
    }));
  }

  private rankResultsByRelevance(results: LiteratureResult[], query: string): LiteratureResult[] {
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

  private calculateRelevanceScore(result: LiteratureResult, queryTerms: string[]): number {
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

  private applyFilters(results: LiteratureResult[], filters: NonNullable<LiteratureInput['filters']>): LiteratureResult[] {
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

  private isRelevantToSearchType(result: LiteratureResult, searchType: string): boolean {
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

  private calculateConfidenceScore(results: LiteratureResult[]): number {
    if (results.length === 0) return 0;
    
    const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
    const avgReliability = results.reduce((sum, r) => sum + r.source.reliability, 0) / results.length;
    
    return (avgRelevance + avgReliability) / 2;
  }

  private getSourcesConsulted(input: LiteratureInput): string[] {
    const sources = ['traditional_texts', 'scientific_literature'];
    
    if (input.language === 'telugu') {
      sources.push('telugu_manuscripts');
    }
    
    if (input.language === 'sanskrit') {
      sources.push('sanskrit_texts');
    }
    
    return sources;
  }

  private initializeKnowledgeBase(): void {
    // Initialize Telugu vocabulary mappings
    this.teluguVocabulary.set('turmeric', 'పసుపు');
    this.teluguVocabulary.set('neem', 'వేప');
    this.teluguVocabulary.set('ashwagandha', 'అశ్వగంధ');
    
    // Initialize Sanskrit vocabulary mappings
    this.sanskritVocabulary.set('turmeric', 'हरिद्रा');
    this.sanskritVocabulary.set('neem', 'निम्ब');
    this.sanskritVocabulary.set('ashwagandha', 'अश्वगन्धा');
    
    logger.info('Literature Agent knowledge base initialized');
  }

  public async updateKnowledgeBase(_newData: Record<string, unknown>): Promise<void> {
    // Method to update the knowledge base with new literature data
    logger.info('Updating Literature Agent knowledge base');
    // Implementation would update the various maps and databases
  }

  /**
   * Advanced NLP Analysis for query understanding and context extraction
   */
  private async performNLPAnalysis(
    query: string, 
    language: string
  ): Promise<{
    queryComplexity: number;
    languageDetected: string;
    conceptsExtracted: string[];
    synonymsUsed: string[];
  }> {
    // Language detection (simplified implementation)
    const detectedLanguage = this.detectLanguage(query, language);
    
    // Extract concepts using pattern matching and NLP
    const concepts = this.extractConcepts(query);
    
    // Find synonyms for better search coverage
    const synonyms = this.findSynonyms(concepts);
    
    // Calculate query complexity
    const complexity = this.calculateQueryComplexity(query);

    return {
      queryComplexity: complexity,
      languageDetected: detectedLanguage,
      conceptsExtracted: concepts,
      synonymsUsed: synonyms,
    };
  }

  /**
   * Generate aggregated insights from search results
   */
  private async generateAggregatedInsights(
    results: LiteratureResult[]
  ): Promise<{
    mostRelevantConcepts: Array<{ concept: string; frequency: number; confidence: number }>;
    crossLinguisticMappings: Array<{ term: string; translations: Record<string, string> }>;
    therapeuticPatterns: Array<{ pattern: string; frequency: number; sources: string[] }>;
    timelineTrends: Array<{ period: string; developments: string[] }>;
  }> {
    // Analyze concept frequency and relevance
    const conceptFrequency = this.analyzeConceptFrequency(results);
    
    // Generate cross-linguistic mappings
    const linguisticMappings = this.generateCrossLinguisticMappings(results);
    
    // Identify therapeutic patterns
    const therapeuticPatterns = this.identifyTherapeuticPatterns(results);
    
    // Analyze timeline trends
    const timelineTrends = this.analyzeTimelineTrends(results);

    return {
      mostRelevantConcepts: conceptFrequency,
      crossLinguisticMappings: linguisticMappings,
      therapeuticPatterns,
      timelineTrends,
    };
  }

  /**
   * Generate intelligent recommendations based on search results
   */
  private async generateRecommendations(
    input: LiteratureInput,
    results: LiteratureResult[]
  ): Promise<{
    relatedQueries: string[];
    suggestedReadings: string[];
    expertConsultation: string[];
    culturalNotes: string[];
  }> {
    // Generate related queries based on concepts found
    const relatedQueries = this.generateRelatedQueries(input.query, results);
    
    // Suggest readings based on source credibility and relevance
    const suggestedReadings = this.suggestReadings(results);
    
    // Recommend expert consultation areas
    const expertConsultation = this.recommendExpertConsultation(results);
    
    // Provide cultural context notes
    const culturalNotes = this.generateCulturalNotes(results, input.language);

    return {
      relatedQueries,
      suggestedReadings,
      expertConsultation,
      culturalNotes,
    };
  }

  // Helper methods for NLP analysis
  private detectLanguage(query: string, providedLanguage: string): string {
    if (providedLanguage !== 'auto') return providedLanguage;
    
    // Simple language detection based on character sets
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const sanskritRegex = /[\u0900-\u097F]/;
    
    if (teluguRegex.test(query)) return 'telugu';
    if (sanskritRegex.test(query)) return 'sanskrit';
    return 'english';
  }

  private extractConcepts(query: string): string[] {
    // Enhanced concept extraction using medical/ayurvedic term patterns
    const concepts: string[] = [];
    const words = query.toLowerCase().split(/\s+/);
    
    // Medical terms pattern matching
    const medicalTerms = ['herb', 'medicine', 'treatment', 'therapy', 'compound', 'extract', 'formula'];
    const ayurvedicTerms = ['dosha', 'vata', 'pitta', 'kapha', 'rasa', 'virya', 'vipaka', 'guna'];
    
    words.forEach(word => {
      if (medicalTerms.includes(word) || ayurvedicTerms.includes(word)) {
        concepts.push(word);
      }
    });

    return concepts;
  }

  private findSynonyms(concepts: string[]): string[] {
    const synonymMap: Record<string, string[]> = {
      'herb': ['plant', 'botanical', 'medicinal plant'],
      'medicine': ['drug', 'remedy', 'therapeutic agent'],
      'treatment': ['therapy', 'healing', 'cure'],
      'compound': ['chemical', 'substance', 'ingredient']
    };

    const synonyms: string[] = [];
    concepts.forEach(concept => {
      if (synonymMap[concept]) {
        synonyms.push(...synonymMap[concept]);
      }
    });

    return synonyms;
  }

  private calculateQueryComplexity(query: string): number {
    // Calculate complexity based on query features
    const words = query.split(/\s+/).length;
    const hasSpecialTerms = /\b(and|or|not|effect|mechanism|interaction)\b/i.test(query);
    const hasQuotes = query.includes('"');
    
    let complexity = Math.min(words / 10, 1); // Base complexity from word count
    if (hasSpecialTerms) complexity += 0.3;
    if (hasQuotes) complexity += 0.2;
    
    return Math.min(complexity, 1);
  }

  private analyzeConceptFrequency(results: LiteratureResult[]): Array<{ concept: string; frequency: number; confidence: number }> {
    const conceptMap = new Map<string, { count: number; totalConfidence: number }>();
    
    results.forEach(result => {
      // Analyze herbs - handle both old and new format
      result.extractedEntities.herbs.forEach(herb => {
        const key = typeof herb === 'string' ? herb : herb.name;
        const confidence = typeof herb === 'string' ? 0.5 : herb.confidence;
        
        if (!conceptMap.has(key)) {
          conceptMap.set(key, { count: 0, totalConfidence: 0 });
        }
        const entry = conceptMap.get(key)!;
        entry.count++;
        entry.totalConfidence += confidence;
      });
    });

    return Array.from(conceptMap.entries())
      .map(([concept, data]) => ({
        concept,
        frequency: data.count,
        confidence: data.totalConfidence / data.count
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  private generateCrossLinguisticMappings(results: LiteratureResult[]): Array<{ term: string; translations: Record<string, string> }> {
    const mappings: Array<{ term: string; translations: Record<string, string> }> = [];
    
    // Extract terms that have translations available
    results.forEach(result => {
      if (result.translations) {
        const translations: Record<string, string> = {};
        if (result.translations['english']) translations['english'] = result.translations['english'];
        if (result.translations['telugu']) translations['telugu'] = result.translations['telugu'];
        if (result.translations['sanskrit']) translations['sanskrit'] = result.translations['sanskrit'];
        
        if (Object.keys(translations).length > 1) {
          mappings.push({
            term: result.title,
            translations
          });
        }
      }
    });

    return mappings.slice(0, 5);
  }

  private identifyTherapeuticPatterns(results: LiteratureResult[]): Array<{ pattern: string; frequency: number; sources: string[] }> {
    const patternMap = new Map<string, { count: number; sources: Set<string> }>();
    
    results.forEach(result => {
      result.extractedEntities.therapeuticUses.forEach(use => {
        const useString = typeof use === 'string' ? use : use.use;
        
        if (!patternMap.has(useString)) {
          patternMap.set(useString, { count: 0, sources: new Set() });
        }
        const entry = patternMap.get(useString)!;
        entry.count++;
        entry.sources.add(result.source.name);
      });
    });

    return Array.from(patternMap.entries())
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.count,
        sources: Array.from(data.sources)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  private analyzeTimelineTrends(results: LiteratureResult[]): Array<{ period: string; developments: string[] }> {
    const timelineMap = new Map<string, string[]>();
    
    results.forEach(result => {
      if (result.source.year) {
        const decade = Math.floor(result.source.year / 10) * 10;
        const period = `${decade}s`;
        
        if (!timelineMap.has(period)) {
          timelineMap.set(period, []);
        }
        timelineMap.get(period)!.push(result.title);
      }
    });

    return Array.from(timelineMap.entries())
      .map(([period, developments]) => ({ period, developments: developments.slice(0, 3) }))
      .sort((a, b) => parseInt(b.period) - parseInt(a.period));
  }

  private generateRelatedQueries(originalQuery: string, _results: LiteratureResult[]): string[] {
    const queries: string[] = [];
    const concepts = this.extractConcepts(originalQuery);
    
    // Generate queries based on found concepts
    concepts.forEach(concept => {
      queries.push(`${concept} mechanisms of action`);
      queries.push(`${concept} clinical studies`);
      queries.push(`${concept} traditional preparation methods`);
    });

    return queries.slice(0, 5);
  }

  private suggestReadings(results: LiteratureResult[]): string[] {
    return results
      .filter(result => result.source.reliability > 0.7)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
      .map(result => `${result.title} - ${result.source.name}`);
  }

  private recommendExpertConsultation(results: LiteratureResult[]): string[] {
    const recommendations: string[] = [];
    const hasTraditionalContent = results.some(r => r.source.type === 'traditional_text');
    const hasModernContent = results.some(r => r.source.type === 'scientific_paper');
    
    if (hasTraditionalContent) {
      recommendations.push('Ayurvedic practitioner consultation recommended');
    }
    if (hasModernContent) {
      recommendations.push('Pharmacology expert consultation recommended');
    }
    
    return recommendations;
  }

  private generateCulturalNotes(results: LiteratureResult[], language: string): string[] {
    const notes: string[] = [];
    
    if (language === 'telugu') {
      notes.push('Telugu medical traditions emphasize regional herb varieties');
      notes.push('Consider local preparation methods specific to Andhra Pradesh/Telangana');
    }
    
    const hasTraditionalSources = results.some(r => r.source.type === 'traditional_text');
    if (hasTraditionalSources) {
      notes.push('Traditional texts require cultural context for proper interpretation');
      notes.push('Seasonal and regional variations should be considered');
    }
    
    return notes;
  }
}