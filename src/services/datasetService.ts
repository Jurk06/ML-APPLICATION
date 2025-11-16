// Mock data service to represent sklearn datasets
// In a real implementation, this would interface with actual sklearn datasets

import { trainTensorFlowModel, generateConfusionMatrix } from './modelService';

export interface DatasetData {
  data: number[][];
  target: number[];
  feature_names: string[];
  target_names: string[];
  description: string;
}

// Mock function to get dataset
export const getDataset = (name: string): DatasetData | null => {
  switch(name) {
    case 'iris':
      // Generate synthetic data based on actual iris dataset statistics
      const irisData = [];
      const irisTargets = [];

      // Setosa (class 0): [4.3-5.8, 2.3-4.4, 1.0-1.9, 0.1-0.6]
      for (let i = 0; i < 50; i++) {
        irisData.push([
          4.3 + Math.random() * 1.5,  // sepal length
          2.3 + Math.random() * 2.1,  // sepal width
          1.0 + Math.random() * 0.9,  // petal length
          0.1 + Math.random() * 0.5   // petal width
        ]);
        irisTargets.push(0);
      }

      // Versicolor (class 1): [4.9-7.0, 2.0-3.4, 3.0-5.1, 1.0-1.8]
      for (let i = 0; i < 50; i++) {
        irisData.push([
          4.9 + Math.random() * 2.1,  // sepal length
          2.0 + Math.random() * 1.4,  // sepal width
          3.0 + Math.random() * 2.1,  // petal length
          1.0 + Math.random() * 0.8   // petal width
        ]);
        irisTargets.push(1);
      }

      // Virginica (class 2): [4.9-7.9, 2.2-3.8, 4.5-6.9, 1.4-2.5]
      for (let i = 0; i < 50; i++) {
        irisData.push([
          4.9 + Math.random() * 3.0,  // sepal length
          2.2 + Math.random() * 1.6,  // sepal width
          4.5 + Math.random() * 2.4,  // petal length
          1.4 + Math.random() * 1.1   // petal width
        ]);
        irisTargets.push(2);
      }

      return {
        data: irisData,
        target: irisTargets,
        feature_names: ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)'],
        target_names: ['setosa', 'versicolor', 'virginica'],
        description: 'The Iris dataset contains 3 classes of flowers with 4 features each'
      };
    case 'wine':
      // Generate synthetic wine dataset with 3 classes and 13 features
      const wineData = [];
      const wineTargets = [];

      // Class 0 (around 59 samples in real dataset)
      for (let i = 0; i < 60; i++) {
        wineData.push([
          13.0 + Math.random() * 1.5,    // alcohol
          1.0 + Math.random() * 1.0,     // malic_acid
          1.5 + Math.random() * 0.5,     // ash
          10.0 + Math.random() * 5.0,    // alcalinity_of_ash
          70.0 + Math.random() * 40.0,   // magnesium
          1.0 + Math.random() * 1.0,     // total_phenols
          1.0 + Math.random() * 1.0,     // flavanoids
          0.2 + Math.random() * 0.2,     // nonflavanoid_phenols
          1.0 + Math.random() * 1.0,     // proanthocyanins
          4.0 + Math.random() * 2.0,     // color_intensity
          0.5 + Math.random() * 0.5,     // hue
          1.0 + Math.random() * 2.0,     // od280/od315_of_diluted_wines
          500.0 + Math.random() * 500.0  // proline
        ]);
        wineTargets.push(0);
      }

      // Class 1 (around 71 samples in real dataset)
      for (let i = 0; i < 70; i++) {
        wineData.push([
          12.0 + Math.random() * 1.5,
          2.0 + Math.random() * 1.0,
          2.0 + Math.random() * 0.5,
          15.0 + Math.random() * 5.0,
          80.0 + Math.random() * 40.0,
          2.0 + Math.random() * 1.0,
          2.0 + Math.random() * 1.0,
          0.4 + Math.random() * 0.2,
          2.0 + Math.random() * 1.0,
          6.0 + Math.random() * 2.0,
          1.0 + Math.random() * 0.5,
          2.0 + Math.random() * 2.0,
          600.0 + Math.random() * 500.0
        ]);
        wineTargets.push(1);
      }

      // Class 2 (around 48 samples in real dataset)
      for (let i = 0; i < 50; i++) {
        wineData.push([
          14.0 + Math.random() * 1.0,
          1.5 + Math.random() * 1.0,
          2.5 + Math.random() * 0.5,
          20.0 + Math.random() * 5.0,
          90.0 + Math.random() * 40.0,
          1.5 + Math.random() * 1.0,
          0.5 + Math.random() * 1.0,
          0.3 + Math.random() * 0.3,
          1.5 + Math.random() * 1.0,
          8.0 + Math.random() * 2.0,
          0.8 + Math.random() * 0.5,
          3.0 + Math.random() * 2.0,
          700.0 + Math.random() * 500.0
        ]);
        wineTargets.push(2);
      }

      return {
        data: wineData,
        target: wineTargets,
        feature_names: [
          'alcohol', 'malic_acid', 'ash', 'alcalinity_of_ash', 'magnesium',
          'total_phenols', 'flavanoids', 'nonflavanoid_phenols', 'proanthocyanins',
          'color_intensity', 'hue', 'od280/od315_of_diluted_wines', 'proline'
        ],
        target_names: ['class_0', 'class_1', 'class_2'],
        description: 'The Wine dataset contains results of a chemical analysis of wines grown in the same region in Italy'
      };
    case 'breast_cancer':
      // Generate synthetic breast cancer dataset with 2 classes and 10 features
      const cancerData = [];
      const cancerTargets = [];

      // Malignant (class 0)
      for (let i = 0; i < 180; i++) {
        cancerData.push([
          15.0 + Math.random() * 10.0,  // mean radius
          15.0 + Math.random() * 10.0,  // mean texture
          100.0 + Math.random() * 100.0, // mean perimeter
          500.0 + Math.random() * 800.0, // mean area
          0.05 + Math.random() * 0.1,    // mean smoothness
          0.1 + Math.random() * 0.2,     // mean compactness
          0.1 + Math.random() * 0.3,     // mean concavity
          0.1 + Math.random() * 0.2,     // mean concave points
          0.1 + Math.random() * 0.1,     // mean symmetry
          0.05 + Math.random() * 0.05    // mean fractal dimension
        ]);
        cancerTargets.push(0); // malignant
      }

      // Benign (class 1)
      for (let i = 0; i < 210; i++) {
        cancerData.push([
          12.0 + Math.random() * 8.0,
          12.0 + Math.random() * 8.0,
          70.0 + Math.random() * 80.0,
          300.0 + Math.random() * 600.0,
          0.03 + Math.random() * 0.07,
          0.05 + Math.random() * 0.1,
          0.05 + Math.random() * 0.1,
          0.05 + Math.random() * 0.1,
          0.1 + Math.random() * 0.08,
          0.04 + Math.random() * 0.04
        ]);
        cancerTargets.push(1); // benign
      }

      return {
        data: cancerData,
        target: cancerTargets,
        feature_names: [
          'mean radius', 'mean texture', 'mean perimeter', 'mean area', 'mean smoothness',
          'mean compactness', 'mean concavity', 'mean concave points', 'mean symmetry', 'mean fractal dimension'
        ],
        target_names: ['malignant', 'benign'],
        description: 'The Breast Cancer Wisconsin dataset for binary classification'
      };
    case 'digits':
      // Generate synthetic digits dataset with 10 classes and 64 features (8x8 pixels)
      const digitsData = [];
      const digitsTargets = [];

      // Create 50 samples for each digit (0-9) = 500 total
      for (let digit = 0; digit < 10; digit++) {
        for (let i = 0; i < 50; i++) {
          // Create a vector of 64 values (8x8 pixels) with values between 0-16
          const digitVector = Array(64).fill(0).map(() => Math.random() * 16);

          // Make each digit more recognizable by adding some pattern
          if (digit === 0) {
            // For digit 0, make center pixels darker
            for (let j = 20; j < 44; j++) {
              if (j % 8 >= 2 && j % 8 <= 5) {
                digitVector[j] = Math.random() * 4; // Darker
              }
            }
          } else if (digit === 1) {
            // For digit 1, make a vertical line
            for (let j = 0; j < 8; j++) {
              digitVector[j * 8 + 3] = 12 + Math.random() * 4; // Darker vertical line
            }
          }
          // Add other digit patterns would go here...

          digitsData.push(digitVector);
          digitsTargets.push(digit);
        }
      }

      return {
        data: digitsData,
        target: digitsTargets,
        feature_names: Array.from({length: 64}, (_, i) => `pixel_${Math.floor(i/8)}_${i%8}`),
        target_names: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        description: 'The Digits dataset contains 8x8 images of handwritten digits'
      };
    case 'diabetes':
      // Generate synthetic diabetes dataset with 2 classes and 10 features
      const diabetesData = [];
      const diabetesTargets = [];

      // Generate 200 samples
      for (let i = 0; i < 200; i++) {
        // Create features based on typical diabetes dataset values
        const sample = [
          -0.1 + Math.random() * 0.2,  // age (normalized)
          -0.1 + Math.random() * 0.2,  // sex (normalized)
          -0.1 + Math.random() * 0.2,  // bmi (normalized)
          -0.1 + Math.random() * 0.2,  // bp (normalized)
          -0.1 + Math.random() * 0.2,  // s1 (normalized)
          -0.1 + Math.random() * 0.2,  // s2 (normalized)
          -0.1 + Math.random() * 0.2,  // s3 (normalized)
          -0.1 + Math.random() * 0.2,  // s4 (normalized)
          -0.1 + Math.random() * 0.2,  // s5 (normalized)
          -0.1 + Math.random() * 0.2   // s6 (normalized)
        ];

        // Determine target based on some combination of features
        // This creates a binary classification problem from the regression dataset
        const targetValue = sample.reduce((sum, val) => sum + val, 0) * 2;
        const target = targetValue > 0 ? 1 : 0; // 1 for above threshold, 0 for below

        diabetesData.push(sample);
        diabetesTargets.push(target);
      }

      return {
        data: diabetesData,
        target: diabetesTargets,
        feature_names: ['age', 'sex', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6'],
        target_names: ['above_threshold', 'below_threshold'],
        description: 'The Diabetes dataset for regression converted to binary classification'
      };
    default:
      return null;
  }
};

// Function to train a model using TensorFlow.js
export const trainModel = async (dataset: DatasetData, trainPercentage: number) => {
  try {
    const numClasses = new Set(dataset.target).size;
    const numSamples = dataset.data.length;
    const numTrain = Math.floor(numSamples * (trainPercentage / 100));

    // Validate dataset
    if (numSamples === 0 || numClasses < 2) {
      throw new Error('Dataset is invalid or has insufficient classes');
    }

    // Ensure we have enough samples for both training and testing
    if (numTrain <= 0 || (numSamples - numTrain) <= 0) {
      throw new Error('Not enough data for the selected train percentage');
    }

    // Split the data into training and testing sets
    const trainData = dataset.data.slice(0, numTrain);
    const trainLabels = dataset.target.slice(0, numTrain);
    const testData = dataset.data.slice(numTrain);
    const testLabels = dataset.target.slice(numTrain);

    // Train the model using TensorFlow.js
    const { model, accuracy, predictions } = await trainTensorFlowModel(
      trainData,
      trainLabels,
      testData,
      testLabels,
      numClasses
    );

    // Generate confusion matrix
    const confusionMatrix = generateConfusionMatrix(predictions, testLabels, numClasses);

    // Dispose the model to free up memory
    model.dispose();

    return {
      predictions,
      accuracy,
      confusionMatrix
    };
  } catch (error) {
    console.error('Error during model training:', error);
    throw error; // Re-throw to be handled by caller
  }
};