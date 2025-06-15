
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save } from 'lucide-react';
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
import SavedScores from '@/components/SavedScores';
import DashboardSummary from '@/components/DashboardSummary';
import { calculateMacroScore } from '@/utils/macroCalculations';
import { saveScore } from '@/utils/scoreStorage';
import { useToast } from '@/hooks/use-toast';
import SaveScoreDialog from '@/components/SaveScoreDialog';
import { downloadScoreAsFile } from '@/utils/downloadScoreAsFile';

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { toast } = useToast();

  const updateData = (field: keyof MacroData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const calculateScores = () => {
    const calculatedResults = calculateMacroScore(data);
    setResults(calculatedResults);

    toast({
      title: "Score calculated!",
      description: "Review your macro score. Save it manually to keep a record.",
    });
  };

  const handleSaveScore = (name: string, customDate: Date) => {
    if (!results) {
      toast({
        title: "No results to save",
        description: "Please calculate a macro score first before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      saveScore(results, data, name, customDate);
      setShowSaveDialog(false);
      toast({
        title: "Score saved!",
        description: `Your macro score has been saved as "${name}".`,
      });
    } catch (error) {
      toast({
        title: "Failed to save score",
        description: "There was an error saving your score. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadScore = (loadedData: MacroData) => {
    setData(loadedData);
    setResults(null); // Clear current results when loading new data
    toast({
      title: "Score loaded successfully!",
      description: "The saved data has been loaded. Click 'Calculate Macro Score' to recalculate.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main content with glass effect backdrop */}
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Macroeconomic Analysis Dashboard
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
              Input economic indicators to calculate macro scores and trading bias
            </p>
          </div>

          {results && (
            <div className="mb-12">
              <DashboardSummary data={data} results={results} />
            </div>
          )}

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
              <div className="w-full max-w-md space-y-4">
                <Button 
                  onClick={calculateScores}
                  className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                >
                  Calculate Macro Score
                </Button>
                
                {results && (
                  <Button 
                    onClick={() => setShowSaveDialog(true)}
                    variant="outline"
                    className="w-full h-12 text-base font-medium border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-white bg-transparent backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="mr-2" size={18} />
                    Save with Custom Name
                  </Button>
                )}
              </div>
            </div>
          </div>

          {results && (
            <div className="space-y-8">
              <MacroResults results={results} />
              
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">Data Visualization</h2>
                <DataVisualization data={data} />
              </div>
              
              <ExportData data={data} results={results} />
            </div>
          )}

          <div className="mt-12">
            <SavedScores onLoadScore={handleLoadScore} />
          </div>

          <SaveScoreDialog
            isOpen={showSaveDialog}
            onSave={handleSaveScore}
            onCancel={() => setShowSaveDialog(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
