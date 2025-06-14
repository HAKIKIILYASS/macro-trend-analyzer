
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MacroResultsProps {
  results: {
    scores: {
      cb_score: number;
      inflation_score: number;
      labor_score: number;
      risk_score: number;
      pmi_score: number;
      ca_score: number;
      geo_score: number;
    };
    total_score: number;
    bias: string;
    biasColor: string;
  };
}

const MacroResults: React.FC<MacroResultsProps> = ({ results }) => {
  const { scores, total_score, bias, biasColor } = results;

  const scoreItems = [
    { name: 'Central Bank Policy', score: scores.cb_score, weight: 24, color: 'bg-green-500' },
    { name: 'Inflation Trend', score: scores.inflation_score, weight: 19, color: 'bg-orange-500' },
    { name: 'Labor Market', score: scores.labor_score, weight: 17, color: 'bg-blue-500' },
    { name: 'Risk Sentiment', score: scores.risk_score, weight: 14, color: 'bg-purple-500' },
    { name: 'PMI Composite', score: scores.pmi_score, weight: 11, color: 'bg-indigo-500' },
    { name: 'Current Account', score: scores.ca_score, weight: 9, color: 'bg-teal-500' },
    { name: 'Geopolitical Risk', score: scores.geo_score, weight: 6, color: 'bg-red-500' },
  ];

  const getScoreColor = (score: number) => {
    if (score > 1) return 'text-green-600';
    if (score > 0.3) return 'text-green-500';
    if (score > -0.3) return 'text-gray-600';
    if (score > -1) return 'text-orange-500';
    return 'text-red-600';
  };

  const normalizeScore = (score: number) => {
    // Normalize score to 0-100 range for progress bar (centered at 50)
    return Math.max(0, Math.min(100, (score + 2) * 25));
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <CardTitle className="text-2xl">Macro Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold mb-2" style={{ color: biasColor }}>
              {total_score.toFixed(2)}
            </div>
            <div className="text-xl text-gray-600">Total Macro Score</div>
          </div>
          <Badge 
            className="text-lg px-4 py-2" 
            style={{ backgroundColor: biasColor, color: 'white' }}
          >
            {bias}
          </Badge>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Individual Indicator Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{item.weight}%</span>
                    <span className={`font-bold ${getScoreColor(item.score)}`}>
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={normalizeScore(item.score)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>-2.0</span>
                  <span>0</span>
                  <span>+2.0</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trading Bias Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <Badge className="bg-green-600 text-white justify-center py-1">
              Strong Bullish (≥1.0)
            </Badge>
            <Badge className="bg-green-400 text-white justify-center py-1">
              Mild Bullish (0.3-1.0)
            </Badge>
            <Badge className="bg-gray-500 text-white justify-center py-1">
              Neutral (-0.3 to 0.3)
            </Badge>
            <Badge className="bg-orange-500 text-white justify-center py-1">
              Mild Bearish (-1.0 to -0.3)
            </Badge>
            <Badge className="bg-red-600 text-white justify-center py-1">
              Strong Bearish (&lt;-1.0)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
