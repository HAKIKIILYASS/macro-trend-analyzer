
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp } from 'lucide-react';

export type CurrencyPair = 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'AUD/USD' | 'USD/CAD' | 'USD/CHF';

interface CurrencyPairSelectorProps {
  selectedPair: CurrencyPair;
  onPairChange: (pair: CurrencyPair) => void;
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  selectedPair,
  onPairChange,
}) => {
  const currencyPairs: { value: CurrencyPair; label: string; tier: string; description: string }[] = [
    { value: 'EUR/USD', label: 'EUR/USD', tier: 'Tier 1', description: 'Most liquid, best for macro analysis' },
    { value: 'GBP/USD', label: 'GBP/USD', tier: 'Tier 1', description: 'High volatility, clear economic data' },
    { value: 'USD/JPY', label: 'USD/JPY', tier: 'Tier 1', description: 'Perfect for risk-on/risk-off trades' },
    { value: 'AUD/USD', label: 'AUD/USD', tier: 'Tier 1', description: 'Pure risk appetite play' },
    { value: 'USD/CAD', label: 'USD/CAD', tier: 'Tier 2', description: 'Oil correlation provides additional edge' },
    { value: 'USD/CHF', label: 'USD/CHF', tier: 'Tier 2', description: 'Safe haven alternative to JPY' },
  ];

  const selectedPairInfo = currencyPairs.find(pair => pair.value === selectedPair);

  return (
    <Card className="shadow-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-100 mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <TrendingUp className="text-2xl" />
          Currency Pair Selection
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={18} className="text-blue-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-gray-800 text-white border-gray-600">
                <p>Select the currency pair you want to analyze. The model will calculate separate scores for both currencies and determine the relative bias.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-base font-semibold text-gray-800 mb-3 block">
              Choose Currency Pair to Analyze
            </label>
            <Select value={selectedPair} onValueChange={onPairChange}>
              <SelectTrigger className="text-lg border-2 border-blue-300 focus:border-blue-500 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyPairs.map((pair) => (
                  <SelectItem key={pair.value} value={pair.value}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-base">{pair.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pair.tier === 'Tier 1' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pair.tier}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPairInfo && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-blue-700">{selectedPairInfo.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedPairInfo.tier === 'Tier 1' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedPairInfo.tier}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{selectedPairInfo.description}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-sm font-semibold text-gray-800 mb-2">📈 How It Works:</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Calculate separate macro scores for both currencies</div>
              <div>• Determine relative strength: {selectedPair.split('/')[0]} Score - {selectedPair.split('/')[1]} Score</div>
              <div>• Generate trading bias based on the differential</div>
              <div>• Show only relevant data inputs for this currency pair</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyPairSelector;
