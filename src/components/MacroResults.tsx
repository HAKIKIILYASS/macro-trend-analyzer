
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
    { name: 'Central Bank Policy', score: scores.cb_score, weight: 24, icon: '🏦' },
    { name: 'Inflation Trend', score: scores.inflation_score, weight: 19, icon: '📈' },
    { name: 'Labor Market', score: scores.labor_score, weight: 17, icon: '👥' },
    { name: 'Risk Sentiment', score: scores.risk_score, weight: 14, icon: '⚠️' },
    { name: 'PMI Composite', score: scores.pmi_score, weight: 11, icon: '🏭' },
    { name: 'Current Account', score: scores.ca_score, weight: 9, icon: '💰' },
    { name: 'Geopolitical Risk', score: scores.geo_score, weight: 6, icon: '🌍' },
  ];

  const getScoreColor = (score: number) => {
    if (score > 1) return 'text-green-600 font-bold';
    if (score > 0.3) return 'text-green-500 font-semibold';
    if (score > -0.3) return 'text-slate-600 font-medium';
    if (score > -1) return 'text-orange-500 font-semibold';
    return 'text-red-600 font-bold';
  };

  const normalizeScore = (score: number) => {
    return Math.max(0, Math.min(100, (score + 2) * 25));
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-700 text-white text-center">
          <CardTitle className="text-2xl font-bold">
            Macro Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold mb-4" style={{ color: biasColor }}>
              {total_score.toFixed(2)}
            </div>
            <div className="text-xl text-slate-700 font-semibold">Total Macro Score</div>
          </div>
          <Badge 
            className="text-lg px-6 py-3" 
            style={{ backgroundColor: biasColor, color: 'white' }}
          >
            {bias}
          </Badge>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <Card className="border border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-700 text-white">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            📊 Individual Indicator Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreItems.map((item, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-slate-100">
                      {item.weight}%
                    </Badge>
                    <span className={`text-base ${getScoreColor(item.score)}`}>
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={normalizeScore(item.score)} 
                  className="h-2 rounded-full bg-slate-200"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>-2.0</span>
                  <span className="font-medium">0</span>
                  <span>+2.0</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-700 text-white">
          <CardTitle className="text-lg font-semibold">
            Trading Bias Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
            <Badge className="bg-green-600 text-white justify-center py-2 text-center font-medium">
              Strong Bullish (≥1.0)
            </Badge>
            <Badge className="bg-green-500 text-white justify-center py-2 text-center font-medium">
              Mild Bullish (0.3-1.0)
            </Badge>
            <Badge className="bg-slate-500 text-white justify-center py-2 text-center font-medium">
              Neutral (-0.3 to 0.3)
            </Badge>
            <Badge className="bg-orange-500 text-white justify-center py-2 text-center font-medium">
              Mild Bearish (-1.0 to -0.3)
            </Badge>
            <Badge className="bg-red-600 text-white justify-center py-2 text-center font-medium">
              Strong Bearish (&lt;-1.0)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
