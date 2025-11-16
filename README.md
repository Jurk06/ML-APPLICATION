# Machine Learning Classification Explorer

This React application provides an interactive interface for exploring machine learning classification on popular datasets from scikit-learn. The application allows users to select different datasets, train a neural network model, and visualize the results.

## Features

- Interactive dataset selection (Iris, Wine, Breast Cancer, Digits, Diabetes)
- Adjustable training data percentage
- Neural network model training using TensorFlow.js
- Performance metrics visualization (accuracy, precision, recall, F1-score)
- Confusion matrix display
- Prediction distribution charts

## Datasets

- **Iris Dataset**: Classic dataset with 3 flower classes and 4 features each
- **Wine Dataset**: Chemical analysis of wines with 3 classes
- **Breast Cancer Dataset**: Binary classification for cancer diagnosis
- **Digits Dataset**: Handwritten digit images (0-9)
- **Diabetes Dataset**: Regression converted to binary classification

## Technologies Used

- React with TypeScript
- TensorFlow.js for in-browser machine learning
- Chart.js for data visualization
- Create React App for project scaffolding

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd OCR/lab-03`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Usage

1. Select a dataset from the options
2. Adjust the training data percentage using the slider
3. Click "Train Model" to start the training process
4. View the results including accuracy metrics and visualizations

## Model Training

The application uses a neural network with the following architecture:
- Input layer: Matches the number of features in the dataset
- Hidden layers: Adapted based on dataset complexity
- Output layer: Matches the number of classes for classification

The model uses ReLU activation functions and dropout for regularization.

## Performance Metrics

After training, the application evaluates the model using:
- Accuracy: Overall correctness of predictions
- Precision: Proportion of positive identifications that were actually correct
- Recall: Proportion of actual positives that were identified correctly
- F1-Score: Harmonic mean of precision and recall