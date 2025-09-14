#!/usr/bin/env tsx
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedFunctions = void 0;
exports.seedDatabase = seedDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const logger_1 = __importDefault(require("../utils/logger"));
// Import all models
const User_1 = require("../models/User");
const Herb_1 = require("../models/Herb");
const Agent_1 = require("../models/Agent");
const Compound_1 = require("../models/Compound");
const Literature_1 = require("../models/Literature");
/**
 * Comprehensive Ayurvedic Herb Database
 */
const seedHerbs = [
    {
        name: {
            sanskrit: 'हरिद्रा (Haridra)',
            english: 'Turmeric',
            telugu: 'పసుపు (Pasupu)',
            botanical: 'Curcuma longa'
        },
        description: 'A golden spice revered in Ayurveda for its powerful anti-inflammatory and blood-purifying properties. Extensively used in traditional medicine for wound healing, skin disorders, and digestive health.',
        properties: {
            rasa: ['katu', 'tikta'],
            virya: 'ushna',
            vipaka: 'katu',
            guna: ['ruksha', 'laghu'],
            dosha: ['kapha', 'vata']
        },
        therapeuticUses: [
            'Wound healing',
            'Anti-inflammatory conditions',
            'Skin disorders',
            'Blood purification',
            'Digestive disorders',
            'Liver support'
        ],
        contraindications: [
            'Gallstones',
            'Bleeding disorders',
            'Pregnancy (high doses)',
            'Surgery (discontinue 2 weeks prior)'
        ],
        compounds: [],
        references: [],
        verificationStatus: 'verified'
    },
    {
        name: {
            sanskrit: 'अश्वगन्धा (Ashwagandha)',
            english: 'Ashwagandha',
            telugu: 'అశ్వగంధ (Ashwagandha)',
            botanical: 'Withania somnifera'
        },
        description: 'Known as Indian Winter Cherry, this powerful adaptogenic herb is renowned for its ability to enhance strength, vitality, and stress resilience. A premier rasayana (rejuvenative) in Ayurveda.',
        properties: {
            rasa: ['kashaya', 'tikta', 'madhura'],
            virya: 'ushna',
            vipaka: 'madhura',
            guna: ['snigdha', 'laghu'],
            dosha: ['vata', 'kapha']
        },
        therapeuticUses: [
            'Stress management',
            'Sleep disorders',
            'Immune enhancement',
            'Cognitive function',
            'Physical strength',
            'Sexual health'
        ],
        contraindications: [
            'Autoimmune diseases',
            'Thyroid disorders',
            'Pregnancy',
            'Severe depression (without supervision)'
        ],
        compounds: [],
        references: [],
        verificationStatus: 'verified'
    },
    {
        name: {
            sanskrit: 'ब्राह्मी (Brahmi)',
            english: 'Brahmi',
            telugu: 'బ్రాహ్మి (Brahmi)',
            botanical: 'Bacopa monnieri'
        },
        description: 'A sacred herb dedicated to Brahma, the creator. Renowned for enhancing memory, intelligence, and spiritual awareness. Extensively studied for cognitive enhancement and neuroprotection.',
        properties: {
            rasa: ['tikta', 'kashaya', 'madhura'],
            virya: 'sheeta',
            vipaka: 'madhura',
            guna: ['laghu', 'sara'],
            dosha: ['vata', 'pitta', 'kapha']
        },
        therapeuticUses: [
            'Memory enhancement',
            'Cognitive disorders',
            'ADHD',
            'Anxiety',
            'Speech disorders',
            'Epilepsy'
        ],
        contraindications: [
            'Bradycardia',
            'Gastric ulcers',
            'Urinary obstruction',
            'Hypotension'
        ],
        compounds: [],
        references: [],
        verificationStatus: 'verified'
    },
    {
        name: {
            sanskrit: 'निम्ब (Nimba)',
            english: 'Neem',
            telugu: 'వేప (Vepa)',
            botanical: 'Azadirachta indica'
        },
        description: 'The divine tree with bitter taste but sweet results. Every part is medicinal, offering powerful antimicrobial, antifungal, and blood-purifying properties.',
        properties: {
            rasa: ['tikta', 'kashaya'],
            virya: 'sheeta',
            vipaka: 'katu',
            guna: ['laghu', 'ruksha'],
            dosha: ['kapha', 'pitta']
        },
        therapeuticUses: [
            'Skin conditions',
            'Blood purification',
            'Dental health',
            'Diabetes management',
            'Parasitic infections',
            'Fever'
        ],
        contraindications: [
            'Pregnancy',
            'Infertility treatment',
            'Autoimmune conditions',
            'Children under 2 years'
        ],
        compounds: [],
        references: [],
        verificationStatus: 'verified'
    },
    {
        name: {
            sanskrit: 'गुडूची (Guduchi)',
            english: 'Guduchi',
            telugu: 'తిప్పతీగ (Tippatiga)',
            botanical: 'Tinospora cordifolia'
        },
        description: 'Known as Amrita (divine nectar), this climbing shrub is revered for its immunomodulatory and rejuvenative properties. A powerful rasayana for all doshas.',
        properties: {
            rasa: ['tikta', 'kashaya'],
            virya: 'ushna',
            vipaka: 'madhura',
            guna: ['laghu', 'snigdha'],
            dosha: ['vata', 'pitta', 'kapha']
        },
        therapeuticUses: [
            'Immune enhancement',
            'Fever management',
            'Liver disorders',
            'Diabetes',
            'Arthritis',
            'General debility'
        ],
        contraindications: [
            'Autoimmune diseases',
            'Pregnancy',
            'Pre-surgery (discontinue 2 weeks prior)',
            'Hypoglycemia'
        ],
        compounds: [],
        references: [],
        verificationStatus: 'verified'
    }
];
/**
 * Pharmaceutical Compounds Database
 */
const seedCompounds = [
    {
        name: 'Curcumin',
        smiles: 'COc1cc(\\C=C\\C(=O)CC(=O)\\C=C\\c2ccc(O)c(OC)c2)ccc1O',
        inchi: 'InChI=1S/C21H20O6/c1-26-19-9-14(5-7-17(19)24)3-11-16(23)13-18(25)12-4-15-8-6-20(27-2)21(10-15)22/h3-12,22,24H,13H2,1-2H3/b11-3+,12-4+',
        inchiKey: 'VFLDPWHFBUODDF-FCXRPNKRSA-N',
        molecularFormula: 'C21H20O6',
        molecularWeight: 368.38,
        exactMass: 368.1260,
        iupacName: '(1E,6E)-1,7-bis(4-hydroxy-3-methoxyphenyl)hepta-1,6-diene-3,5-dione',
        commonNames: ['Diferuloylmethane', 'Curcumin I', 'E100'],
        source: {
            plantSource: 'Curcuma longa',
            synthetic: false,
            traditionalName: {
                sanskrit: 'Haridra',
                telugu: 'Pasupu',
                hindi: 'Haldi'
            },
            extractionMethod: 'Solvent extraction',
            purity: 95
        },
        properties: {
            melting_point: 183,
            solubility: {
                water: 'slightly_soluble',
                ethanol: 'highly_soluble'
            },
            stability: {
                light: 'photosensitive',
                heat: 'stable',
                air: 'stable',
                ph: 'stable'
            },
            logP: 3.2,
            bioavailability: 65,
            halfLife: 8.5
        },
        bioactivity: {
            targets: [
                { name: 'NF-κB', type: 'protein', affinity: 85 },
                { name: 'COX-2', type: 'enzyme', affinity: 78 },
                { name: 'LOX', type: 'enzyme', affinity: 72 }
            ],
            mechanisms: ['Anti-inflammatory', 'Antioxidant', 'NF-κB inhibition'],
            therapeuticAreas: ['Inflammation', 'Cancer', 'Arthritis', 'Cardiovascular'],
            pathways: ['NF-κB pathway', 'MAPK pathway', 'PI3K/Akt pathway']
        },
        admet: {
            absorption: {
                humanIntestinal: 85,
                caco2Permeability: 15.2,
                pgpSubstrate: true
            },
            distribution: {
                volumeOfDistribution: 2.1,
                proteinBinding: 95,
                bbbPermeability: false
            },
            metabolism: {
                cypSubstrates: ['CYP3A4', 'CYP2C9'],
                cypInhibitors: ['CYP2C9'],
                clearance: 45
            },
            toxicity: {
                acuteToxicity: {
                    oralLD50: 2000,
                    toxicityClass: 'low'
                },
                organToxicity: {
                    hepatotoxicity: 2,
                    cardiotoxicity: 1,
                    nephrotoxicity: 1,
                    neurotoxicity: 1
                }
            }
        },
        ayurvedicContext: {
            associatedHerb: 'Curcuma longa',
            traditionalName: {
                sanskrit: 'Haridra rasayana',
                telugu: 'Pasupu satva'
            },
            doshaEffect: ['kapha'],
            rasa: ['tikta', 'katu'],
            virya: 'ushna',
            vipaka: 'katu',
            traditionalUses: ['Rakta sodhana', 'Vranahara', 'Kushtahara']
        },
        classification: {
            chemicalClass: ['Curcuminoids', 'Polyphenols', 'Beta-diketones'],
            pharmacologicalClass: ['Anti-inflammatory', 'Antioxidant', 'Anticancer'],
            therapeuticClass: ['Nutraceutical', 'Natural product']
        },
        research: {
            publications: 15000,
            evidenceLevel: 'phase_3'
        }
    },
    {
        name: 'Withanoside IV',
        smiles: 'C[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@@H](CC[C@]4(C)[C@H]3CC[C@]2(C)[C@@H]1O)O[C@H]5O[C@H](CO)[C@@H](O)[C@H](O)[C@H]5O',
        inchi: 'InChI=1S/C33H54O9/c1-18-5-10-23-31(2)12-8-25(37)32(3)24(7-11-28(31)19(18)17-35)20-14-21(36)16-30(20,4)29-15-22(38)9-6-33(29,23)42-26-13-27(39)41-40/h18-29,35-40H,5-17H2,1-4H3/t18-,19+,20-,21+,22-,23+,24-,25+,26+,27-,28+,29-,30+,31+,32-,33+/m0/s1',
        inchiKey: 'UFBJCMKXNXGKGG-NWDGAFQWSA-N',
        molecularFormula: 'C33H54O9',
        molecularWeight: 594.78,
        exactMass: 594.7811,
        iupacName: '(3β,6α,23R)-23-hydroxy-ergost-5-en-3-yl β-D-glucopyranoside',
        commonNames: ['Withanoside IV', 'Ashwagandha glycoside'],
        source: {
            plantSource: 'Withania somnifera',
            synthetic: false,
            traditionalName: {
                sanskrit: 'Ashwagandha saponin',
                telugu: 'Aswagandha glycoside'
            }
        },
        properties: {
            solubility: {
                water: 'moderately_soluble',
                ethanol: 'highly_soluble'
            },
            stability: {
                light: 'stable',
                heat: 'stable',
                air: 'stable',
                ph: 'stable'
            },
            logP: 2.8,
            bioavailability: 72,
            halfLife: 12.3
        },
        bioactivity: {
            targets: [
                { name: 'GABA receptors', type: 'receptor', affinity: 82 },
                { name: 'Cortisol receptors', type: 'receptor', affinity: 76 }
            ],
            mechanisms: ['Adaptogenic', 'Anxiolytic', 'Neuroprotective'],
            therapeuticAreas: ['Stress', 'Anxiety', 'Cognitive enhancement', 'Sleep disorders']
        },
        ayurvedicContext: {
            associatedHerb: 'Withania somnifera',
            doshaEffect: ['vata', 'kapha'],
            traditionalUses: ['Rasayana', 'Medhya rasayana', 'Balya']
        },
        research: {
            publications: 850,
            evidenceLevel: 'phase_2'
        }
    },
    {
        name: 'Bacoside A',
        smiles: 'C[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@@H](CC[C@]4(C)[C@H]3CC[C@]2(C)[C@@H]1O[C@H]5O[C@H](CO)[C@@H](O[C@H]6O[C@H](CO)[C@@H](O)[C@H](O)[C@H]6O)[C@H](O)[C@H]5O)O',
        inchi: 'InChI=1S/C41H68O13/c1-20-7-12-27-39(3)16-14-29(45)40(4)28(10-15-35(39)21(20)19-43)22-17-23(44)18-38(22,2)36-13-11-37(27)54-32-8-25(46)9-6-41(32,5)53-34-26(47)31(50)33(24(18-42)52-34)51-30-11-9-28(48)25(46)23(30)19-43/h20-37,42-50H,6-19H2,1-5H3/t20-,21+,22-,23+,24+,25-,26+,27+,28-,29+,30+,31-,32+,33-,34+,35+,36-,37+,38+,39+,40-,41+/m0/s1',
        inchiKey: 'KGFQBWRZSKURAA-TUVWXYZABC-N',
        molecularFormula: 'C41H68O13',
        molecularWeight: 768.98,
        exactMass: 768.4608,
        iupacName: '(3β,16α,20S,24S)-16,20:24,25-diepoxy-cucurbita-5,23-dien-3-yl 3-O-α-L-arabinopyranosyl-β-D-glucopyranoside',
        commonNames: ['Bacoside A', 'Brahmi saponin', 'Bacopa glycoside'],
        source: {
            plantSource: 'Bacopa monnieri',
            synthetic: false,
            traditionalName: {
                sanskrit: 'Brahmi saponin',
                telugu: 'Brahmi glycoside'
            }
        },
        properties: {
            solubility: {
                water: 'moderately_soluble',
                ethanol: 'highly_soluble'
            },
            logP: 1.9,
            bioavailability: 68,
            halfLife: 15.7
        },
        bioactivity: {
            targets: [
                { name: 'Acetylcholinesterase', type: 'enzyme', affinity: 79 },
                { name: 'NMDA receptors', type: 'receptor', affinity: 71 }
            ],
            mechanisms: ['Nootropic', 'Neuroprotective', 'Cholinesterase inhibition'],
            therapeuticAreas: ['Cognitive enhancement', 'Memory disorders', 'Alzheimer\'s disease']
        },
        ayurvedicContext: {
            associatedHerb: 'Bacopa monnieri',
            doshaEffect: ['vata', 'pitta'],
            traditionalUses: ['Medhya rasayana', 'Smriti vardhaka', 'Saraswatarishta']
        },
        research: {
            publications: 650,
            evidenceLevel: 'phase_2'
        }
    }
];
/**
 * Literature Database with Classical Texts and Modern Research
 */
const seedLiterature = [
    {
        title: 'Charaka Samhita - Sutrasthana',
        type: 'classical_text',
        authors: [{ name: 'Acharya Charaka', isFirstAuthor: true }],
        publication: {
            year: 1000,
            publisher: 'Ancient Sanskrit Text'
        },
        language: 'en',
        originalLanguage: 'sanskrit',
        abstract: 'Fundamental principles of Ayurveda including dravyaguna (pharmacology), rasa (taste), virya (potency), and prabhava (special effect) of medicinal substances.',
        keywords: ['ayurveda', 'dravyaguna', 'classical', 'pharmacology', 'sutrasthana'],
        evidenceLevel: 'traditional',
        focus: {
            herbs: ['turmeric', 'ashwagandha', 'brahmi', 'neem'],
            therapeuticAreas: ['general medicine', 'pharmacology', 'therapeutics'],
            methodologies: ['traditional knowledge', 'observational']
        },
        traditionalContext: {
            period: '300 BCE - 300 CE',
            region: 'Indian subcontinent',
            tradition: 'ayurveda',
            originalTitle: {
                sanskrit: 'चरक संहिता - सूत्रस्थान',
                hindi: 'चरक संहिता - सूत्रस्थान'
            },
            authorBiography: {
                region: 'Ancient India',
                school: 'Ayurveda',
                notableWorks: ['Charaka Samhita']
            }
        },
        quality: {
            peerReviewed: false,
            citationCount: 5000
        },
        access: {
            openAccess: true,
            availability: 'freely_available',
            digitalFormat: true
        }
    },
    {
        title: 'Curcumin: A Review of Its Effects on Human Health',
        type: 'review',
        authors: [
            { name: 'Hewlings, S.J.', isFirstAuthor: true },
            { name: 'Kalman, D.S.', isFirstAuthor: false }
        ],
        publication: {
            journal: 'Foods',
            volume: '6',
            issue: '10',
            pages: '92',
            year: 2017,
            doi: '10.3390/foods6100092',
            pmid: '29065496'
        },
        language: 'en',
        abstract: 'Curcumin is a bioactive compound found in turmeric (Curcuma longa) that has been extensively studied for its health benefits. This review examines the evidence for curcumin\'s anti-inflammatory, antioxidant, and therapeutic properties.',
        keywords: ['curcumin', 'turmeric', 'inflammation', 'antioxidant', 'therapeutic'],
        studyType: 'systematic_review',
        evidenceLevel: 'high',
        focus: {
            herbs: ['turmeric'],
            compounds: ['curcumin'],
            therapeuticAreas: ['inflammation', 'cancer', 'cardiovascular disease'],
            methodologies: ['systematic review', 'meta-analysis']
        },
        scientificValidation: {
            replicationStudies: 125,
            citedBy: 485,
            currentStatus: 'validated'
        },
        quality: {
            peerReviewed: true,
            impactFactor: 4.1,
            quartile: 'Q1',
            citationCount: 485,
            biasRisk: 'low'
        },
        extractedData: {
            compounds: [
                {
                    name: 'Curcumin',
                    source: 'Curcuma longa',
                    concentration: '2-8%',
                    activity: ['Anti-inflammatory', 'Antioxidant', 'Anticancer'],
                    mechanism: 'NF-κB pathway inhibition'
                }
            ],
            clinicalFindings: [
                {
                    indication: 'Osteoarthritis',
                    intervention: 'Curcumin 500mg twice daily',
                    outcome: 'Significant reduction in pain and stiffness',
                    significance: 'p < 0.05',
                    sampleSize: 367,
                    duration: '8 weeks'
                }
            ]
        }
    },
    {
        title: 'Withania somnifera: An Overview',
        type: 'research_paper',
        authors: [
            { name: 'Singh, N.', isFirstAuthor: true },
            { name: 'Bhalla, M.', isFirstAuthor: false },
            { name: 'de Jager, P.', isFirstAuthor: false }
        ],
        publication: {
            journal: 'Phytotherapy Research',
            volume: '25',
            issue: '8',
            pages: '1193-1200',
            year: 2011,
            doi: '10.1002/ptr.3454',
            pmid: '21287564'
        },
        language: 'en',
        abstract: 'Withania somnifera (Ashwagandha) is an important medicinal plant used in Ayurveda. This review covers its traditional uses, phytochemistry, and modern pharmacological studies.',
        keywords: ['ashwagandha', 'withania', 'adaptogen', 'stress', 'anxiety'],
        studyType: 'systematic_review',
        evidenceLevel: 'high',
        focus: {
            herbs: ['ashwagandha'],
            compounds: ['withanoside', 'withanolide'],
            therapeuticAreas: ['stress', 'anxiety', 'cognitive enhancement'],
            methodologies: ['literature review', 'phytochemical analysis']
        },
        quality: {
            peerReviewed: true,
            impactFactor: 3.2,
            quartile: 'Q2',
            citationCount: 234
        }
    },
    {
        title: 'Cognitive Enhancement Effects of Bacopa monnieri: A Systematic Review',
        type: 'research_paper',
        authors: [
            { name: 'Pase, M.P.', isFirstAuthor: true },
            { name: 'Kean, J.', isFirstAuthor: false },
            { name: 'Sarris, J.', isFirstAuthor: false }
        ],
        publication: {
            journal: 'Journal of Alternative and Complementary Medicine',
            volume: '18',
            issue: '7',
            pages: '647-652',
            year: 2012,
            doi: '10.1089/acm.2011.0367',
            pmid: '22747190'
        },
        language: 'en',
        abstract: 'This systematic review evaluates the cognitive enhancement effects of Bacopa monnieri (Brahmi) based on clinical trials and traditional knowledge.',
        keywords: ['bacopa', 'brahmi', 'cognitive enhancement', 'memory', 'nootropic'],
        studyType: 'systematic_review',
        evidenceLevel: 'high',
        focus: {
            herbs: ['brahmi'],
            compounds: ['bacoside'],
            therapeuticAreas: ['cognitive enhancement', 'memory', 'learning'],
            methodologies: ['systematic review', 'clinical trials']
        },
        quality: {
            peerReviewed: true,
            impactFactor: 2.8,
            citationCount: 156
        }
    },
    {
        title: 'Sushruta Samhita - Kalpasthana',
        type: 'classical_text',
        authors: [{ name: 'Acharya Sushruta', isFirstAuthor: true }],
        publication: {
            year: 1000,
            publisher: 'Ancient Sanskrit Text'
        },
        language: 'en',
        abstract: 'Ancient surgical text describing medicinal preparations, toxicology, and therapeutic formulations in Ayurveda.',
        keywords: ['surgery', 'toxicology', 'formulations', 'kalpa', 'ayurveda'],
        evidenceLevel: 'traditional',
        focus: {
            therapeuticAreas: ['surgery', 'toxicology', 'pharmacology'],
            methodologies: ['traditional knowledge', 'clinical observation']
        },
        traditionalContext: {
            period: '600 BCE - 1000 CE',
            region: 'Indian subcontinent',
            tradition: 'ayurveda',
            originalTitle: {
                sanskrit: 'सुश्रुत संहिता - कल्पस्थान'
            }
        },
        quality: {
            peerReviewed: false,
            citationCount: 3000
        },
        access: {
            openAccess: true,
            availability: 'freely_available'
        }
    }
];
/**
 * User Profiles for Different Researcher Types
 */
const seedUsers = [
    {
        email: 'dr.sharma@ayurresearch.in',
        name: 'Dr. Priya Sharma',
        role: 'researcher',
        preferences: {
            language: 'hindi',
            culturalContext: 'traditional',
            researchFocus: ['ayurveda', 'traditional_medicine', 'herbs'],
            outputFormat: 'detailed'
        },
        profile: {
            specialization: 'Ayurvedic Pharmacology',
            institution: 'All India Institute of Ayurveda',
            experience: 15,
            publications: 45
        }
    },
    {
        email: 'researcher@pharmatech.com',
        name: 'Dr. Michael Chen',
        role: 'researcher',
        preferences: {
            language: 'english',
            culturalContext: 'modern',
            researchFocus: ['drug_discovery', 'pharmacology', 'clinical_trials'],
            outputFormat: 'technical'
        },
        profile: {
            specialization: 'Pharmaceutical Chemistry',
            institution: 'BioPharm Research Institute',
            experience: 12,
            publications: 67
        }
    },
    {
        name: 'Dr. Lakshmi Reddy',
        email: 'lakshmi.reddy@traditionalmedicine.org',
        role: 'practitioner',
        preferences: {
            language: 'telugu',
            culturalContext: 'integrated',
            researchFocus: ['clinical_practice', 'patient_care', 'herb_interactions'],
            outputFormat: 'practical'
        },
        profile: {
            specialization: 'Integrative Medicine',
            institution: 'Traditional Medicine Clinic',
            experience: 20,
            publications: 23
        }
    }
];
/**
 * Agent Configuration Data
 */
const seedAgents = [
    {
        name: 'Literature Processing Agent',
        type: 'knowledge_curator',
        description: 'Advanced agent specialized in processing multi-language literature, analyzing cultural context, and interpreting classical Ayurvedic texts.',
        status: 'active',
        capabilities: [
            'Multi-language text processing',
            'Cultural context analysis',
            'Cross-linguistic mapping',
            'Classical text interpretation'
        ],
        configuration: {
            supportedLanguages: ['english', 'sanskrit', 'hindi', 'telugu'],
            processingModes: ['semantic', 'cultural', 'traditional'],
            outputFormats: ['detailed', 'summary', 'comparative']
        },
        metrics: {
            totalTasks: 1247,
            successfulTasks: 1175,
            failedTasks: 72,
            averageExecutionTime: 2.3,
            accuracy: 0.942
        }
    },
    {
        name: 'Enhanced Compound Analysis Agent',
        type: 'compound_analyzer',
        description: 'Sophisticated molecular analysis agent that performs structure analysis, ADMET prediction, toxicity assessment, and Ayurvedic profiling.',
        status: 'active',
        capabilities: [
            'Molecular structure analysis',
            'ADMET prediction',
            'Toxicity assessment',
            'Ayurvedic profiling'
        ],
        configuration: {
            analysisTypes: ['structure', 'properties', 'bioactivity', 'safety'],
            predictionModels: ['QSAR', 'molecular_dynamics', 'pharmacophore'],
            culturalIntegration: true
        },
        metrics: {
            totalTasks: 856,
            successfulTasks: 829,
            failedTasks: 27,
            averageExecutionTime: 5.7,
            accuracy: 0.968
        }
    },
    {
        name: 'Knowledge Cross-Reference Agent',
        type: 'data_collector',
        description: 'Intelligent agent that maps traditional-modern knowledge, analyzes cultural context, synthesizes evidence, and identifies research gaps.',
        status: 'active',
        capabilities: [
            'Traditional-modern knowledge mapping',
            'Cultural context analysis',
            'Evidence synthesis',
            'Research gap identification'
        ],
        configuration: {
            mappingModes: ['semantic', 'structural', 'therapeutic', 'cultural'],
            evidenceLevels: ['high', 'medium', 'low', 'preliminary'],
            culturalSensitivity: 'high'
        },
        metrics: {
            totalTasks: 423,
            successfulTasks: 379,
            failedTasks: 44,
            averageExecutionTime: 8.2,
            accuracy: 0.897
        }
    }
];
/**
 * Main seeding function
 */
async function seedDatabase() {
    try {
        logger_1.default.info('🌱 Starting database seeding process...');
        // Connect to database
        await (0, database_1.connectDatabase)();
        logger_1.default.info('✅ Database connected successfully');
        // Clear existing data (optional - comment out for production)
        logger_1.default.info('🧹 Clearing existing data...');
        await User_1.UserModel.deleteMany({});
        await Herb_1.HerbModel.deleteMany({});
        await Agent_1.AgentModel.deleteMany({});
        await Compound_1.Compound.deleteMany({});
        await Literature_1.Literature.deleteMany({});
        logger_1.default.info('✅ Existing data cleared');
        // Seed Users
        logger_1.default.info('👥 Seeding user data...');
        const createdUsers = await User_1.UserModel.insertMany(seedUsers);
        logger_1.default.info(`✅ Created ${createdUsers.length} users`);
        // Seed Herbs
        logger_1.default.info('🌿 Seeding herb data...');
        const createdHerbs = await Herb_1.HerbModel.insertMany(seedHerbs);
        logger_1.default.info(`✅ Created ${createdHerbs.length} herbs`);
        // Seed Compounds
        logger_1.default.info('🧪 Seeding compound data...');
        const createdCompounds = await Compound_1.Compound.insertMany(seedCompounds);
        logger_1.default.info(`✅ Created ${createdCompounds.length} compounds`);
        // Seed Literature
        logger_1.default.info('📚 Seeding literature data...');
        // Add addedBy field to literature entries
        const literatureWithAddedBy = seedLiterature.map(lit => ({
            ...lit,
            addedBy: createdUsers[0]._id // Use first user as the one who added literature
        }));
        const createdLiterature = await Literature_1.Literature.insertMany(literatureWithAddedBy);
        logger_1.default.info(`✅ Created ${createdLiterature.length} literature entries`);
        // Seed Agents
        logger_1.default.info('🤖 Seeding agent data...');
        const createdAgents = await Agent_1.AgentModel.insertMany(seedAgents);
        logger_1.default.info(`✅ Created ${createdAgents.length} agents`);
        // Create indexes for optimal performance
        // logger.info('📊 Creating database indexes...');
        // await createIndexes();
        // logger.info('✅ Database indexes created');
        // Note: Indexes are automatically created by model definitions
        // Verify seeded data
        logger_1.default.info('🔍 Verifying seeded data...');
        await verifySeededData();
        logger_1.default.info('✅ Data verification completed');
        logger_1.default.info('🎉 Database seeding completed successfully!');
        logger_1.default.info('📊 Summary:');
        logger_1.default.info(`   - Users: ${createdUsers.length}`);
        logger_1.default.info(`   - Herbs: ${createdHerbs.length}`);
        logger_1.default.info(`   - Compounds: ${createdCompounds.length}`);
        logger_1.default.info(`   - Literature: ${createdLiterature.length}`);
        logger_1.default.info(`   - Agents: ${createdAgents.length}`);
    }
    catch (error) {
        logger_1.default.error('❌ Database seeding failed:', error);
        throw error;
    }
    finally {
        await mongoose_1.default.connection.close();
        logger_1.default.info('🔌 Database connection closed');
    }
}
/**
 * Create database indexes for optimal performance
 */
async function createIndexes() {
    // Herb indexes
    await Herb_1.HerbModel.collection.createIndex({ name: 'text', teluguName: 'text', sanskritName: 'text', scientificName: 'text' }, {
        name: 'herb_text_search',
        weights: {
            name: 10,
            scientificName: 8,
            sanskritName: 6,
            teluguName: 6
        }
    });
    await Herb_1.HerbModel.collection.createIndex({ 'ayurvedicProperties.dosha': 1 });
    await Herb_1.HerbModel.collection.createIndex({ 'modernProperties.activeCompounds': 1 });
    await Herb_1.HerbModel.collection.createIndex({ region: 1, status: 1 });
    // User indexes
    await User_1.UserModel.collection.createIndex({ email: 1 }, { unique: true });
    await User_1.UserModel.collection.createIndex({ role: 1, 'preferences.language': 1 });
    // Agent indexes
    await Agent_1.AgentModel.collection.createIndex({ agentId: 1 }, { unique: true });
    await Agent_1.AgentModel.collection.createIndex({ type: 1, status: 1 });
    await Agent_1.AgentModel.collection.createIndex({ 'metrics.successRate': -1 });
    logger_1.default.info('📊 Database indexes created successfully');
}
/**
 * Verify that seeded data was created correctly
 */
async function verifySeededData() {
    const userCount = await User_1.UserModel.countDocuments();
    const herbCount = await Herb_1.HerbModel.countDocuments();
    const compoundCount = await Compound_1.Compound.countDocuments();
    const literatureCount = await Literature_1.Literature.countDocuments();
    const agentCount = await Agent_1.AgentModel.countDocuments();
    logger_1.default.info(`🔍 Verification results:`);
    logger_1.default.info(`   - Users in database: ${userCount}`);
    logger_1.default.info(`   - Herbs in database: ${herbCount}`);
    logger_1.default.info(`   - Compounds in database: ${compoundCount}`);
    logger_1.default.info(`   - Literature entries in database: ${literatureCount}`);
    logger_1.default.info(`   - Agents in database: ${agentCount}`);
    // Test a complex query to ensure indexes work
    const searchResults = await Herb_1.HerbModel.find({ $text: { $search: 'turmeric inflammation' } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(5);
    logger_1.default.info(`🔍 Text search test returned ${searchResults.length} results`);
    if (searchResults.length > 0) {
        logger_1.default.info(`   - Top result: ${searchResults[0].name}`);
    }
}
/**
 * Export individual seed functions for selective seeding
 */
exports.seedFunctions = {
    seedUsers: async () => {
        await User_1.UserModel.insertMany(seedUsers);
        logger_1.default.info(`✅ Seeded ${seedUsers.length} users`);
    },
    seedHerbs: async () => {
        await Herb_1.HerbModel.insertMany(seedHerbs);
        logger_1.default.info(`✅ Seeded ${seedHerbs.length} herbs`);
    },
    seedCompounds: async () => {
        await Compound_1.Compound.insertMany(seedCompounds);
        logger_1.default.info(`✅ Seeded ${seedCompounds.length} compounds`);
    },
    seedLiterature: async () => {
        await Literature_1.Literature.insertMany(seedLiterature);
        logger_1.default.info(`✅ Seeded ${seedLiterature.length} literature entries`);
    },
    seedAgents: async () => {
        await Agent_1.AgentModel.insertMany(seedAgents);
        logger_1.default.info(`✅ Seeded ${seedAgents.length} agents`);
    },
    createIndexes,
    verifySeededData
};
// Run seeding if this script is called directly
if (require.main === module) {
    seedDatabase().catch((error) => {
        logger_1.default.error('Database seeding failed:', error);
        process.exit(1);
    });
}
