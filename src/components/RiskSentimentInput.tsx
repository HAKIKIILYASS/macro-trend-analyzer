
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface RiskSentimentInputProps {
  vix: number;
  gold_sp500_ratio_trend: 'rising' | 'stable' | 'falling';
  gold_sp500_weekly_performance: number;
  onVixChange: (value: number) => void;
  onGoldRatioChange: (value: 'rising' | 'stable' | 'falling') => void;
  onGoldWeeklyChange: (value: number) => void;
}

const RiskSentimentInput: React.FC<RiskSentimentInputProps> = ({
  vix,
  gold_sp500_ratio_trend,
  gold_sp500_weekly_performance,
  onVixChange,
  onGoldRatioChange,
  onGoldWeeklyChange,
}) => {
  const getVixLevel = (vixValue: number) => {
    if (vixValue >= 30) return { level: 'Extreme Fear', color: 'text-red-600' };
    if (vixValue >= 25) return { level: 'High Fear', color: 'text-orange-600' };
    if (vixValue >= 20) return { level: 'Normal', color: 'text-gray-600' };
    if (vixValue >= 15) return { level: 'Low Fear', color: 'text-green-600' };
    return { level: 'Extreme Greed', color: 'text-green-700' };
  };

  const getGoldPerformanceScore = (performance: number) => {
    if (performance > 2) return { score: -0.5, label: 'Gold outperforming (Risk-off)', color: 'text-red-600' };
    if (performance < -2) return { score: +0.5, label: 'S&P outperforming (Risk-on)', color: 'text-green-600' };
    return { score: 0.0, label: 'About even (Neutral)', color: 'text-gray-600' };
  };

  const vixInfo = getVixLevel(vix);
  const goldInfo = getGoldPerformanceScore(gold_sp500_weekly_performance);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-red-200 bg-gradient-to-br from-white to-red-50">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">⚠️</span>
          Risk Appetite (15%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-red-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>The Market's Mood Ring. Fear Index (70% weight) + Safe Haven Flow (30% weight)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="vix-level" className="text-base font-medium text-gray-700 mb-2 block">
              VIX Level (70% weight)
            </Label>
            <div className="flex items-center gap-4 mb-2">
              <Input
                id="vix-level"
                type="number"
                value={vix}
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
              <div>• 15-20: Low fear (+0.5)</div>
              <div>• 20-25: Normal (0.0)</div>
              <div>• 25-30: High fear (-1.0)</div>
              <div>• {'>'}30: Extreme fear (-1.5)</div>
            </div>
          </div>

          <div>
            <Label htmlFor="gold-weekly-performance" className="text-base font-medium text-gray-700 mb-2 block">
              Gold vs S&P500 Weekly Performance (30% weight)
            </Label>
            <div className="flex items-center gap-4 mb-2">
              <Input
                id="gold-weekly-performance"
                type="number"
                value={gold_sp500_weekly_performance}
                onChange={(e) => onGoldWeeklyChange(parseFloat(e.target.value) || 0)}
                min={-20}
                max={20}
                step={0.1}
                className="text-base border-red-300 focus:border-red-500 w-24"
              />
              <span className="text-sm text-gray-600">%</span>
              <div className={`font-medium ${goldInfo.color}`}>
                Score: {goldInfo.score > 0 ? '+' : ''}{goldInfo.score.toFixed(1)}
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              {goldInfo.label}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Gold outperforming {'>'}+2%: Risk-off (-0.5)</div>
              <div>• About even ±2%: Neutral (0.0)</div>
              <div>• S&P outperforming {'<'}-2%: Risk-on (+0.5)</div>
            </div>
          </div>

          <div>
            <Label htmlFor="gold-ratio-trend" className="text-base font-medium text-gray-700 mb-2 block">
              Gold/S&P500 Ratio Trend (Alternative Input)
            </Label>
            <Select value={gold_sp500_ratio_trend} onValueChange={onGoldRatioChange}>
              <SelectTrigger className="border-red-300 focus:border-red-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rising">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">📈</span>
                    Rising (Risk-off -0.5)
                  </div>
                </SelectItem>
                <SelectItem value="stable">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">➖</span>
                    Stable (Neutral 0.0)
                  </div>
                </SelectItem>
                <SelectItem value="falling">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📉</span>
                    Falling (Risk-on +0.5)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border-l-4 border-red-400">
            <div className="text-xs font-medium text-gray-800 mb-1">📱 30-Second Daily Check:</div>
            <div className="text-xs text-gray-600">
              Yahoo Finance: VIX level + compare GLD vs SPY weekly performance trend
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSentimentInput;
