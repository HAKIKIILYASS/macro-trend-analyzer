
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';

interface RegimeDetectionInputProps {
  vix: number;
  usd_jpy_trend: 'declining' | 'rising' | 'neutral';
  is_cb_week: boolean;
  onVixChange: (value: number) => void;
  onTrendChange: (value: 'declining' | 'rising' | 'neutral') => void;
  onCbWeekChange: (value: boolean) => void;
}

const RegimeDetectionInput: React.FC<RegimeDetectionInputProps> = ({
  vix,
  usd_jpy_trend,
  is_cb_week,
  onVixChange,
  onTrendChange,
  onCbWeekChange
}) => {
  const getRegimeStatus = () => {
    if (is_cb_week) return { text: 'CB Week', color: 'bg-purple-500', icon: '🏦' };
    if (vix > 25 && usd_jpy_trend === 'declining') return { text: 'Risk-Off', color: 'bg-red-500', icon: '📉' };
    if (vix < 20 && usd_jpy_trend === 'rising') return { text: 'Risk-On', color: 'bg-green-500', icon: '📈' };
    return { text: 'Transition', color: 'bg-yellow-500', icon: '⚖️' };
  };

  const regime = getRegimeStatus();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-200 bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🎯</span>
          Smart Regime Detection
          <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${regime.color} flex items-center gap-1`}>
            <span>{regime.icon}</span>
            {regime.text}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-purple-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Automatically adjusts factor weights based on current market regime: Risk-Off, Risk-On, Transition, or CB Week</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vix" className="text-base font-medium text-gray-700 mb-2 block">
              VIX Level
            </Label>
            <Input
              id="vix"
              type="number"
              value={vix}
              onChange={(e) => onVixChange(parseFloat(e.target.value) || 0)}
              min={5}
              max={80}
              step={0.1}
              className="text-base border-purple-300 focus:border-purple-500"
            />
            <div className="text-xs text-gray-600 mt-1">
              {vix > 25 ? '🔴 High Fear' : vix < 20 ? '🟢 Low Fear' : '🟡 Normal'}
            </div>
          </div>

          <div>
            <Label htmlFor="usd-jpy-trend" className="text-base font-medium text-gray-700 mb-2 block">
              USD/JPY Trend
            </Label>
            <Select value={usd_jpy_trend} onValueChange={onTrendChange}>
              <SelectTrigger className="border-purple-300 focus:border-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="declining">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Declining
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-yellow-500">—</span>
                    Neutral
                  </div>
                </SelectItem>
                <SelectItem value="rising">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Rising
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cb-week" className="text-base font-medium text-gray-700 mb-2 block">
              Central Bank Week
            </Label>
            <div className="flex items-center space-x-2 mt-3">
              <Switch
                id="cb-week"
                checked={is_cb_week}
                onCheckedChange={onCbWeekChange}
              />
              <span className="text-sm text-gray-600">
                {is_cb_week ? '🏦 CB Event Week' : '📅 Normal Week'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              3 days before/after major CB decisions
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-purple-400">
          <div className="text-sm font-medium text-gray-800 mb-1">Current Regime Impact:</div>
          <div className="text-xs text-gray-600">
            {regime.text === 'Risk-Off' && 'Rate Expectations: 35% • Risk Sentiment: 25% • Economic Momentum: 12%'}
            {regime.text === 'Risk-On' && 'Economic Momentum: 28% • Real Rate Edge: 30% • Rate Expectations: 22%'}
            {regime.text === 'CB Week' && 'Rate Expectations: 45% • Real Rate Edge: 25% • Economic Momentum: 15%'}
            {regime.text === 'Transition' && 'Normal weights: Rate 28% • Real Rate 25% • Momentum 22%'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegimeDetectionInput;
