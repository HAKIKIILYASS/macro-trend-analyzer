
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
      name: 'Rate Policy', 
      score: scores.rate_expectations, 
      weight: Math.round(weights.rate * 100), 
      icon: '🏦', 
      color: 'from-green-500 to-emerald-600',
      description: 'Central bank rate hike/cut probabilities + guidance shifts',
      guide: 'Check CME FedWatch, ECB Watch, BoE rate odds weekly'
    },
    { 
      name: 'Real Rate Edge', 
      score: scores.real_rate_edge, 
      weight: Math.round(weights.realRate * 100), 
      icon: '💰', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Bond yield minus inflation rate differential',
      guide: 'Yahoo Finance 2Y yields - latest CPI readings'
    },
    { 
      name: 'Economic Momentum', 
      score: scores.economic_momentum, 
      weight: Math.round(weights.momentum * 100), 
      icon: '📈', 
      color: 'from-orange-500 to-amber-600',
      description: 'Employment health (50%) + Manufacturing PMI (50%)',
      guide: 'Monthly jobs reports + PMI releases (>53 = strong)'
    },
    { 
      name: 'Risk Sentiment', 
      score: scores.risk_sentiment, 
      weight: Math.round(weights.risk * 100), 
      icon: '🌊', 
      color: 'from-red-500 to-orange-600',
      description: 'VIX fear gauge (70%) + Gold vs S&P500 trend (30%)',
      guide: 'VIX <15 = greedy, >30 = scared. Gold winning = risk-off'
    },
    { 
      name: 'Money Flow', 
      score: scores.flow_dynamics, 
      weight: Math.round(weights.flow * 100), 
      icon: '💸', 
      color: 'from-teal-500 to-cyan-600',
      description: 'Currency ETF institutional flows (monthly check)',
      guide: 'ETF.com: UUP, FXE, FXB flows >$500M = significant'
    },
  ];

  const getScoreColor = (score: number) => {
    if (score > 1.5) return 'text-green-700 font-bold';
    if (score > 0.5) return 'text-green-600 font-semibold';
    if (score > -0.5) return 'text-gray-600 font-medium';
    if (score > -1.5) return 'text-orange-600 font-semibold';
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
      case 'Risk-Off': return '😨';
      case 'Risk-On': return '😄';
      case 'CB Week': return '🏦';
      default: return '😐';
    }
  };

  const getRegimeExplanation = (regime: string) => {
    switch (regime) {
      case 'Risk-Off': return 'VIX >25 OR Gold beating stocks. Safe havens (USD, JPY, CHF) win.';
      case 'Risk-On': return 'VIX <18 AND stocks at highs. Risk currencies (AUD, EUR, GBP) win.';
      case 'CB Week': return 'Central bank meeting week. Rate policy dominates (50% weight).';
      default: return 'Normal market conditions. All factors weighted equally.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Regime Detection */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            🎯 Market Regime: Your Weekly Trading GPS
            <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getRegimeColor(regime)} flex items-center gap-1`}>
              <span>{getRegimeIcon(regime)}</span>
              {regime}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="text-sm font-medium text-gray-800 mb-2">What This Means:</div>
            <div className="text-sm text-gray-700">{getRegimeExplanation(regime)}</div>
          </div>
          <div className="text-sm text-gray-600 mb-4">{tradingRecommendation}</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {scoreItems.map((item, index) => (
              <div key={index} className="text-center bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-xl font-bold text-blue-600">{item.weight}%</div>
                <div className="text-xs text-gray-500 mt-1">Weight</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Your Currency Trading Signal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: biasColor }}>
                {total_score > 0 ? '+' : ''}{total_score.toFixed(2)}
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
              <div className="text-sm text-gray-700 font-medium">{positionSize}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 mb-1">Risk Management</div>
              <div className="text-sm text-gray-700 font-medium">{riskPerTrade}</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
            <div className="text-sm font-medium text-gray-800 mb-2">📖 How to Read Your Score:</div>
            <div className="text-xs text-gray-700 space-y-1">
              <div>• <strong>{'>'}+1.8:</strong> Very strong signal - Trade immediately on any pullback</div>
              <div>• <strong>+1.0 to +1.8:</strong> Strong signal - Wait for retest of support</div>
              <div>• <strong>+0.5 to +1.0:</strong> Moderate signal - Wait for breakout confirmation</div>
              <div>• <strong>-0.5 to +0.5:</strong> Weak signal - Technical trades only</div>
              <div>• <strong>{'<'}-1.8:</strong> Very strong bearish - Enter on any bounce</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Scores with Educational Guide */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            📊 The 5 Pillars of Currency Strength
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {scoreItems.map((item, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-3">
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
                  className="h-3 rounded-full bg-gray-200 mb-2"
                />
                <div className="flex justify-between items-center">
                  <div className="flex justify-between text-xs text-gray-500 w-full">
                    <span>-3.0</span>
                    <span className="font-medium">0</span>
                    <span>+3.0</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <strong>📱 Quick Check:</strong> {item.guide}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Bias Matrix - Enhanced */}
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">
            📈 Your 25-Minute Weekly Trading System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm mb-4">
            {[
              { text: 'Very Strong (>+1.8)', gradient: 'from-green-600 to-green-700', detail: '2.5% risk - Trade now' },
              { text: 'Strong (+1.0 to +1.8)', gradient: 'from-green-500 to-green-600', detail: '2.0% risk - Wait for pullback' },
              { text: 'Moderate (+0.5 to +1.0)', gradient: 'from-yellow-500 to-yellow-600', detail: '1.5% risk - Wait for breakout' },
              { text: 'Neutral (-0.5 to +0.5)', gradient: 'from-gray-500 to-gray-600', detail: '1.0% risk - Technical only' },
              { text: 'Strong Bearish (<-1.8)', gradient: 'from-red-600 to-red-700', detail: '2.5% risk - Short bounces' }
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
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-400">
            <div className="text-sm font-medium text-gray-800 mb-2">🎯 Sunday 25-Minute Routine:</div>
            <div className="text-xs text-gray-700 space-y-1">
              <div><strong>Minutes 1-3:</strong> Check VIX + Gold vs S&P500 (Market mood)</div>
              <div><strong>Minutes 4-10:</strong> Update rate probabilities (CME FedWatch, ECB Watch)</div>
              <div><strong>Minutes 11-16:</strong> Check 2Y yields + latest CPI trends</div>
              <div><strong>Minutes 17-22:</strong> Review jobs/PMI + current VIX</div>
              <div><strong>Minutes 23-25:</strong> Calculate scores + determine bias</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MacroResults;
