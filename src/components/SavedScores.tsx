
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar } from 'lucide-react';

interface SavedScore {
  id: string;
  timestamp: Date;
  totalScore: number;
  bias: string;
  biasColor: string;
  data: any;
}

interface SavedScoresProps {
  onLoadScore: (data: any) => void;
}

const SavedScores: React.FC<SavedScoresProps> = ({ onLoadScore }) => {
  const [savedScores, setSavedScores] = useState<SavedScore[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('macroScores');
    if (saved) {
      try {
        const parsedScores = JSON.parse(saved).map((score: any) => ({
          ...score,
          timestamp: new Date(score.timestamp)
        }));
        setSavedScores(parsedScores);
      } catch (error) {
        console.error('Error loading saved scores:', error);
      }
    }
  }, []);

  const deleteScore = (id: string) => {
    const updatedScores = savedScores.filter(score => score.id !== id);
    setSavedScores(updatedScores);
    localStorage.setItem('macroScores', JSON.stringify(updatedScores));
  };

  const loadScore = (score: SavedScore) => {
    onLoadScore(score.data);
  };

  if (savedScores.length === 0) {
    return (
      <Card className="shadow-lg border-2 border-gray-100">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <CardTitle className="flex items-center gap-3">
            <span className="text-xl">💾</span>
            Saved Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No saved scores yet. Calculate and save your first macro score!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 border-gray-100">
      <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
        <CardTitle className="flex items-center gap-3">
          <span className="text-xl">💾</span>
          Saved Scores ({savedScores.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {savedScores.map((score) => (
            <div 
              key={score.id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: score.biasColor }}
                  >
                    {score.totalScore.toFixed(2)}
                  </span>
                  <Badge 
                    className="font-medium"
                    style={{ backgroundColor: score.biasColor, color: 'white' }}
                  >
                    {score.bias}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  {score.timestamp.toLocaleDateString()} at {score.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadScore(score)}
                  className="hover:bg-blue-50"
                >
                  Load
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteScore(score.id)}
                  className="hover:bg-red-50 text-red-600 border-red-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedScores;
