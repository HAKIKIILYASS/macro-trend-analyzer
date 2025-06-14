
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MacroData } from '@/pages/Index';

interface DataVisualizationProps {
  data: MacroData;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const nfpChartData = data.nfp_12m_values.map((value, index) => ({
    month: `M${index + 1}`,
    value: value
  }));

  const pmiChartData = data.pmi_3y_values.map((value, index) => ({
    period: `P${index + 1}`,
    value: value
  }));

  const caChartData = data.ca_5y_values.map((value, index) => ({
    year: `Y${index + 1}`,
    value: value
  }));

  const gprChartData = data.gpr_3y_values.map((value, index) => ({
    period: `P${index + 1}`,
    value: value
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {nfpChartData.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">NFP Trend (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={nfpChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="value" stroke="#475569" strokeWidth={2} dot={{ fill: '#475569' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {pmiChartData.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">PMI Trend (3 Years)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pmiChartData}>
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
                <Bar dataKey="value" fill="#64748b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {caChartData.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">Current Account Trend (5 Years)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={caChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="value" stroke="#475569" strokeWidth={2} dot={{ fill: '#475569' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {gprChartData.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg text-slate-800">Geopolitical Risk Trend (3 Years)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gprChartData}>
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
                <Line type="monotone" dataKey="value" stroke="#475569" strokeWidth={2} dot={{ fill: '#475569' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataVisualization;
