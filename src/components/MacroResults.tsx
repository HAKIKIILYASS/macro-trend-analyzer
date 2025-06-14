
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
    { name: 'Central Bank Policy', score: scores.cb_score, weight: 24, color: 'bg-gradient-to-r from-emerald-500 to-green-500', icon: '🏦' },
    { name: 'Inflation Trend', score: scores.inflation_score, weight: 19, color: 'bg-gradient-to-r from-orange-500 to-red-500', icon: '📈' },
    { name: 'Labor Market', score: scores.labor_score, weight: 17, color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: '👥' },
    { name: 'Risk Sentiment', score: scores.risk_score, weight: 14, color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: '⚠️' },
    { name: 'PMI Composite', score: scores.pmi_score, weight: 11, color: 'bg-gradient-to-r from-indigo-500 to-purple-500', icon: '🏭' },
    { name: 'Current Account', score: scores.ca_score, weight: 9, color: 'bg-gradient-to-r from-teal-500 to-cyan-500', icon: '💰' },
    { name: 'Geopolitical Risk', score: scores.geo_score, weight: 6, color: 'bg-gradient-to-r from-red-500 to-orange-500', icon: '🌍' },
  ];

  const getScoreColor = (score: number) => {
    if (score > 1) return 'text-green-600 font-bold';
    if (score > 0.3) return 'text-green-500 font-semibold';
    if (score > -0.3) return 'text-gray-600 font-medium';
    if (score > -1) return 'text-orange-500 font-semibold';
    return 'text-red-600 font-bold';
  };

  const normalizeScore = (score: number) => {
    return Math.max(0, Math.min(100, (score + 2) * 25));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Score */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardTitle className="text-3xl font-bold relative z-10 animate-pulse">
            🎯 Macro Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <div className="text-8xl font-black mb-4 animate-bounce" style={{ color: biasColor }}>
              {total_score.toFixed(2)}
            </div>
            <div className="text-2xl text-gray-700 font-semibold">Total Macro Score</div>
          </div>
          <Badge 
            className="text-2xl px-8 py-4 animate-pulse shadow-lg hover:shadow-xl transition-shadow duration-300" 
            style={{ backgroundColor: biasColor, color: 'white' }}
          >
            {bias}
          </Badge>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            📊 Individual Indicator Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreItems.map((item, index) => (
              <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-pulse">{item.icon}</span>
                    <span className="font-bold text-lg text-gray-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm font-bold px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100">
                      {item.weight}%
                    </Badge>
                    <span className={`text-xl ${getScoreColor(item.score)}`}>
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={normalizeScore(item.score)} 
                  className="h-3 rounded-full bg-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>-2.0</span>
                  <span className="font-bold">0</span>
                  <span>+2.0</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            🎨 Trading Bias Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white justify-center py-3 text-center font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              Strong Bullish (≥1.0)
            </Badge>
            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white justify-center py-3 text-center font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              Mild Bullish (0.3-1.0)
            </Badge>
            <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white justify-center py-3 text-center font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              Neutral (-0.3 to 0.3)
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white justify-center py-3 text-center font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              Mild Bearish (-1.0 to -0.3)
            </Badge>
            <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white justify-center py-3 text-center font-bold shadow-lg hover:shadow-xl transition-shadow duration-300">
              Strong Bearish (&lt;-1.0)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
