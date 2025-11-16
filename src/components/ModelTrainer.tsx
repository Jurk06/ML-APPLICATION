import React from 'react';
import { DatasetName } from '../types';

interface ModelTrainerProps {
  dataset: DatasetName;
  trainPercentage: number;
  isTraining: boolean;
}

const ModelTrainer: React.FC<ModelTrainerProps> = ({ 
  dataset, 
  trainPercentage,
  isTraining
}) => {
  return (
    <div className="model-trainer">
      <h2>Model Training Information</h2>
      <div className="training-info">
        <p><strong>Dataset:</strong> {dataset.charAt(0).toUpperCase() + dataset.slice(1)}</p>
        <p><strong>Training Data:</strong> {trainPercentage}%</p>
        <p><strong>Validation Data:</strong> {100 - trainPercentage}%</p>
        <p><strong>Status:</strong> {isTraining ? 'Training in progress...' : 'Ready to train'}</p>
      </div>
      
      <div className="algorithm-info">
        <h3>Classification Algorithm: Support Vector Machine (SVM)</h3>
        <p>
          SVM is a supervised learning model that finds the optimal hyperplane 
          that separates different classes with the maximum margin.
        </p>
      </div>
    </div>
  );
};

export default ModelTrainer;