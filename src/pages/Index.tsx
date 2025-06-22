
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Menu } from 'lucide-react';
import RateExpectationsInput from '@/components/RateExpectationsInput';
import RealRateEdgeInput from '@/components/RealRateEdgeInput';
import EconomicMomentumInput from '@/components/EconomicMomentumInput';
import RiskSentimentInput from '@/components/RiskSentimentInput';
import FlowDynamicsInput from '@/components/FlowDynamicsInput';
import RegimeDetectionInput from '@/components/RegimeDetectionInput';
import MacroResults from '@/components/MacroResults';
import DataVisualization from '@/components/DataVisualization';
import ExportData from '@/components/ExportData';
import SavedScores from '@/components/SavedScores';
import DashboardSummary from '@/components/DashboardSummary';
import { calculateCurrencyScore } from '@/utils/currencyCalculations';
import { saveScore } from '@/utils/localServerStorage';
import { useToast } from '@/hooks/use-toast';
import SaveScoreDialog from '@/components/SaveScoreDialog';
import { downloadScoreAsFile } from '@/utils/downloadScoreAsFile';
import ServerStatus from '@/components/ServerStatus';
import RecentActivitySidebar from "@/components/RecentActivitySidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ScoreCompare from "@/components/ScoreCompare";
import { SidebarProvider } from "@/components/ui/sidebar";

export interface CurrencyData {
  // Regime Detection
  vix: number;
  gold_vs_stocks_monthly: number; // Monthly performance difference %
  sp500_new_highs: boolean;
  is_cb_week: boolean;
  
  // Rate Policy (30%)
  rate_hike_probability: number; // 0-100%
  rate_cut_probability: number; // 0-100%
  guidance_shift: 'hawkish' | 'neutral' | 'dovish';
  
  // Growth Momentum (25%)
  employment_health: number; // Strong(+1.0), Normal(0.0), Weak(-1.0)
  pmi: number;
  
  // Real Interest Edge (25%)
  us_2y_yield: number;
  target_2y_yield: number;
  us_inflation_expectation: number;
  target_inflation_expectation: number;
  
  // Risk Appetite (15%)
  gold_sp500_ratio_trend: 'rising' | 'stable' | 'falling';
  gold_sp500_weekly_performance: number; // Weekly performance difference %
  
  // Money Flow (5%)
  etf_flows: 'major_inflows' | 'normal' | 'major_outflows';
  uup_flow: number; // USD ETF flow in millions
  fxe_flow: number; // EUR ETF flow in millions
  fxb_flow: number; // GBP ETF flow in millions
  fxa_flow: number; // AUD ETF flow in millions
  fxc_flow: number; // CAD ETF flow in millions
}

const Index = () => {
  const [data, setData] = useState<CurrencyData>({
    vix: 20,
    gold_vs_stocks_monthly: 0,
    sp500_new_highs: false,
    is_cb_week: false,
    rate_hike_probability: 50,
    rate_cut_probability: 25,
    guidance_shift: 'neutral',
    employment_health: 0,
    pmi: 50,
    us_2y_yield: 4.5,
    target_2y_yield: 3.5,
    us_inflation_expectation: 3.2,
    target_inflation_expectation: 2.8,
    gold_sp500_ratio_trend: 'stable',
    gold_sp500_weekly_performance: 0,
    etf_flows: 'normal',
    uup_flow: 0,
    fxe_flow: 0,
    fxb_flow: 0,
    fxa_flow: 0,
    fxc_flow: 0
  });

  const [results, setResults] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compareA, setCompareA] = useState<{
    label: string;
    data: any;
    results: any;
  } | null>(null);
  const [compareB, setCompareB] = useState<{
    label: string;
    data: any;
    results: any;
  } | null>(null);

  const { toast } = useToast();

  const updateData = (field: keyof CurrencyData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateScores = () => {
    const calculatedResults = calculateCurrencyScore(data);
    setResults(calculatedResults);
    toast({
      title: "Currency analysis complete!",
      description: "Review your trading bias and position sizing recommendations."
    });
  };

  const handleSaveScore = async (name: string, customDate: Date) => {
    if (!results) {
      toast({
        title: "No results to save",
        description: "Please calculate a currency score first before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveScore(results, data, name, customDate);
      setShowSaveDialog(false);
      toast({
        title: "Analysis saved!",
        description: `Your currency analysis has been saved as "${name}".`
      });
    } catch (error) {
      toast({
        title: "Save completed",
        description: "Analysis saved (using fallback storage if server unavailable)."
      });
    }
  };

  const handleLoadScore = (loadedData: CurrencyData) => {
    setData(loadedData);
    setResults(null);
    toast({
      title: "Analysis loaded successfully!",
      description: "The saved data has been loaded. Click 'Calculate Currency Score' to recalculate."
    });
  };

  const handleCompare = (score: any, slot: "A" | "B") => {
    console.log('handleCompare called:', slot, score.name);
    let results;
    try {
      results = calculateCurrencyScore(score.data);
    } catch (error) {
      console.error('Error calculating score for comparison:', error);
      results = null;
    }

    const obj = {
      label: score.name,
      data: score.data,
      results
    };

    if (slot === "A") {
      setCompareA(obj);
      console.log('Set compareA:', obj);
    } else {
      setCompareB(obj);
      console.log('Set compareB:', obj);
    }

    toast({
      title: `Scenario ${slot} set!`,
      description: `"${score.name}" is now in comparison slot ${slot}.`
    });
  };

  const clearComparison = () => {
    setCompareA(null);
    setCompareB(null);
    toast({
      title: "Comparison cleared",
      description: "Both scenarios have been removed from comparison."
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-green-950/20 transition-all duration-500">
        
        {/* Top controls */}
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="pointer-events-auto bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg border-gray-200 text-zinc-950"
          >
            <Menu className="mr-2 h-4 w-4" />
            {sidebarOpen ? 'Hide' : 'Show'} Recent Scores
          </Button>
          <div className="pointer-events-auto">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="fixed left-0 top-0 h-screen z-40">
          <RecentActivitySidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen} 
            onLoadScore={handleLoadScore} 
            onCompare={handleCompare} 
          />
        </div>

        <div className={`flex-1 p-4 pt-20 transition-all duration-200 ${sidebarOpen ? "md:ml-72" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-50 dark:to-gray-300 bg-clip-text text-transparent mb-4 animate-fade-in">
                Perfect Retail Forex Macro Scoring Model
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in">
                Professional Edge • Retail Simplicity • Zero Mistakes - 25 minutes weekly maintenance
              </p>
            </div>

            <div className="flex justify-center mb-6 animate-scale-in">
              <ServerStatus />
            </div>

            <ScoreCompare scoreA={compareA} scoreB={compareB} onClearComparison={clearComparison} />

            {results && (
              <div className="mb-8 animate-fade-in">
                <DashboardSummary data={data} results={results} />
              </div>
            )}

            {/* Regime Detection */}
            <div className="mb-8 animate-fade-in">
              <RegimeDetectionInput 
                vix={data.vix}
                gold_vs_stocks_monthly={data.gold_vs_stocks_monthly}
                sp500_new_highs={data.sp500_new_highs}
                is_cb_week={data.is_cb_week}
                onVixChange={(value) => updateData('vix', value)}
                onGoldStocksChange={(value) => updateData('gold_vs_stocks_monthly', value)}
                onSp500HighsChange={(value) => updateData('sp500_new_highs', value)}
                onCbWeekChange={(value) => updateData('is_cb_week', value)}
              />
            </div>

            {/* Input cards - Updated 5-factor model */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <div className="h-full animate-fade-in">
                <RateExpectationsInput 
                  rate_hike_probability={data.rate_hike_probability}
                  rate_cut_probability={data.rate_cut_probability}
                  guidance_shift={data.guidance_shift}
                  onHikeProbabilityChange={(value) => updateData('rate_hike_probability', value)}
                  onCutProbabilityChange={(value) => updateData('rate_cut_probability', value)}
                  onGuidanceChange={(value) => updateData('guidance_shift', value)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <RealRateEdgeInput 
                  us_2y_yield={data.us_2y_yield}
                  target_2y_yield={data.target_2y_yield}
                  us_inflation_expectation={data.us_inflation_expectation}
                  target_inflation_expectation={data.target_inflation_expectation}
                  onUsYieldChange={(value) => updateData('us_2y_yield', value)}
                  onTargetYieldChange={(value) => updateData('target_2y_yield', value)}
                  onUsInflationChange={(value) => updateData('us_inflation_expectation', value)}
                  onTargetInflationChange={(value) => updateData('target_inflation_expectation', value)}
                />
              </div>
              <div className="h-full animate-fade-in">
                <EconomicMomentumInput 
                  employment_health={data.employment_health}
                  pmi={data.pmi}
                  onEmploymentChange={(value) => updateData('employment_health', value)}
                  onPmiChange={(value) => updateData('pmi', value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="animate-scale-in">
                <RiskSentimentInput 
                  vix={data.vix}
                  gold_sp500_ratio_trend={data.gold_sp500_ratio_trend}
                  gold_sp500_weekly_performance={data.gold_sp500_weekly_performance}
                  onVixChange={(value) => updateData('vix', value)}
                  onGoldRatioChange={(value) => updateData('gold_sp500_ratio_trend', value)}
                  onGoldWeeklyChange={(value) => updateData('gold_sp500_weekly_performance', value)}
                />
              </div>
              <div className="animate-scale-in">
                <FlowDynamicsInput 
                  etf_flows={data.etf_flows}
                  uup_flow={data.uup_flow}
                  fxe_flow={data.fxe_flow}
                  fxb_flow={data.fxb_flow}
                  fxa_flow={data.fxa_flow}
                  fxc_flow={data.fxc_flow}
                  onFlowsChange={(value) => updateData('etf_flows', value)}
                  onUupFlowChange={(value) => updateData('uup_flow', value)}
                  onFxeFlowChange={(value) => updateData('fxe_flow', value)}
                  onFxbFlowChange={(value) => updateData('fxb_flow', value)}
                  onFxaFlowChange={(value) => updateData('fxa_flow', value)}
                  onFxcFlowChange={(value) => updateData('fxc_flow', value)}
                />
              </div>
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700 animate-scale-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="h-full flex items-center justify-center p-6">
                  <div className="w-full space-y-4">
                    <Button 
                      onClick={calculateScores} 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Calculate Currency Score
                    </Button>
                    
                    {results && (
                      <Button 
                        onClick={() => setShowSaveDialog(true)} 
                        variant="outline" 
                        className="w-full h-12 text-base font-semibold border-2 hover:bg-primary/5 transition-all duration-200"
                      >
                        <Save className="mr-2" size={18} />
                        Save Analysis
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
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center animate-fade-in">
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
