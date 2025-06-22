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
import CurrencyPairSelector, { CurrencyPair } from '@/components/CurrencyPairSelector';
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
  // Currency Pair Selection
  selectedPair: CurrencyPair;
  
  // Regime Detection
  vix: number;
  gold_vs_stocks_monthly: number;
  sp500_new_highs: boolean;
  is_cb_week: boolean;
  
  // Rate Policy (30%) - Updated for dual currency support
  base_currency_rate_hike_probability: number;
  base_currency_rate_cut_probability: number;
  base_currency_guidance_shift: 'hawkish' | 'neutral' | 'dovish';
  quote_currency_rate_hike_probability: number;
  quote_currency_rate_cut_probability: number;
  quote_currency_guidance_shift: 'hawkish' | 'neutral' | 'dovish';
  
  // Growth Momentum (25%) - Updated for dual currency support
  base_currency_employment_health: number;
  base_currency_pmi: number;
  quote_currency_employment_health: number;
  quote_currency_pmi: number;
  
  // Real Interest Edge (25%) - Updated for dual currency support
  base_currency_2y_yield: number;
  base_currency_inflation_expectation: number;
  quote_currency_2y_yield: number;
  quote_currency_inflation_expectation: number;
  
  // Risk Appetite (15%) - Shared between currencies
  gold_sp500_ratio_trend: 'rising' | 'stable' | 'falling';
  gold_sp500_weekly_performance: number;
  
  // Money Flow (5%) - Pair-specific
  relevant_etf_flows: {
    [key: string]: number;
  };
  etf_flows: 'major_inflows' | 'normal' | 'major_outflows';
}

const Index = () => {
  const [data, setData] = useState<CurrencyData>({
    selectedPair: 'EUR/USD',
    vix: 20,
    gold_vs_stocks_monthly: 0,
    sp500_new_highs: false,
    is_cb_week: false,
    base_currency_rate_hike_probability: 50,
    base_currency_rate_cut_probability: 25,
    base_currency_guidance_shift: 'neutral',
    quote_currency_rate_hike_probability: 50,
    quote_currency_rate_cut_probability: 25,
    quote_currency_guidance_shift: 'neutral',
    base_currency_employment_health: 0,
    base_currency_pmi: 50,
    quote_currency_employment_health: 0,
    quote_currency_pmi: 50,
    base_currency_2y_yield: 3.5,
    base_currency_inflation_expectation: 2.8,
    quote_currency_2y_yield: 4.5,
    quote_currency_inflation_expectation: 3.2,
    gold_sp500_ratio_trend: 'stable',
    gold_sp500_weekly_performance: 0,
    relevant_etf_flows: {
      FXE: 0, // EUR
      UUP: 0, // USD
    },
    etf_flows: 'normal'
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

  const handlePairChange = (pair: CurrencyPair) => {
    // Reset relevant ETF flows when pair changes
    const getRelevantETFs = (selectedPair: CurrencyPair) => {
      const etfMap: { [key: string]: string[] } = {
        'EUR/USD': ['FXE', 'UUP'],
        'GBP/USD': ['FXB', 'UUP'],
        'USD/JPY': ['UUP', 'FXY'],
        'AUD/USD': ['FXA', 'UUP'],
        'USD/CAD': ['UUP', 'FXC'],
        'USD/CHF': ['UUP', 'FXF'],
      };
      
      const relevantETFs = etfMap[selectedPair] || ['UUP'];
      const flows: { [key: string]: number } = {};
      relevantETFs.forEach(etf => flows[etf] = 0);
      return flows;
    };

    setData(prev => ({
      ...prev,
      selectedPair: pair,
      relevant_etf_flows: getRelevantETFs(pair)
    }));
  };

  const handleRelevantFlowChange = (etf: string, value: number) => {
    setData(prev => ({
      ...prev,
      relevant_etf_flows: {
        ...prev.relevant_etf_flows,
        [etf]: value
      }
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

  const getCurrencyNames = () => {
    const [base, quote] = data.selectedPair.split('/');
    return { base, quote };
  };

  const { base, quote } = getCurrencyNames();

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

            {/* Currency Pair Selector */}
            <CurrencyPairSelector 
              selectedPair={data.selectedPair}
              onPairChange={handlePairChange}
            />

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

            {/* Dual Currency Rate Policy */}
            <div className="mb-8 animate-fade-in">
              <RateExpectationsInput 
                selectedPair={data.selectedPair}
                baseCurrencyData={{
                  rate_hike_probability: data.base_currency_rate_hike_probability,
                  rate_cut_probability: data.base_currency_rate_cut_probability,
                  guidance_shift: data.base_currency_guidance_shift
                }}
                quoteCurrencyData={{
                  rate_hike_probability: data.quote_currency_rate_hike_probability,
                  rate_cut_probability: data.quote_currency_rate_cut_probability,
                  guidance_shift: data.quote_currency_guidance_shift
                }}
                onBaseCurrencyChange={(field, value) => {
                  if (field === 'rate_hike_probability') updateData('base_currency_rate_hike_probability', value);
                  if (field === 'rate_cut_probability') updateData('base_currency_rate_cut_probability', value);
                  if (field === 'guidance_shift') updateData('base_currency_guidance_shift', value);
                }}
                onQuoteCurrencyChange={(field, value) => {
                  if (field === 'rate_hike_probability') updateData('quote_currency_rate_hike_probability', value);
                  if (field === 'rate_cut_probability') updateData('quote_currency_rate_cut_probability', value);
                  if (field === 'guidance_shift') updateData('quote_currency_guidance_shift', value);
                }}
              />
            </div>

            {/* Dual Currency Growth Momentum */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="animate-scale-in">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-200 bg-gradient-to-br from-white to-orange-50 h-full">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <span className="text-xl">📈</span>
                      {base} Growth Momentum (25%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">
                          {base} Employment Health (-1 to +1)
                        </Label>
                        <Input
                          type="number"
                          value={data.base_currency_employment_health}
                          onChange={(e) => updateData('base_currency_employment_health', parseFloat(e.target.value) || 0)}
                          min={-1}
                          max={1}
                          step={0.1}
                          className="text-base border-orange-300 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">
                          {base} Manufacturing PMI
                        </Label>
                        <Input
                          type="number"
                          value={data.base_currency_pmi}
                          onChange={(e) => updateData('base_currency_pmi', parseFloat(e.target.value) || 0)}
                          min={30}
                          max={70}
                          step={0.1}
                          className="text-base border-orange-300 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="animate-scale-in">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-200 bg-gradient-to-br from-white to-orange-50 h-full">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <span className="text-xl">📈</span>
                      {quote} Growth Momentum (25%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">
                          {quote} Employment Health (-1 to +1)
                        </Label>
                        <Input
                          type="number"
                          value={data.quote_currency_employment_health}
                          onChange={(e) => updateData('quote_currency_employment_health', parseFloat(e.target.value) || 0)}
                          min={-1}
                          max={1}
                          step={0.1}
                          className="text-base border-orange-300 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">
                          {quote} Manufacturing PMI
                        </Label>
                        <Input
                          type="number"
                          value={data.quote_currency_pmi}
                          onChange={(e) => updateData('quote_currency_pmi', parseFloat(e.target.value) || 0)}
                          min={30}
                          max={70}
                          step={0.1}
                          className="text-base border-orange-300 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Dual Currency Real Rate Edge */}
            <div className="mb-8 animate-fade-in">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-200 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <span className="text-xl">🏛️</span>
                    Real Interest Edge (25%) - {selectedPair}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">{base} Data</h4>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          {base} 2Y Government Yield (%)
                        </Label>
                        <Input
                          type="number"
                          value={data.base_currency_2y_yield}
                          onChange={(e) => updateData('base_currency_2y_yield', parseFloat(e.target.value) || 0)}
                          min={-1}
                          max={10}
                          step={0.01}
                          className="text-base border-blue-300 focus:border-blue-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          {base} Inflation Expectation (%)
                        </Label>
                        <Input
                          type="number"
                          value={data.base_currency_inflation_expectation}
                          onChange={(e) => updateData('base_currency_inflation_expectation', parseFloat(e.target.value) || 0)}
                          min={-2}
                          max={15}
                          step={0.1}
                          className="text-base border-blue-300 focus:border-blue-500 mt-1"
                        />
                      </div>
                      <div className="p-2 bg-blue-50 rounded border">
                        <div className="text-xs text-gray-600">{base} Real Rate:</div>
                        <div className="text-lg font-bold text-blue-600">
                          {(data.base_currency_2y_yield - data.base_currency_inflation_expectation).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">{quote} Data</h4>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          {quote} 2Y Government Yield (%)
                        </Label>
                        <Input
                          type="number"
                          value={data.quote_currency_2y_yield}
                          onChange={(e) => updateData('quote_currency_2y_yield', parseFloat(e.target.value) || 0)}
                          min={-1}
                          max={10}
                          step={0.01}
                          className="text-base border-blue-300 focus:border-blue-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          {quote} Inflation Expectation (%)
                        </Label>
                        <Input
                          type="number"
                          value={data.quote_currency_inflation_expectation}
                          onChange={(e) => updateData('quote_currency_inflation_expectation', parseFloat(e.target.value) || 0)}
                          min={-2}
                          max={15}
                          step={0.1}
                          className="text-base border-blue-300 focus:border-blue-500 mt-1"
                        />
                      </div>
                      <div className="p-2 bg-green-50 rounded border">
                        <div className="text-xs text-gray-600">{quote} Real Rate:</div>
                        <div className="text-lg font-bold text-green-600">
                          {(data.quote_currency_2y_yield - data.quote_currency_inflation_expectation).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">Real Rate Differential:</span>
                      <span className={`text-xl font-bold ${(data.base_currency_2y_yield - data.base_currency_inflation_expectation) - (data.quote_currency_2y_yield - data.quote_currency_inflation_expectation) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((data.base_currency_2y_yield - data.base_currency_inflation_expectation) - (data.quote_currency_2y_yield - data.quote_currency_inflation_expectation)) > 0 ? '+' : ''}{((data.base_currency_2y_yield - data.base_currency_inflation_expectation) - (data.quote_currency_2y_yield - data.quote_currency_inflation_expectation)).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {base} advantage: {((data.base_currency_2y_yield - data.base_currency_inflation_expectation) - (data.quote_currency_2y_yield - data.quote_currency_inflation_expectation)) > 0 ? 'Positive' : 'Negative'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Sentiment and Enhanced Flow Dynamics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700 animate-scale-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="h-full flex items-center justify-center p-6">
                  <div className="w-full space-y-4">
                    <Button 
                      onClick={calculateScores} 
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    >
                      Calculate {data.selectedPair} Score
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
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-700">
                        <div className="font-semibold mb-1">✅ Phase 3 Complete: Enhanced Money Flow</div>
                        <div>• Pair-specific ETF analysis</div>
                        <div>• Relative flow advantage calculation</div>
                        <div>• Simplified interface (only relevant ETFs)</div>
                        <div>• Smart threshold detection</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Flow Dynamics - Full Width */}
            <div className="mb-8 animate-fade-in">
              <FlowDynamicsInput 
                selectedPair={data.selectedPair}
                relevant_etf_flows={data.relevant_etf_flows}
                etf_flows={data.etf_flows}
                onRelevantFlowChange={handleRelevantFlowChange}
                onFlowsChange={(value) => updateData('etf_flows', value)}
              />
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