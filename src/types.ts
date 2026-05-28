export type Category = 'classic_ml' | 'recsys' | 'nlp' | 'cv';
export type Domain =
  | 'retail'
  | 'fintech'
  | 'adtech'
  | 'travel'
  | 'telecom'
  | 'realestate'
  | 'media'
  | 'logistics';

export interface Case {
  id: string;
  title: string;
  category: Category;
  domain: Domain;
  problemStatement: string;
  clarifyingQuestions: string[];
}

export type Filter<T extends string> = T | 'all';
