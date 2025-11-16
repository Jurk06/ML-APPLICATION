import React from 'react';

interface ModelEvaluatorProps {
  accuracy: number;
  confusionMatrix: number[][];
}

const ModelEvaluator: React.FC<ModelEvaluatorProps> = ({ 
  accuracy,
  confusionMatrix
}) => {
  // Calculate precision, recall, and f1-score from confusion matrix
  const calculateMetrics = () => {
    const numClasses = confusionMatrix.length;
    const precision: number[] = [];
    const recall: number[] = [];
    const f1: number[] = [];
    
    for (let i = 0; i < numClasses; i++) {
      const truePositives = confusionMatrix[i][i];
      const falsePositives = confusionMatrix.reduce((sum, row) => sum + row[i], 0) - truePositives;
      const falseNegatives = confusionMatrix[i].reduce((sum, val, j) => j !== i ? sum + val : sum, 0);
      
      const prec = truePositives / (truePositives + falsePositives || 1);
      const rec = truePositives / (truePositives + falseNegatives || 1);
      const f = 2 * (prec * rec) / (prec + rec || 1);
      
      precision.push(prec);
      recall.push(rec);
      f1.push(f);
    }
    
    return { precision, recall, f1 };
  };
  
  const { precision, recall, f1 } = calculateMetrics();
  
  return (
    <div className="model-evaluator">
      <h2>Model Evaluation</h2>
      
      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Accuracy</h3>
          <p className="metric-value">{(accuracy * 100).toFixed(2)}%</p>
        </div>
        <div className="metric-card">
          <h3>Precision</h3>
          <p className="metric-value">{(precision.reduce((a, b) => a + b, 0) / precision.length * 100).toFixed(2)}%</p>
        </div>
        <div className="metric-card">
          <h3>Recall</h3>
          <p className="metric-value">{(recall.reduce((a, b) => a + b, 0) / recall.length * 100).toFixed(2)}%</p>
        </div>
        <div className="metric-card">
          <h3>F1-Score</h3>
          <p className="metric-value">{(f1.reduce((a, b) => a + b, 0) / f1.length * 100).toFixed(2)}%</p>
        </div>
      </div>
      
      <div className="confusion-matrix-container">
        <h3>Confusion Matrix</h3>
        <table className="confusion-matrix">
          <thead>
            <tr>
              <th>Predicted</th>
              {confusionMatrix[0].map((_, idx) => (
                <th key={idx}>Class {idx}</th>
              ))}
              <th>Actual</th>
            </tr>
          </thead>
          <tbody>
            {confusionMatrix.map((row, i) => (
              <tr key={i}>
                <td>Class {i}</td>
                {row.map((val, j) => (
                  <td key={`${i}-${j}`} className={i === j ? 'correct' : 'incorrect'}>
                    {val}
                  </td>
                ))}
                <td className="actual-total">
                  {row.reduce((sum, val) => sum + val, 0)}
                </td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              {confusionMatrix[0].map((_, j) => (
                <td key={`total-${j}`} className="predicted-total">
                  {confusionMatrix.reduce((sum, row) => sum + row[j], 0)}
                </td>
              ))}
              <td>{confusionMatrix.reduce((sum, row) => 
                sum + row.reduce((innerSum, val) => innerSum + val, 0), 0
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelEvaluator;