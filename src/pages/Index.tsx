
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-teal-500 to-green-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>
        
        {/* Moving particles effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-3000"></div>
        </div>
        
        {/* Enhanced grid pattern with glow effect */}
        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0),
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 60px 60px'
          }}></div>
        </div>
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main content with enhanced glass morphism */}
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced header with better typography and glow effects */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-6 drop-shadow-2xl tracking-tight">
                Macroeconomic Analysis Dashboard
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg -z-10 rounded-lg"></div>
            </div>
            <p className="text-xl text-blue-50/90 max-w-3xl mx-auto font-medium leading-relaxed">
              Advanced economic indicators analysis with real-time macro scoring and trading bias assessment
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-transparent rounded-full"></div>
              <div className="h-1 w-8 bg-gradient-to-r from-purple-400 to-transparent rounded-full"></div>
              <div className="h-1 w-6 bg-gradient-to-r from-cyan-400 to-transparent rounded-full"></div>
            </div>
          </div>

          {results && (
            <div className="mb-12">
              <DashboardSummary data={data} results={results} />
            </div>
          )}

          {/* Input cards with enhanced glass morphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <CentralBankInput 
                value={data.cb_hawkish_index}
                onChange={(value) => updateData('cb_hawkish_index', value)}
              />
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <InflationInput 
                cpi={data.cpi}
                cpi_target={data.cpi_target}
                cpi_3m_change={data.cpi_3m_change}
                onCpiChange={(value) => updateData('cpi', value)}
                onTargetChange={(value) => updateData('cpi_target', value)}
                onChange3M={(value) => updateData('cpi_3m_change', value)}
              />
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <LaborMarketInput 
                current_nfp={data.current_nfp}
                nfp_12m_values={data.nfp_12m_values}
                onCurrentChange={(value) => updateData('current_nfp', value)}
                onValuesChange={(values) => updateData('nfp_12m_values', values)}
              />
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <RiskSentimentInput 
                credit_spread_1m_change={data.credit_spread_1m_change}
                vix={data.vix}
                onCreditChange={(value) => updateData('credit_spread_1m_change', value)}
                onVixChange={(value) => updateData('vix', value)}
              />
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <PMIInput 
                pmi={data.pmi}
                pmi_3y_values={data.pmi_3y_values}
                onPmiChange={(value) => updateData('pmi', value)}
                onValuesChange={(values) => updateData('pmi_3y_values', values)}
              />
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <CurrentAccountInput 
                ca_gdp={data.ca_gdp}
                ca_5y_values={data.ca_5y_values}
                onCurrentChange={(value) => updateData('ca_gdp', value)}
                onValuesChange={(values) => updateData('ca_5y_values', values)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <GeopoliticalInput 
                gpr={data.gpr}
                gpr_3y_values={data.gpr_3y_values}
                onGprChange={(value) => updateData('gpr', value)}
                onValuesChange={(values) => updateData('gpr_3y_values', values)}
              />
            </div>
            
            <div className="flex items-center justify-center backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
              <div className="w-full max-w-md space-y-6 p-8">
                <Button 
                  onClick={calculateScores}
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 border-0 rounded-xl backdrop-blur-sm"
                >
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Calculate Macro Score
                  </span>
                </Button>
                
                {results && (
                  <Button 
                    onClick={() => setShowSaveDialog(true)}
                    variant="outline"
                    className="w-full h-14 text-base font-semibold border-2 border-emerald-400/50 text-emerald-200 hover:bg-emerald-400/20 hover:text-white bg-transparent backdrop-blur-sm shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 rounded-xl"
                  >
                    <Save className="mr-2" size={20} />
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
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-8 text-center">
                  Data Visualization
                </h2>
                <DataVisualization data={data} />
              </div>
              
              <ExportData data={data} results={results} />
            </div>
          )}

          <div className="mt-16">
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
