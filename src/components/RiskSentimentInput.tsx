
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
    if (vix >= 15) return { level: 'Normal', color: 'text-slate-600' };
    if (vix >= 10) return { level: 'Low Fear', color: 'text-green-600' };
    return { level: 'Extreme Greed', color: 'text-green-700' };
  };

  const vixInfo = getVixLevel(vix);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200">
      <CardHeader className="bg-slate-700 text-white">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">⚠️</span>
          Risk Sentiment
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-slate-300 hover:text-white" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Measures market risk appetite through credit spreads and volatility. Higher values indicate risk aversion, while lower values suggest risk-on sentiment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="credit-spread" className="text-base font-medium text-slate-700 mb-2 block">Credit Spread 1M Change (%)</Label>
            <Input
              id="credit-spread"
              type="number"
              value={credit_spread_1m_change}
              onChange={(e) => onCreditChange(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="text-base border-slate-300 focus:border-slate-500"
            />
            <p className="text-sm text-slate-500 mt-1">
              Positive = Widening spreads (risk off)
            </p>
          </div>
          
          <div>
            <Label htmlFor="vix" className="text-base font-medium text-slate-700 mb-2 block">VIX Level</Label>
            <Input
              id="vix"
              type="number"
              value={vix}
              onChange={(e) => onVixChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-slate-300 focus:border-slate-500"
            />
            <p className={`text-sm mt-1 font-medium ${vixInfo.color}`}>
              {vixInfo.level}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSentimentInput;
