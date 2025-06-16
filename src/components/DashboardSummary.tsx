
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Minus } from 'lucide-react';
import { CurrencyData } from '@/pages/Index';

interface DashboardSummaryProps {
  data: CurrencyData;
  results: {
    scores: {
      rate_expectations: number;
      real_rate_edge: number;
      economic_momentum: number;
      risk_sentiment: number;
      flow_dynamics: number;
    };
    total_score: number;
    bias: string;
    biasColor: string;
  } | null;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ data, results }) => {
  const getTrendIcon = (score: number) => {
    if (score > 0.3) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score < -0.3) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getStatusIcon = (score: number) => {
    if (Math.abs(score) > 1) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    if (score > 0.3) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const keyMetrics = [
    { 
      label: 'Rate Expectations', 
      value: data.rate_hike_probability.toFixed(0), 
      unit: '%',
      score: results?.scores.rate_expectations || 0,
      description: 'Hike Probability'
    },
    { 
      label: 'Real Rate Edge', 
      value: (data.us_2y_yield - data.us_cpi).toFixed(1), 
      unit: '%',
      score: results?.scores.real_rate_edge || 0,
      description: 'US Real Rate'
    },
    { 
      label: 'Economic Momentum', 
      value: data.pmi.toString(), 
      unit: '',
      score: results?.scores.economic_momentum || 0,
      description: 'PMI Level'
    },
    { 
      label: 'Risk Sentiment', 
      value: data.vix_level.toFixed(0), 
      unit: '',
      score: results?.scores.risk_sentiment || 0,
      description: 'VIX Level'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            📊 Executive Dashboard Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                  {getTrendIcon(metric.score)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-xs text-gray-500">{metric.description}</div>
                <div className="flex items-center gap-1 mt-2">
                  {getStatusIcon(metric.score)}
                  <span className={`text-xs font-medium ${
                    metric.score > 0.3 ? 'text-green-600' : 
                    metric.score < -0.3 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Score: {metric.score > 0 ? '+' : ''}{metric.score.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {results && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Currency Bias</h3>
                  <p className="text-sm text-gray-600">Based on comprehensive currency analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1" style={{ color: results.biasColor }}>
                    {results.total_score.toFixed(2)}
                  </div>
                  <Badge 
                    className="text-sm px-3 py-1 font-semibold" 
                    style={{ backgroundColor: results.biasColor, color: 'white' }}
                  >
                    {results.bias}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold">
            💡 Key Currency Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Rate Environment</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Rate Hike Probability</span>
                  <span className={`text-sm font-medium ${
                    data.rate_hike_probability > 70 ? 'text-green-600' : 
                    data.rate_hike_probability > 30 ? 'text-orange-500' : 'text-red-600'
                  }`}>
                    {data.rate_hike_probability}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">PMI Status</span>
                  <span className={`text-sm font-medium ${
                    data.pmi > 50 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.pmi > 50 ? 'Expanding' : 'Contracting'} ({data.pmi})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Market Volatility</span>
                  <span className={`text-sm font-medium ${
                    data.vix_level > 25 ? 'text-red-600' : data.vix_level > 15 ? 'text-orange-500' : 'text-green-600'
                  }`}>
                    {data.vix_level > 25 ? 'High' : data.vix_level > 15 ? 'Moderate' : 'Low'} ({data.vix_level})
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Employment Score</span>
                  <span className={`text-sm font-medium ${
                    data.employment_score > 0 ? 'text-green-600' : data.employment_score < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {data.employment_score > 0 ? 'Strong' : data.employment_score < 0 ? 'Weak' : 'Neutral'} ({data.employment_score})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
