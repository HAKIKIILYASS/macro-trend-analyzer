
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyData } from '@/pages/Index';
import { FileText, Download } from 'lucide-react';

interface ExportDataProps {
  data: CurrencyData;
  results: any;
}

const ExportData: React.FC<ExportDataProps> = ({ data, results }) => {
  const exportToJSON = () => {
    const exportData = {
      input_data: data,
      results: results,
      exported_at: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `currency_analysis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Indicator', 'Value', 'Score'],
      ['Rate Hike Probability (%)', data.rate_hike_probability, results?.scores?.rate_policy || 'N/A'],
      ['Rate Cut Probability (%)', data.rate_cut_probability, ''],
      ['US 2Y Yield (%)', data.us_2y_yield, results?.scores?.real_interest_edge || 'N/A'],
      ['Target 2Y Yield (%)', data.target_2y_yield, ''],
      ['US Inflation Expectation (%)', data.us_inflation_expectation, ''],
      ['Target Inflation Expectation (%)', data.target_inflation_expectation, ''],
      ['Employment Health', data.employment_health, results?.scores?.growth_momentum || 'N/A'],
      ['PMI', data.pmi, ''],
      ['VIX Level', data.vix, results?.scores?.risk_appetite || 'N/A'],
      ['Gold vs Stocks Monthly (%)', data.gold_vs_stocks_monthly, ''],
      ['ETF Flows', data.etf_flows, results?.scores?.money_flow || 'N/A'],
      ['', '', ''],
      ['Total Score', '', results?.total_score || 'N/A'],
      ['Trading Bias', '', results?.bias || 'N/A']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `currency_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg border border-indigo-200 bg-gradient-to-br from-white to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <FileText size={20} />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-4 flex-wrap">
          <Button 
            onClick={exportToJSON}
            variant="outline"
            className="border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 text-indigo-700 font-medium flex items-center gap-2"
          >
            <Download size={16} />
            Export as JSON
          </Button>
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 text-indigo-700 font-medium flex items-center gap-2"
          >
            <Download size={16} />
            Export as CSV
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Export your currency analysis data and results for external use or record keeping.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExportData;
