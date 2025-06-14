
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CentralBankInput from '@/components/CentralBankInput';
import InflationInput from '@/components/InflationInput';
import LaborMarketInput from '@/components/LaborMarketInput';
import RiskSentimentInput from '@/components/RiskSentimentInput';
import PMIInput from '@/components/PMIInput';
import CurrentAccountInput from '@/components/CurrentAccountInput';
import GeopoliticalInput from '@/components/GeopoliticalInput';
import MacroResults from '@/components/MacroResults';
import DataVisualization from '@/components/DataVisualization';
import ExportData from '@/components/ExportData';
import { calculateMacroScore } from '@/utils/macroCalculations';

export interface MacroData {
  cb_hawkish_index: number;
  cpi: number;
  cpi_target: number;
  cpi_3m_change: number;
  current_nfp: number;
  nfp_12m_values: number[];
  credit_spread_1m_change: number;
  vix: number;
  pmi: number;
  pmi_3y_values: number[];
  ca_gdp: number;
  ca_5y_values: number[];
  gpr: number;
  gpr_3y_values: number[];
}

const Index = () => {
  const [data, setData] = useState<MacroData>({
    cb_hawkish_index: 0.5,
    cpi: 2.5,
    cpi_target: 2.0,
    cpi_3m_change: 0.1,
    current_nfp: 200,
    nfp_12m_values: [],
    credit_spread_1m_change: 0.05,
    vix: 20,
    pmi: 50,
    pmi_3y_values: [],
    ca_gdp: -3.5,
    ca_5y_values: [],
    gpr: 100,
    gpr_3y_values: []
  });

  const [results, setResults] = useState(null);

  const updateData = (field: keyof MacroData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const calculateScores = () => {
    const calculatedResults = calculateMacroScore(data);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Macroeconomic Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Input economic indicators to calculate macro scores and trading bias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          <CentralBankInput 
            value={data.cb_hawkish_index}
            onChange={(value) => updateData('cb_hawkish_index', value)}
          />
          
          <InflationInput 
            cpi={data.cpi}
            cpi_target={data.cpi_target}
            cpi_3m_change={data.cpi_3m_change}
            onCpiChange={(value) => updateData('cpi', value)}
            onTargetChange={(value) => updateData('cpi_target', value)}
            onChange3M={(value) => updateData('cpi_3m_change', value)}
          />
          
          <LaborMarketInput 
            current_nfp={data.current_nfp}
            nfp_12m_values={data.nfp_12m_values}
            onCurrentChange={(value) => updateData('current_nfp', value)}
            onValuesChange={(values) => updateData('nfp_12m_values', values)}
          />
          
          <RiskSentimentInput 
            credit_spread_1m_change={data.credit_spread_1m_change}
            vix={data.vix}
            onCreditChange={(value) => updateData('credit_spread_1m_change', value)}
            onVixChange={(value) => updateData('vix', value)}
          />
          
          <PMIInput 
            pmi={data.pmi}
            pmi_3y_values={data.pmi_3y_values}
            onPmiChange={(value) => updateData('pmi', value)}
            onValuesChange={(values) => updateData('pmi_3y_values', values)}
          />
          
          <CurrentAccountInput 
            ca_gdp={data.ca_gdp}
            ca_5y_values={data.ca_5y_values}
            onCurrentChange={(value) => updateData('ca_gdp', value)}
            onValuesChange={(values) => updateData('ca_5y_values', values)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <GeopoliticalInput 
            gpr={data.gpr}
            gpr_3y_values={data.gpr_3y_values}
            onGprChange={(value) => updateData('gpr', value)}
            onValuesChange={(values) => updateData('gpr_3y_values', values)}
          />
          
          <div className="flex items-center justify-center">
            <Button 
              onClick={calculateScores}
              className="w-full max-w-md h-16 text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Calculate Macro Score
            </Button>
          </div>
        </div>

        {results && (
          <div className="space-y-8">
            <div className="animate-fade-in">
              <MacroResults results={results} />
            </div>
            
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Data Visualization</h2>
              <DataVisualization data={data} />
            </div>
            
            <div className="animate-fade-in">
              <ExportData data={data} results={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
