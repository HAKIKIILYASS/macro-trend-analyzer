
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
    { name: 'Central Bank Policy', score: scores.cb_score, weight: 24, icon: '🏦', color: 'from-blue-500 to-blue-600' },
    { name: 'Inflation Trend', score: scores.inflation_score, weight: 19, icon: '📈', color: 'from-emerald-500 to-green-600' },
    { name: 'Labor Market', score: scores.labor_score, weight: 17, icon: '👥', color: 'from-purple-500 to-indigo-600' },
    { name: 'Risk Sentiment', score: scores.risk_score, weight: 14, icon: '⚠️', color: 'from-orange-500 to-red-600' },
    { name: 'PMI Composite', score: scores.pmi_score, weight: 11, icon: '🏭', color: 'from-teal-500 to-cyan-600' },
    { name: 'Current Account', score: scores.ca_score, weight: 9, icon: '💰', color: 'from-cyan-500 to-blue-600' },
    { name: 'Geopolitical Risk', score: scores.geo_score, weight: 6, icon: '🌍', color: 'from-rose-500 to-pink-600' },
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
    <div className="space-y-6 animate-fade-in">
      {/* Overall Score */}
      <Card className="border border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50 transform hover:scale-105 transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center rounded-t-lg">
          <CardTitle className="text-2xl font-bold animate-pulse">
            Macro Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold mb-4 animate-bounce" style={{ color: biasColor }}>
              {total_score.toFixed(2)}
            </div>
            <div className="text-xl text-gray-700 font-semibold">Total Macro Score</div>
          </div>
          <Badge 
            className="text-lg px-6 py-3 font-semibold transform hover:scale-110 transition-transform duration-300" 
            style={{ backgroundColor: biasColor, color: 'white' }}
          >
            {bias}
          </Badge>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <Card className="border border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50 animate-slide-in-right">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            📊 Individual Indicator Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreItems.map((item, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg animate-pulse">{item.icon}</span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-xs font-medium px-2 py-1 bg-gradient-to-r ${item.color} text-white transform hover:scale-110 transition-transform duration-300`}>
                      {item.weight}%
                    </Badge>
                    <span className={`text-base ${getScoreColor(item.score)} transition-colors duration-300`}>
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={normalizeScore(item.score)} 
                  className="h-3 rounded-full bg-gray-200 transition-all duration-500 hover:h-4"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
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
      <Card className="border border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50 animate-slide-in-right delay-500">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">
            Trading Bias Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
            {[
              { text: 'Strong Bullish (≥1.0)', gradient: 'from-green-600 to-green-700' },
              { text: 'Mild Bullish (0.3-1.0)', gradient: 'from-green-500 to-green-600' },
              { text: 'Neutral (-0.3 to 0.3)', gradient: 'from-gray-500 to-gray-600' },
              { text: 'Mild Bearish (-1.0 to -0.3)', gradient: 'from-orange-500 to-orange-600' },
              { text: 'Strong Bearish (<-1.0)', gradient: 'from-red-600 to-red-700' }
            ].map((badge, index) => (
              <Badge 
                key={index}
                className={`bg-gradient-to-r ${badge.gradient} text-white justify-center py-2 text-center font-medium shadow-lg transform hover:scale-110 transition-all duration-300 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {badge.text}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
