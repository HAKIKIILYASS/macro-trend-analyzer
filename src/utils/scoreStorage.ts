
interface SavedScore {
  id: string;
  name: string;
  timestamp: Date;
  totalScore: number;
  bias: string;
  biasColor: string;
  data: any;
}

export const saveScore = (results: any, data: any, name: string, customDate?: Date): void => {
  const savedScore: SavedScore = {
    id: Date.now().toString(),
    name: name,
    timestamp: customDate || new Date(),
    totalScore: results.total_score,
    bias: results.bias,
    biasColor: results.biasColor,
    data: data
  };

  try {
    const existingScores = localStorage.getItem('macroScores');
    const scores = existingScores ? JSON.parse(existingScores) : [];
    scores.unshift(savedScore); // Add to beginning of array
    
    // Keep only the last 20 scores to prevent localStorage from getting too large
    const limitedScores = scores.slice(0, 20);
    
    localStorage.setItem('macroScores', JSON.stringify(limitedScores));
  } catch (error) {
    console.error('Error saving score:', error);
    throw new Error('Failed to save score');
  }
};

export const getSavedScores = (): SavedScore[] => {
  try {
    const saved = localStorage.getItem('macroScores');
    if (saved) {
      return JSON.parse(saved).map((score: any) => ({
        ...score,
        timestamp: new Date(score.timestamp)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading saved scores:', error);
    return [];
  }
};
