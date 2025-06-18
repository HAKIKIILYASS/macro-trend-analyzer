
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface RegimeDetectionInputProps {
  vix: number;
  gold_vs_stocks_monthly: number;
  sp500_new_highs: boolean;
  is_cb_week: boolean;
  onVixChange: (value: number) => void;
  onGoldStocksChange: (value: number) => void;
  onSp500HighsChange: (value: boolean) => void;
  onCbWeekChange: (value: boolean) => void;
}

const RegimeDetectionInput: React.FC<RegimeDetectionInputProps> = ({
  vix,
  gold_vs_stocks_monthly,
  sp500_new_highs,
  is_cb_week,
  onVixChange,
  onGoldStocksChange,
  onSp500HighsChange,
  onCbWeekChange
}) => {
  const getRegimeStatus = () => {
    if (is_cb_week) return { text: 'CB Week', color: 'bg-purple-500', icon: '🏦' };
    if (vix > 25 || gold_vs_stocks_monthly > 0) return { text: 'Risk-Off', color: 'bg-red-500', icon: '📉' };
    if (vix < 18 && sp500_new_highs) return { text: 'Risk-On', color: 'bg-green-500', icon: '📈' };
    return { text: 'Neutral', color: 'bg-yellow-500', icon: '⚖️' };
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
                <p>Automatically adjusts factor weights based on current market regime: Risk-Off, Risk-On, Neutral, or CB Week</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {vix > 25 ? '🔴 High Fear' : vix < 18 ? '🟢 Low Fear' : '🟡 Normal'}
            </div>
          </div>

          <div>
            <Label htmlFor="gold-stocks" className="text-base font-medium text-gray-700 mb-2 block">
              Gold vs S&P Monthly %
            </Label>
            <Input
              id="gold-stocks"
              type="number"
              value={gold_vs_stocks_monthly}
              onChange={(e) => onGoldStocksChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-purple-300 focus:border-purple-500"
            />
            <div className="text-xs text-gray-600 mt-1">
              {gold_vs_stocks_monthly > 0 ? '🟡 Gold Leading' : '🟢 Stocks Leading'}
            </div>
          </div>

          <div>
            <Label htmlFor="sp500-highs" className="text-base font-medium text-gray-700 mb-2 block">
              S&P500 New Highs
            </Label>
            <div className="flex items-center space-x-2 mt-3">
              <Switch
                id="sp500-highs"
                checked={sp500_new_highs}
                onCheckedChange={onSp500HighsChange}
              />
              <span className="text-sm text-gray-600">
                {sp500_new_highs ? '📈 Making New Highs' : '📊 Below Highs'}
              </span>
            </div>
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
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-l-4 border-purple-400">
          <div className="text-sm font-medium text-gray-800 mb-1">Current Regime Impact:</div>
          <div className="text-xs text-gray-600">
            {regime.text === 'Risk-Off' && 'Rate Policy: 40% • Real Interest: 30% • Risk Appetite: 25%'}
            {regime.text === 'Risk-On' && 'Growth Momentum: 35% • Real Interest: 25% • Rate Policy: 25%'}
            {regime.text === 'CB Week' && 'Rate Policy: 50% • Growth Momentum: 20% • Real Interest: 20%'}
            {regime.text === 'Neutral' && 'Normal weights: Rate Policy 30% • Growth 25% • Real Interest 25%'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegimeDetectionInput;
