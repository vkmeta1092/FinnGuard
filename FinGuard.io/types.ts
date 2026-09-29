
export enum Screen {
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  DISEASE = 'DISEASE',
  COLD_STORAGE = 'COLD_STORAGE',
  ANALYTICS = 'ANALYTICS',
  PROFILE = 'PROFILE',
  SCHEMES = 'SCHEMES'
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  BENGALI = 'bn',
  MARATHI = 'mr',
  TELUGU = 'te',
  TAMIL = 'ta'
}

export interface PondMetrics {
  temp: number;
  ph: number;
  oxygen: number;
  ammonia: number;
}

export interface PondConfig {
  id: string;
  name: string;
  tankSize: string;
  fishCount: number;
  fishType: string;
  metrics: PondMetrics;
  healthScore: number;
  confidence: number;
}

export interface UserData {
  name: string;
  phone?: string;
  email?: string;
  location: string;
  pondSize: string;
  primarySpecies: string;
  cultureType: string;
  type: 'google' | 'standard';
}

export interface DiseaseAnalysis {
  diseaseId: string;
  confidence: number;
  treatmentPlan: string;
  recommendations: string[];
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'MEDICINE' | 'FEED' | 'EQUIPMENT' | 'SEEDS';
  price: number;
  rating: number;
  image: string;
}

export interface ColdStorage {
  id: string;
  name: string;
  distance: string;
  capacity: string;
  pricePerDay: number;
  rating: number;
  image: string;
}

export interface GovScheme {
  id: string;
  title: string;
  category: 'SUBSIDY' | 'LOAN' | 'TRAINING' | 'INFRASTRUCTURE';
  benefit: string;
  eligibility: string;
  description: string;
  link: string;
}
