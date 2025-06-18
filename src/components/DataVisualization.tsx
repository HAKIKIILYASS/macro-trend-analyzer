
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CurrencyData } from '@/pages/Index';

interface DataVisualizationProps {
  data: CurrencyData;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  // Create sample visualization data based on current inputs
  const rateExpectationData = [
    { period: 'Current', probability: data.rate_hike_probability },
    { period: 'Expected', probability: 50 }, // baseline
  ];

  const yieldData = [
    { currency: 'US 2Y', yield: data.us_2y_yield },
    { currency: 'Target 2Y', yield: data.target_2y_yield },
  ];

  const economicData = [
    { indicator: 'Employment', score: data.employment_health },
    { indicator: 'PMI', score: (data.pmi - 50) / 10 }, // Normalize PMI to -2 to +2 scale
  ];

  const riskData = [
    { metric: 'VIX', level: data.vix },
    { metric: 'Gold vs Stocks', level: data.gold_vs_stocks_monthly },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg text-slate-800">Rate Expectations</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rateExpectationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="probability" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg text-slate-800">Yield Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="currency" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="yield" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg text-slate-800">Economic Momentum</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={economicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="score" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg text-slate-800">Risk Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="level" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;
