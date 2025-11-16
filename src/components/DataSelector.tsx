import React from 'react';
import { Dataset, DatasetName } from '../types';

interface DataSelectorProps {
  datasets: Dataset[];
  selectedDataset: DatasetName;
  onSelectDataset: (dataset: DatasetName) => void;
  datasetInfo: Dataset | null;
}

const DataSelector: React.FC<DataSelectorProps> = ({ 
  datasets, 
  selectedDataset, 
  onSelectDataset,
  datasetInfo
}) => {
  return (
    <div className="data-selector">
      <h2>Select Dataset</h2>
      <div className="dataset-options">
        {datasets.map(dataset => (
          <div 
            key={dataset.name}
            className={`dataset-option ${selectedDataset === dataset.name ? 'selected' : ''}`}
            onClick={() => onSelectDataset(dataset.name)}
          >
            <h3>{dataset.name.charAt(0).toUpperCase() + dataset.name.slice(1)}</h3>
            <p>{dataset.description}</p>
            <div className="dataset-stats">
              <span>Features: {dataset.features}</span>
              <span>Samples: {dataset.samples}</span>
              <span>Classes: {dataset.classes}</span>
            </div>
          </div>
        ))}
      </div>
      
      {datasetInfo && (
        <div className="dataset-info">
          <h3>About {datasetInfo.name.charAt(0).toUpperCase() + datasetInfo.name.slice(1)} Dataset</h3>
          <p>{datasetInfo.description}</p>
          <div className="stats">
            <p><strong>Number of Features:</strong> {datasetInfo.features}</p>
            <p><strong>Number of Samples:</strong> {datasetInfo.samples}</p>
            <p><strong>Number of Classes:</strong> {datasetInfo.classes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSelector;