import * as tf from '@tensorflow/tfjs';

// Function to normalize data
export const normalizeData = (data: number[][]): number[][] => {
  // Find min and max for each feature
  const numFeatures = data[0].length;
  const mins: number[] = new Array(numFeatures).fill(Infinity);
  const maxs: number[] = new Array(numFeatures).fill(-Infinity);

  // Calculate min and max values
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < numFeatures; j++) {
      if (data[i][j] < mins[j]) mins[j] = data[i][j];
      if (data[i][j] > maxs[j]) maxs[j] = data[i][j];
    }
  }

  // Normalize data to [0, 1] range
  const normalized = data.map(row =>
    row.map((val, j) => (val - mins[j]) / (maxs[j] - mins[j] || 1))
  );

  return normalized;
};

// Function to train a TensorFlow.js model
export const trainTensorFlowModel = async (
  trainData: number[][],
  trainLabels: number[],
  testData: number[][],
  testLabels: number[],
  numClasses: number
): Promise<{model: tf.LayersModel, accuracy: number, predictions: number[]}> => {
  try {
    // Ensure TensorFlow.js is ready
    await tf.ready();

    // Normalize the data
    const normalizedTrainData = normalizeData(trainData);
    const normalizedTestData = normalizeData(testData);

    // Validate the data
    if (normalizedTrainData.length === 0 || normalizedTestData.length === 0) {
      throw new Error('Training or test data is empty');
    }

    // Convert data to TensorFlow tensors
    const trainTensor = tf.tensor2d(normalizedTrainData);
    const trainLabelsTensor = tf.tensor1d(trainLabels, 'int32');
    const testTensor = tf.tensor2d(normalizedTestData);
    const testLabelsTensor = tf.tensor1d(testLabels, 'int32');

    // Convert labels to one-hot encoding
    const trainLabelsOneHot = tf.oneHot(trainLabelsTensor, numClasses);
    const testLabelsOneHot = tf.oneHot(testLabelsTensor, numClasses);

    // Create a simple neural network model
    const model = tf.sequential();

    // Add layers based on the complexity of the dataset
    if (trainData[0].length > 20) {
      // For high-dimensional data (like digits)
      model.add(tf.layers.dense({
        units: Math.min(64, Math.floor(trainData[0].length / 2) + 1), // Adjusted to prevent overfitting
        activation: 'relu',
        inputShape: [trainData[0].length]
      }));
      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(tf.layers.dense({
        units: Math.min(32, Math.floor(trainData[0].length / 3) + 1),
        activation: 'relu'
      }));
      model.add(tf.layers.dropout({ rate: 0.2 }));
    } else {
      // For lower-dimensional data (like iris, wine)
      model.add(tf.layers.dense({
        units: Math.min(16, Math.floor(trainData[0].length) + 2),
        activation: 'relu',
        inputShape: [trainData[0].length]
      }));
      model.add(tf.layers.dense({
        units: Math.min(8, Math.floor(trainData[0].length / 2) + 1),
        activation: 'relu'
      }));
    }

    // Output layer with units equal to number of classes
    model.add(tf.layers.dense({
      units: numClasses,
      activation: 'softmax'
    }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.01), // Using a more stable optimizer
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    // Train the model with error handling
    await model.fit(trainTensor, trainLabelsOneHot, {
      epochs: Math.min(50, Math.max(10, 100 - normalizedTrainData.length / 10)), // Adaptive epochs
      batchSize: Math.min(32, Math.floor(normalizedTrainData.length / 10) || 1),
      validationSplit: 0.2,
      verbose: 0 // Set to 1 to see training progress
    });

    // Evaluate the model
    const evalResult = model.evaluate(testTensor, testLabelsOneHot);
    let accuracy: number;

    if (Array.isArray(evalResult)) {
      // If evalResult is an array of tensors, get the first one (accuracy)
      const accuracyTensor = evalResult[0] as tf.Tensor;
      const accuracyArray = await accuracyTensor.data();
      accuracy = accuracyArray[0] as number;
    } else {
      // If evalResult is a single tensor, use it directly
      const accuracyResult = await (evalResult as tf.Tensor).data();
      accuracy = accuracyResult[0] as number;
    }

    // Make predictions
    const predictionsTensor = model.predict(testTensor) as tf.Tensor;
    const predictionsArray = await predictionsTensor.argMax(-1).data();
    const predictions = Array.from(predictionsArray);

    // Clean up tensors
    trainTensor.dispose();
    trainLabelsTensor.dispose();
    testTensor.dispose();
    testLabelsTensor.dispose();
    trainLabelsOneHot.dispose();
    testLabelsOneHot.dispose();

    // Properly dispose of evalResult which might be an array
    if (Array.isArray(evalResult)) {
      evalResult.forEach(tensor => tensor.dispose());
    } else {
      (evalResult as tf.Tensor).dispose();
    }

    predictionsTensor.dispose();

    return { model, accuracy, predictions };
  } catch (error) {
    console.error('Error in trainTensorFlowModel:', error);
    throw error;
  }
};

// Function to generate confusion matrix
export const generateConfusionMatrix = (
  predictions: number[], 
  actual: number[], 
  numClasses: number
): number[][] => {
  const matrix: number[][] = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
  
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] < numClasses && actual[i] < numClasses) {
      matrix[actual[i]][predictions[i]]++;
    }
  }
  
  return matrix;
};