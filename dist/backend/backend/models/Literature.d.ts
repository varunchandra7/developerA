import mongoose, { Document } from 'mongoose';
export interface ILiterature extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    authors: Array<{
        name: string;
        affiliation?: string;
        orcid?: string;
        isFirstAuthor: boolean;
        isCorrespondingAuthor: boolean;
    }>;
    publication: {
        journal?: string;
        book?: string;
        conference?: string;
        publisher?: string;
        volume?: string;
        issue?: string;
        pages?: string;
        year: number;
        doi?: string;
        pmid?: string;
        isbn?: string;
        url?: string;
    };
    type: 'research_paper' | 'review' | 'book' | 'book_chapter' | 'classical_text' | 'thesis' | 'conference_paper' | 'patent' | 'clinical_trial' | 'case_report' | 'traditional_manuscript' | 'compendium' | 'commentary';
    language: string;
    originalLanguage?: string;
    translation?: {
        translator: string;
        year: number;
        notes?: string;
    };
    abstract?: string;
    keywords: string[];
    meshTerms?: string[];
    studyType?: 'in_vitro' | 'in_vivo' | 'clinical_trial' | 'observational' | 'case_control' | 'cohort' | 'systematic_review' | 'meta_analysis' | 'traditional_knowledge' | 'ethnobotanical' | 'theoretical';
    evidenceLevel: 'very_high' | 'high' | 'moderate' | 'low' | 'very_low' | 'traditional';
    focus: {
        herbs: string[];
        compounds: string[];
        diseases: string[];
        therapeuticAreas: string[];
        methodologies: string[];
    };
    traditionalContext?: {
        period: string;
        region: string;
        tradition: 'ayurveda' | 'unani' | 'siddha' | 'traditional_chinese' | 'folk' | 'other';
        originalTitle?: Record<string, string>;
        commentaries?: Array<{
            author: string;
            period: string;
            notes: string;
        }>;
        manuscripts?: Array<{
            location: string;
            catalogNumber?: string;
            condition: string;
        }>;
        authorBiography?: {
            birthYear?: number;
            deathYear?: number;
            region: string;
            school: string;
            notableWorks: string[];
        };
    };
    scientificValidation?: {
        replicationStudies: number;
        citedBy: number;
        supportingEvidence: string[];
        contradictingEvidence: string[];
        currentStatus: 'validated' | 'partially_validated' | 'unvalidated' | 'refuted' | 'unknown';
        lastValidated: Date;
    };
    quality: {
        peerReviewed: boolean;
        impactFactor?: number;
        quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
        citationCount: number;
        methodologyScore?: number;
        biasRisk?: 'low' | 'moderate' | 'high' | 'unclear';
    };
    extractedData?: {
        formulations: Array<{
            name: string;
            ingredients: Array<{
                herb: string;
                quantity?: string;
                preparation?: string;
            }>;
            preparation: string;
            dosage?: string;
            duration?: string;
            indications: string[];
        }>;
        compounds: Array<{
            name: string;
            source: string;
            concentration?: string;
            activity: string[];
            mechanism?: string;
        }>;
        clinicalFindings: Array<{
            indication: string;
            intervention: string;
            outcome: string;
            significance: string;
            sampleSize?: number;
            duration?: string;
        }>;
        safety: Array<{
            herb: string;
            adverseEvents: string[];
            contraindications: string[];
            interactions: string[];
            dosageGuidelines?: string;
        }>;
    };
    relatedLiterature: Array<{
        id: mongoose.Types.ObjectId;
        relationship: 'cites' | 'cited_by' | 'supports' | 'contradicts' | 'reviews' | 'extends';
        relevanceScore: number;
    }>;
    access: {
        openAccess: boolean;
        subscription?: string;
        availability: 'freely_available' | 'subscription_required' | 'purchase_required' | 'library_only' | 'restricted' | 'manuscript_only';
        digitalFormat: boolean;
        physicalLocation?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
    addedBy: mongoose.Types.ObjectId;
    lastReviewedBy?: mongoose.Types.ObjectId;
    lastReviewedAt?: Date;
    status: 'active' | 'under_review' | 'archived' | 'deprecated';
    confidence: number;
    relevanceScore: number;
}
export declare const Literature: mongoose.Model<ILiterature, {}, {}, {}, mongoose.Document<unknown, {}, ILiterature> & ILiterature & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
export default Literature;
