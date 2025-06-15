
interface SavedScore {
  id: string;
  name: string;
  timestamp: Date;
  totalScore: number;
  bias: string;
  biasColor: string;
  data: any;
}

const LOCAL_SERVER_URL = 'http://localhost:3001/api'; // You can change this port as needed

export const saveScore = async (results: any, data: any, name: string, customDate?: Date): Promise<void> => {
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
    const response = await fetch(`${LOCAL_SERVER_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedScore),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving score to local server:', error);
    // Fallback to localStorage if server is not available
    const existingScores = localStorage.getItem('macroScores');
    const scores = existingScores ? JSON.parse(existingScores) : [];
    scores.unshift(savedScore);
    const limitedScores = scores.slice(0, 20);
    localStorage.setItem('macroScores', JSON.stringify(limitedScores));
    throw new Error('Failed to save to server, saved locally instead');
  }
};

export const getSavedScores = async (): Promise<SavedScore[]> => {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/scores`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const scores = await response.json();
    return scores.map((score: any) => ({
      ...score,
      timestamp: new Date(score.timestamp)
    }));
  } catch (error) {
    console.error('Error loading scores from local server:', error);
    // Fallback to localStorage if server is not available
    try {
      const saved = localStorage.getItem('macroScores');
      if (saved) {
        return JSON.parse(saved).map((score: any) => ({
          ...score,
          timestamp: new Date(score.timestamp)
        }));
      }
      return [];
    } catch (localError) {
      console.error('Error loading from localStorage:', localError);
      return [];
    }
  }
};

export const deleteScore = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${LOCAL_SERVER_URL}/scores/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting score from local server:', error);
    throw new Error('Failed to delete score from server');
  }
};
