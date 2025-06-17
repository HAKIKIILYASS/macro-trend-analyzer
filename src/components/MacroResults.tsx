
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MacroResultsProps {
  results: {
    regime: string;
    scores: {
      rate_expectations: number;
      real_rate_edge: number;
      economic_momentum: number;
      risk_sentiment: number;
      flow_dynamics: number;
    };
    weights: {
      rate: number;
      realRate: number;
      momentum: number;
      risk: number;
      flow: number;
    };
    total_score: number;
    bias: string;
    biasColor: string;
    positionSize: string;
    riskPerTrade: string;
    tradingRecommendation: string;
  };
}

const MacroResults: React.FC<MacroResultsProps> = ({ results }) => {
  const { regime, scores, weights, total_score, bias, biasColor, positionSize, riskPerTrade, tradingRecommendation } = results;

  const scoreItems = [
    { 
      name: 'Rate Expectations', 
      score: scores.rate_expectations, 
      weight: Math.round(weights.rate * 100), 
      icon: '💰', 
      color: 'from-green-500 to-emerald-600',
      description: 'Central bank policy outlook and rate probability'
    },
    { 
      name: 'Real Rate Edge', 
      score: scores.real_rate_edge, 
      weight: Math.round(weights.realRate * 100), 
      icon: '🏛️', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Yield differential adjusted for inflation'
    },
    { 
      name: 'Economic Momentum', 
      score: scores.economic_momentum, 
      weight: Math.round(weights.momentum * 100), 
      icon: '📈', 
      color: 'from-orange-500 to-amber-600',
      description: 'Employment, PMI, and consumer strength'
    },
    { 
      name: 'Risk Sentiment', 
      score: scores.risk_sentiment, 
      weight: Math.round(weights.risk * 100), 
      icon: '⚠️', 
      color: 'from-red-500 to-orange-600',
      description: 'VIX fear gauge and safe haven flows'
    },
    { 
      name: 'Flow Dynamics', 
      score: scores.flow_dynamics, 
      weight: Math.round(weights.flow * 100), 
      icon: '💸', 
      color: 'from-teal-500 to-cyan-600',
      description: 'Currency ETF institutional flows'
    },
  ];

  const getScoreColor = (score: number) => {
    if (score > 1) return 'text-green-600 font-bold';
    if (score > 0.3) return 'text-green-500 font-semibold';
    if (score > -0.3) return 'text-gray-600 font-medium';
    if (score > -1) return 'text-orange-500 font-semibold';
    return 'text-red-600 font-bold';
  };

  const normalizeScore = (score: number) => {
    return Math.max(0, Math.min(100, (score + 3) * (100/6)));
  };

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'Risk-Off': return 'bg-red-500';
      case 'Risk-On': return 'bg-green-500';
      case 'CB Week': return 'bg-purple-500';
      default: return 'bg-yellow-500';
    }
  };

  const getRegimeIcon = (regime: string) => {
    switch (regime) {
      case 'Risk-Off': return '📉';
      case 'Risk-On': return '📈';
      case 'CB Week': return '🏦';
      default: return '⚖️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Regime Detection */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            🎯 Market Regime Detection
            <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getRegimeColor(regime)} flex items-center gap-1`}>
              <span>{getRegimeIcon(regime)}</span>
              {regime}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-sm text-gray-600 mb-4">{tradingRecommendation}</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {scoreItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-lg font-bold text-blue-600">{item.weight}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Currency Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: biasColor }}>
                {total_score.toFixed(2)}
              </div>
              <div className="text-lg text-gray-700 font-semibold">Total Score</div>
            </div>
            <div className="text-center">
              <Badge 
                className="text-lg px-4 py-2 font-semibold mb-2" 
                style={{ backgroundColor: biasColor, color: 'white' }}
              >
                {bias}
              </Badge>
              <div className="text-sm text-gray-600">{positionSize}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-1">Risk Management</div>
              <div className="text-sm text-gray-600">{riskPerTrade}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Scores */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            📊 Factor Analysis Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {scoreItems.map((item, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`text-xs font-medium px-2 py-1 bg-gradient-to-r ${item.color} text-white`}>
                      {item.weight}%
                    </Badge>
                    <span className={`text-lg ${getScoreColor(item.score)}`}>
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={normalizeScore(item.score)} 
                  className="h-3 rounded-full bg-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-3.0</span>
                  <span className="font-medium">0</span>
                  <span>+3.0</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Bias Matrix */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">
            📈 Trading Bias Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
            {[
              { text: 'Strong Bullish (>+1.5)', gradient: 'from-green-600 to-green-700', detail: 'Full long position' },
              { text: 'Mild Bullish (+0.5 to +1.5)', gradient: 'from-green-500 to-green-600', detail: '70% long bias' },
              { text: 'Neutral (-0.5 to +0.5)', gradient: 'from-gray-500 to-gray-600', detail: 'Technical only' },
              { text: 'Mild Bearish (-1.5 to -0.5)', gradient: 'from-orange-500 to-orange-600', detail: '70% short bias' },
              { text: 'Strong Bearish (<-1.5)', gradient: 'from-red-600 to-red-700', detail: 'Full short position' }
            ].map((badge, index) => (
              <div key={index} className="text-center">
                <Badge 
                  className={`bg-gradient-to-r ${badge.gradient} text-white justify-center py-2 text-center font-medium shadow-md w-full mb-1`}
                >
                  {badge.text}
                </Badge>
                <div className="text-xs text-gray-600">{badge.detail}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
