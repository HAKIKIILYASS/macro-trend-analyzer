
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface RiskSentimentInputProps {
  vix_level: number;
  gold_vs_stocks_weekly: number;
  onVixChange: (value: number) => void;
  onGoldStocksChange: (value: number) => void;
}

const RiskSentimentInput: React.FC<RiskSentimentInputProps> = ({
  vix_level,
  gold_vs_stocks_weekly,
  onVixChange,
  onGoldStocksChange,
}) => {
  const getVixLevel = (vix: number) => {
    if (vix >= 30) return { level: 'Extreme Fear', color: 'text-red-600' };
    if (vix >= 25) return { level: 'High Fear', color: 'text-orange-600' };
    if (vix >= 20) return { level: 'Normal', color: 'text-gray-600' };
    if (vix >= 15) return { level: 'Low Fear', color: 'text-green-600' };
    return { level: 'Extreme Greed', color: 'text-green-700' };
  };

  const vixInfo = getVixLevel(vix_level);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-red-200 bg-gradient-to-br from-white to-red-50">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">⚠️</span>
          Risk Sentiment (15%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-red-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>The Market's Mood Ring. VIX Level (60% weight) + Gold vs Stocks Safe Haven Flow (40% weight)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="vix-level" className="text-base font-medium text-gray-700 mb-2 block">
              VIX Level (60% weight)
            </Label>
            <div className="flex items-center gap-4 mb-2">
              <Input
                id="vix-level"
                type="number"
                value={vix_level}
                onChange={(e) => onVixChange(parseFloat(e.target.value) || 0)}
                min={10}
                max={80}
                step={0.1}
                className="text-base border-red-300 focus:border-red-500 w-24"
              />
              <div className={`font-medium ${vixInfo.color}`}>
                {vixInfo.level}
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• {'<'}15: Extreme greed (+1.5)</div>
              <div>• 15-20: Low fear (+1.0)</div>
              <div>• 20-25: Normal (0.0)</div>
              <div>• 25-30: High fear (-1.0)</div>
              <div>• {'>'}30: Extreme fear (-1.5)</div>
            </div>
          </div>

          <div>
            <Label htmlFor="gold-stocks" className="text-base font-medium text-gray-700 mb-2 block">
              Gold vs Stocks Weekly (40% weight)
            </Label>
            <div className="flex items-center gap-4 mb-2">
              <Input
                id="gold-stocks"
                type="number"
                value={gold_vs_stocks_weekly}
                onChange={(e) => onGoldStocksChange(parseFloat(e.target.value) || 0)}
                step={0.1}
                className="text-base border-red-300 focus:border-red-500 w-24"
              />
              <span className="text-sm text-gray-600">% performance diff</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Gold outperforms: Risk-off (-1.0)</div>
              <div>• Similar performance: Neutral (0.0)</div>
              <div>• Stocks outperform: Risk-on (+1.0)</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border-l-4 border-red-400">
            <div className="text-xs font-medium text-gray-800 mb-1">📱 30-Second Daily Check:</div>
            <div className="text-xs text-gray-600">
              Yahoo Finance: VIX level + compare GLD vs SPY weekly performance
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSentimentInput;
