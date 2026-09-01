export type Category = 'classic_ml' | 'recsys' | 'cv' | 'llm_engineer' | 'ai_engineer';
export type Domain =
  | 'retail'
  | 'fintech'
  | 'adtech'
  | 'travel'
  | 'telecom'
  | 'realestate'
  | 'media'
  | 'logistics'
  | 'gambling'
  | 'legal'
  | 'enterprise'
  | 'social';

export interface Case {
  id: string;
  title: string;
  categories: Category[];
  domain: Domain;
  problemStatement: string;
  clarifyingQuestions: string[];
}

export type Filter<T extends string> = T | 'all';
