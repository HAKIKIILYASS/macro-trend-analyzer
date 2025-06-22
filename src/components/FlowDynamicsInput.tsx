import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { CurrencyPair } from './CurrencyPairSelector';

interface FlowDynamicsInputProps {
  selectedPair: CurrencyPair;
  relevant_etf_flows: { [key: string]: number };
  etf_flows: 'major_inflows' | 'normal' | 'major_outflows';
  onRelevantFlowChange: (etf: string, value: number) => void;
  onFlowsChange: (value: 'major_inflows' | 'normal' | 'major_outflows') => void;
}

const FlowDynamicsInput: React.FC<FlowDynamicsInputProps> = ({
  selectedPair,
  relevant_etf_flows,
  etf_flows,
  onRelevantFlowChange,
  onFlowsChange
}) => {
  // Define ETF mappings for each currency pair
  const getETFMapping = (pair: CurrencyPair) => {
    const etfData: { [key: string]: { etfs: string[], description: string } } = {
      'EUR/USD': {
        etfs: ['FXE', 'UUP'],
        description: 'EUR vs USD institutional flows'
      },
      'GBP/USD': {
        etfs: ['FXB', 'UUP'],
        description: 'GBP vs USD institutional flows'
      },
      'USD/JPY': {
        etfs: ['UUP', 'FXY'],
        description: 'USD vs JPY institutional flows'
      },
      'AUD/USD': {
        etfs: ['FXA', 'UUP'],
        description: 'AUD vs USD institutional flows'
      },
      'USD/CAD': {
        etfs: ['UUP', 'FXC'],
        description: 'USD vs CAD institutional flows'
      },
      'USD/CHF': {
        etfs: ['UUP', 'FXF'],
        description: 'USD vs CHF institutional flows'
      }
    };
    return etfData[pair] || { etfs: ['UUP'], description: 'USD institutional flows' };
  };

  const getETFDetails = (etf: string) => {
    const etfDetails: { [key: string]: { name: string, currency: string, threshold: number, url: string } } = {
      'UUP': {
        name: 'Invesco DB US Dollar Index Bullish Fund',
        currency: 'USD',
        threshold: 500,
        url: 'https://finance.yahoo.com/quote/UUP'
      },
      'FXE': {
        name: 'Invesco CurrencyShares Euro Trust',
        currency: 'EUR',
        threshold: 200,
        url: 'https://finance.yahoo.com/quote/FXE'
      },
      'FXB': {
        name: 'Invesco CurrencyShares British Pound Sterling Trust',
        currency: 'GBP',
        threshold: 100,
        url: 'https://finance.yahoo.com/quote/FXB'
      },
      'FXA': {
        name: 'Invesco CurrencyShares Australian Dollar Trust',
        currency: 'AUD',
        threshold: 100,
        url: 'https://finance.yahoo.com/quote/FXA'
      },
      'FXC': {
        name: 'Invesco CurrencyShares Canadian Dollar Trust',
        currency: 'CAD',
        threshold: 50,
        url: 'https://finance.yahoo.com/quote/FXC'
      },
      'FXF': {
        name: 'Invesco CurrencyShares Swiss Franc Trust',
        currency: 'CHF',
        threshold: 50,
        url: 'https://finance.yahoo.com/quote/FXF'
      },
      'FXY': {
        name: 'Invesco CurrencyShares Japanese Yen Trust',
        currency: 'JPY',
        threshold: 50,
        url: 'https://finance.yahoo.com/quote/FXY'
      }
    };
    return etfDetails[etf] || { name: etf, currency: 'Unknown', threshold: 100, url: '#' };
  };

  const getFlowScore = (etf: string, flow: number) => {
    const details = getETFDetails(etf);
    const threshold = details.threshold;
    
    if (flow > threshold) return { score: 0.5, label: 'Bullish flows', color: 'text-green-600', icon: <TrendingUp className="w-4 h-4" /> };
    if (flow < -threshold) return { score: -0.5, label: 'Bearish flows', color: 'text-red-600', icon: <TrendingDown className="w-4 h-4" /> };
    return { score: 0.0, label: 'Normal activity', color: 'text-gray-600', icon: null };
  };

  const calculateRelativeFlowAdvantage = () => {
    const mapping = getETFMapping(selectedPair);
    const [baseCurrency, quoteCurrency] = selectedPair.split('/');
    
    let baseFlow = 0;
    let quoteFlow = 0;
    
    mapping.etfs.forEach(etf => {
      const details = getETFDetails(etf);
      const flow = relevant_etf_flows[etf] || 0;
      const flowScore = getFlowScore(etf, flow);
      
      if (details.currency === baseCurrency) {
        baseFlow += flowScore.score;
      } else if (details.currency === quoteCurrency) {
        quoteFlow += flowScore.score;
      }
    });
    
    const advantage = baseFlow - quoteFlow;
    return {
      advantage,
      baseFlow,
      quoteFlow,
      interpretation: advantage > 0.25 ? `${baseCurrency} flow advantage` : 
                     advantage < -0.25 ? `${quoteCurrency} flow advantage` : 
                     'Balanced flows'
    };
  };

  const mapping = getETFMapping(selectedPair);
  const flowAdvantage = calculateRelativeFlowAdvantage();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-200 bg-gradient-to-br from-white to-teal-50">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">💸</span>
          Smart Money Flow (5%) - {selectedPair}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-teal-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Track institutional money flows for {selectedPair}. Only shows relevant ETFs for your selected currency pair.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 mb-4">
            <div className="text-sm font-medium text-gray-800 mb-1">🎯 Pair-Specific Analysis:</div>
            <div className="text-sm text-gray-700">{mapping.description}</div>
          </div>

          {/* Relevant ETF Flows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mapping.etfs.map(etf => {
              const details = getETFDetails(etf);
              const flow = relevant_etf_flows[etf] || 0;
              const flowInfo = getFlowScore(etf, flow);
              
              return (
                <div key={etf} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${etf}-flow`} className="text-sm font-medium text-gray-700">
                        {etf} ({details.currency})
                      </Label>
                      <a 
                        href={details.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${flowInfo.color}`}>
                      {flowInfo.icon}
                      {flowInfo.score > 0 ? '+' : ''}{flowInfo.score.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      id={`${etf}-flow`}
                      type="number"
                      value={flow}
                      onChange={(e) => onRelevantFlowChange(etf, parseFloat(e.target.value) || 0)}
                      min={-2000}
                      max={2000}
                      step={10}
                      className="text-sm border-teal-300 focus:border-teal-500"
                    />
                    <span className="text-xs text-gray-600">$M</span>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">{details.name}</div>
                    <div>Threshold: ±${details.threshold}M ({flowInfo.label})</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow Advantage Analysis */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
            <div className="text-sm font-semibold text-gray-800 mb-2">📊 Relative Flow Advantage:</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-600">{selectedPair.split('/')[0]} Flows</div>
                <div className={`text-lg font-bold ${flowAdvantage.baseFlow > 0 ? 'text-green-600' : flowAdvantage.baseFlow < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {flowAdvantage.baseFlow > 0 ? '+' : ''}{flowAdvantage.baseFlow.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Net Advantage</div>
                <div className={`text-lg font-bold ${flowAdvantage.advantage > 0.25 ? 'text-green-600' : flowAdvantage.advantage < -0.25 ? 'text-red-600' : 'text-gray-600'}`}>
                  {flowAdvantage.advantage > 0 ? '+' : ''}{flowAdvantage.advantage.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">{selectedPair.split('/')[1]} Flows</div>
                <div className={`text-lg font-bold ${flowAdvantage.quoteFlow > 0 ? 'text-green-600' : flowAdvantage.quoteFlow < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {flowAdvantage.quoteFlow > 0 ? '+' : ''}{flowAdvantage.quoteFlow.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-700">{flowAdvantage.interpretation}</span>
            </div>
          </div>

          {/* Overall Assessment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="etf-flows" className="text-base font-medium text-gray-700">
                Overall Flow Assessment (Fallback)
              </Label>
              <a 
                href="https://www.etf.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                ETF.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <Select value={etf_flows} onValueChange={onFlowsChange}>
              <SelectTrigger className="border-teal-300 focus:border-teal-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major_inflows">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🟢</span>
                    Major Inflows (Bullish +0.5)
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">⚪</span>
                    Normal Activity (0.0)
                  </div>
                </SelectItem>
                <SelectItem value="major_outflows">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">🔴</span>
                    Major Outflows (Bearish -0.5)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-600 mt-1">
              Use this if specific ETF data is unavailable
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400">
            <div className="text-xs font-medium text-gray-800 mb-2">📱 Monthly Data Sources:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>• ETF.com (Primary source)</div>
              <div>• Yahoo Finance ETF pages</div>
              <div>• ETFdb.com (Alternative)</div>
              <div>• Morningstar (Fund flows)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowDynamicsInput;