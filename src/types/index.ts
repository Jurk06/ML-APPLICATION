// Define types
export type DatasetName = 'iris' | 'digits' | 'wine' | 'breast_cancer' | 'diabetes';

export interface Dataset {
  name: DatasetName;
  description: string;
  features: number;
  samples: number;
  classes: number;
}

export interface ModelResult {
  predictions: number[];
  accuracy: number;
  confusionMatrix: number[][];
}