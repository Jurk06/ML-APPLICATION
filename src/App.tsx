import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import DataSelector from './components/DataSelector';
import ModelTrainer from './components/ModelTrainer';
import ModelVisualizer from './components/ModelVisualizer';
import ModelEvaluator from './components/ModelEvaluator';
import { getDataset, trainModel, DatasetData } from './services/datasetService';
import { Dataset, DatasetName, ModelResult } from './types';

function App() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetName>('iris');
  const [datasetInfo, setDatasetInfo] = useState<Dataset | null>(null);
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainPercentage, setTrainPercentage] = useState(80);

  // Define available datasets
  const datasets: Dataset[] = useMemo(() => [
    {
      name: 'iris',
      description: 'The Iris dataset contains 3 classes of flowers with 4 features each',
      features: 4,
      samples: 150,
      classes: 3
    },
    {
      name: 'digits',
      description: 'The Digits dataset contains 8x8 images of handwritten digits',
      features: 64,
      samples: 1797,
      classes: 10
    },
    {
      name: 'wine',
      description: 'The Wine dataset contains results of a chemical analysis of wines',
      features: 13,
      samples: 178,
      classes: 3
    },
    {
      name: 'breast_cancer',
      description: 'The Breast Cancer Wisconsin dataset for binary classification',
      features: 30,
      samples: 569,
      classes: 2
    },
    {
      name: 'diabetes',
      description: 'The Diabetes dataset for regression (binary classification based on threshold)',
      features: 10,
      samples: 442,
      classes: 2
    }
  ], []);

  useEffect(() => {
    // Initialize TensorFlow.js
    tf.ready()
      .then(() => {
        console.log('TensorFlow.js is ready');
      })
      .catch(err => {
        console.error('Error initializing TensorFlow.js:', err);
        alert('Failed to initialize TensorFlow.js. Some features may not work properly.');
      });

    // Update dataset info when selected dataset changes
    const dataset = datasets.find(d => d.name === selectedDataset) as Dataset | undefined;
    setDatasetInfo(dataset || null);
  }, [selectedDataset, datasets]);

  useEffect(() => {
    // Preload TensorFlow.js backend
    const initTf = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js backend loaded');
      } catch (err) {
        console.error('Error loading TensorFlow.js backend:', err);
      }
    };

    initTf();
  }, []);

  // Function to handle model training
  const handleTrainModel = async () => {
    setIsTraining(true);

    try {
      // Get the selected dataset
      const datasetData: DatasetData | null = getDataset(selectedDataset);

      if (!datasetData) {
        throw new Error(`Dataset ${selectedDataset} not found`);
      }

      // Simulate training process for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Train the model
      const result = await trainModel(datasetData, trainPercentage);

      setModelResult(result);
    } catch (error: any) {
      console.error('Error training model:', error);
      let errorMessage = 'An error occurred during training. Please try again.';

      if (error.message) {
        errorMessage += `\nDetails: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Machine Learning Classification Explorer</h1>
        <p>Select a dataset and train a classification model</p>
      </header>

      <main className="App-main">
        <DataSelector
          datasets={datasets}
          selectedDataset={selectedDataset}
          onSelectDataset={setSelectedDataset}
          datasetInfo={datasetInfo}
        />

        <div className="training-controls">
          <label>
            Training Data Percentage:
            <input
              type="range"
              min="50"
              max="90"
              value={trainPercentage}
              onChange={(e) => setTrainPercentage(parseInt(e.target.value))}
            />
            <span>{trainPercentage}%</span>
          </label>

          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="train-button"
          >
            {isTraining ? 'Training...' : 'Train Model'}
          </button>
        </div>

        {modelResult && (
          <>
            <ModelVisualizer
              dataset={selectedDataset}
              predictions={modelResult.predictions}
              accuracy={modelResult.accuracy}
            />

            <ModelEvaluator
              accuracy={modelResult.accuracy}
              confusionMatrix={modelResult.confusionMatrix}
            />
          </>
        )}

        <ModelTrainer
          dataset={selectedDataset}
          trainPercentage={trainPercentage}
          isTraining={isTraining}
        />
      </main>
    </div>
  );
}

export default App;