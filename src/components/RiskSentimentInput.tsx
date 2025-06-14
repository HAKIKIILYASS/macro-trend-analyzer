
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface RiskSentimentInputProps {
  credit_spread_1m_change: number;
  vix: number;
  onCreditChange: (value: number) => void;
  onVixChange: (value: number) => void;
}

const RiskSentimentInput: React.FC<RiskSentimentInputProps> = ({
  credit_spread_1m_change,
  vix,
  onCreditChange,
  onVixChange,
}) => {
  const getVixLevel = (vix: number) => {
    if (vix >= 35) return { level: 'Extreme Fear', color: 'text-red-600' };
    if (vix >= 25) return { level: 'High Fear', color: 'text-orange-600' };
    if (vix >= 15) return { level: 'Normal', color: 'text-gray-600' };
    if (vix >= 10) return { level: 'Low Fear', color: 'text-green-600' };
    return { level: 'Extreme Greed', color: 'text-green-700' };
  };

  const vixInfo = getVixLevel(vix);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-500 border border-orange-200 bg-gradient-to-br from-white to-orange-50 transform hover:scale-105 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg transition-all duration-300 hover:from-orange-700 hover:to-red-700">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl animate-bounce-subtle">⚠️</span>
          Risk Sentiment
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-orange-200 hover:text-white transition-colors duration-300 hover:rotate-12" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600 animate-scale-in">
                <p>Measures market risk appetite through credit spreads and volatility. Higher values indicate risk aversion, while lower values suggest risk-on sentiment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="animate-slide-in-right delay-100">
            <Label htmlFor="credit-spread" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-orange-600">Credit Spread 1M Change (%)</Label>
            <Input
              id="credit-spread"
              type="number"
              value={credit_spread_1m_change}
              onChange={(e) => onCreditChange(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="text-base border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 hover:shadow-md"
            />
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg mt-3 border-l-4 border-orange-400 transform hover:translate-x-1 transition-transform duration-300">
              <p className="text-sm text-gray-700">
                <span className="text-red-600 font-medium">Positive = Widening spreads (risk off)</span>
              </p>
            </div>
          </div>
          
          <div className="animate-slide-in-right delay-200">
            <Label htmlFor="vix" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-orange-600">VIX Level</Label>
            <Input
              id="vix"
              type="number"
              value={vix}
              onChange={(e) => onVixChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 hover:shadow-md"
            />
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg mt-3 border-l-4 border-orange-400 transform hover:translate-x-1 transition-transform duration-300">
              <p className={`text-sm mt-1 font-medium ${vixInfo.color}`}>
                {vixInfo.level}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSentimentInput;
