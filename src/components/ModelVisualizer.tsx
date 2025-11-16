import React from 'react';
import { DatasetName } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ModelVisualizerProps {
  dataset: DatasetName;
  predictions: number[];
  accuracy: number;
}

const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ 
  dataset, 
  predictions,
  accuracy
}) => {
  // Define class labels based on dataset
  const getClassLabels = (): string[] => {
    switch(dataset) {
      case 'iris':
        return ['Setosa', 'Versicolor', 'Virginica'];
      case 'digits':
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      case 'wine':
        return ['Class 0', 'Class 1', 'Class 2'];
      case 'breast_cancer':
        return ['Malignant', 'Benign'];
      case 'diabetes':
        return ['Above Threshold', 'Below Threshold']; // Simplified for binary classification
      default:
        return ['Class 1', 'Class 2', 'Class 3'];
    }
  };

  // Count predictions for each class
  const countPredictions = (): number[] => {
    const labels = getClassLabels();
    const counts = new Array(labels.length).fill(0);
    
    predictions.forEach(pred => {
      if (pred < counts.length) {
        counts[pred]++;
      }
    });
    
    return counts;
  };

  // Prepare chart data
  const chartData = {
    labels: getClassLabels(),
    datasets: [
      {
        label: 'Prediction Counts',
        data: countPredictions(),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(199, 199, 199, 0.5)',
          'rgba(83, 102, 255, 0.5)',
          'rgba(255, 83, 102, 0.5)',
          'rgba(102, 255, 83, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 83, 102, 1)',
          'rgba(102, 255, 83, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Prediction Distribution',
      },
    },
  };

  return (
    <div className="model-visualizer">
      <h2>Model Predictions</h2>
      <div className="prediction-info">
        <p><strong>Dataset:</strong> {dataset.charAt(0).toUpperCase() + dataset.slice(1)}</p>
        <p><strong>Model Accuracy:</strong> {(accuracy * 100).toFixed(2)}%</p>
      </div>
      
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ModelVisualizer;