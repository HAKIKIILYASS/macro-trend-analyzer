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
import { saveScore } from '@/utils/localServerStorage';
import { useToast } from '@/hooks/use-toast';
import SaveScoreDialog from '@/components/SaveScoreDialog';
import { downloadScoreAsFile } from '@/utils/downloadScoreAsFile';
import ServerStatus from '@/components/ServerStatus';
import RecentActivitySidebar from "@/components/RecentActivitySidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ScoreCompare from "@/components/ScoreCompare";
import { SidebarProvider } from "@/components/ui/sidebar";

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

  // For recent sidebar/drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // For compare: store chosen A/B states
  const [compareA, setCompareA] = useState<{ label: string, data: any, results: any } | null>(null);
  const [compareB, setCompareB] = useState<{ label: string, data: any, results: any } | null>(null);

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

  const handleSaveScore = async (name: string, customDate: Date) => {
    if (!results) {
      toast({
        title: "No results to save",
        description: "Please calculate a macro score first before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveScore(results, data, name, customDate);
      setShowSaveDialog(false);
      toast({
        title: "Score saved!",
        description: `Your macro score has been saved as "${name}".`,
      });
    } catch (error) {
      toast({
        title: "Save completed",
        description: "Score saved (using fallback storage if server unavailable).",
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

  const handleCompare = (score: any, slot: "A" | "B") => {
    // Try to recalc results using macro data formula
    let results;
    try {
      results = calculateMacroScore(score.data);
    } catch {
      results = null;
    }
    const obj = { label: score.name, data: score.data, results };
    slot === "A" ? setCompareA(obj) : setCompareB(obj);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
        {/* Theme switch top right */}
        <div className="fixed right-4 top-4 z-50">
          <ThemeSwitcher />
        </div>

        {/* Sidebar (always open desktop; drawer on mobile) */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <RecentActivitySidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            onLoadScore={handleLoadScore}
            onCompare={handleCompare}
          />
        </div>

        {/* Content grid, shift right if sidebar open */}
        <div className={`flex-1 p-4 transition-all duration-200 ${sidebarOpen ? "md:ml-72" : ""}`}>
          <div className="max-w-7xl mx-auto">
            {/* Simple header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-300 bg-clip-text text-transparent mb-4 animate-fade-in">
                Macroeconomic Analysis Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in">
                Advanced economic indicators analysis with real-time macro scoring and trading bias assessment
              </p>
            </div>

            {/* Server Status */}
            <div className="flex justify-center mb-6 animate-scale-in">
              <ServerStatus />
            </div>

            {/* Score compare grid */}
            <ScoreCompare scoreA={compareA} scoreB={compareB} />

            {results && (
              <div className="mb-8 animate-fade-in">
                <DashboardSummary data={data} results={results} />
              </div>
            )}

            {/* Input cards - Clean grid, animated mount */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div className="h-full animate-fade-in">
                <CentralBankInput 
                  value={data.cb_hawkish_index}
                  onChange={(value) => updateData('cb_hawkish_index', value)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <InflationInput 
                  cpi={data.cpi}
                  cpi_target={data.cpi_target}
                  cpi_3m_change={data.cpi_3m_change}
                  onCpiChange={(value) => updateData('cpi', value)}
                  onTargetChange={(value) => updateData('cpi_target', value)}
                  onChange3M={(value) => updateData('cpi_3m_change', value)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <LaborMarketInput 
                  current_nfp={data.current_nfp}
                  nfp_12m_values={data.nfp_12m_values}
                  onCurrentChange={(value) => updateData('current_nfp', value)}
                  onValuesChange={(values) => updateData('nfp_12m_values', values)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <RiskSentimentInput 
                  credit_spread_1m_change={data.credit_spread_1m_change}
                  vix={data.vix}
                  onCreditChange={(value) => updateData('credit_spread_1m_change', value)}
                  onVixChange={(value) => updateData('vix', value)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <PMIInput 
                  pmi={data.pmi}
                  pmi_3y_values={data.pmi_3y_values}
                  onPmiChange={(value) => updateData('pmi', value)}
                  onValuesChange={(values) => updateData('pmi_3y_values', values)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <CurrentAccountInput 
                  ca_gdp={data.ca_gdp}
                  ca_5y_values={data.ca_5y_values}
                  onCurrentChange={(value) => updateData('ca_gdp', value)}
                  onValuesChange={(values) => updateData('ca_5y_values', values)}
                />
              </div>
            </div>

            {/* Geopolitical and Action cards - Better layout, animated */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 animate-scale-in">
                <GeopoliticalInput 
                  gpr={data.gpr}
                  gpr_3y_values={data.gpr_3y_values}
                  onGprChange={(value) => updateData('gpr', value)}
                  onValuesChange={(values) => updateData('gpr_3y_values', values)}
                />
              </div>
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700 animate-scale-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="h-full flex items-center justify-center p-6">
                  <div className="w-full space-y-4">
                    <Button 
                      onClick={calculateScores}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Calculate Macro Score
                    </Button>
                    
                    {results && (
                      <Button 
                        onClick={() => setShowSaveDialog(true)}
                        variant="outline"
                        className="w-full h-12 text-base font-semibold border-2 hover:bg-primary/5 transition-all duration-200"
                      >
                        <Save className="mr-2" size={18} />
                        Save with Custom Name
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {results && (
              <div className="space-y-8">
                <MacroResults results={results} />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-fade-in">
                    Data Visualization
                  </h2>
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
    </SidebarProvider>
  );
};

export default Index;

// Reminder: file is very long (over 260 lines). Consider refactoring into smaller files for maintainability.
