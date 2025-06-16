
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink } from 'lucide-react';

interface RealRateEdgeInputProps {
  us_2y_yield: number;
  target_2y_yield: number;
  us_cpi: number;
  target_cpi: number;
  onUsYieldChange: (value: number) => void;
  onTargetYieldChange: (value: number) => void;
  onUsCpiChange: (value: number) => void;
  onTargetCpiChange: (value: number) => void;
}

const RealRateEdgeInput: React.FC<RealRateEdgeInputProps> = ({
  us_2y_yield,
  target_2y_yield,
  us_cpi,
  target_cpi,
  onUsYieldChange,
  onTargetYieldChange,
  onUsCpiChange,
  onTargetCpiChange
}) => {
  const usRealRate = us_2y_yield - us_cpi;
  const targetRealRate = target_2y_yield - target_cpi;
  const differential = usRealRate - targetRealRate;
  const score = Math.max(-3.0, Math.min(3.0, differential * 1.5));

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-200 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏛️</span>
          Real Rate Edge (25%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-blue-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Where Money Actually Flows. Compares real interest rates (nominal yield - inflation) between currencies.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              🇺🇸 US Data
              <a 
                href="https://finance.yahoo.com/quote/%5ETNX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <div>
              <Label htmlFor="us-2y" className="text-sm font-medium text-gray-700">
                2Y Treasury Yield (%)
              </Label>
              <Input
                id="us-2y"
                type="number"
                value={us_2y_yield}
                onChange={(e) => onUsYieldChange(parseFloat(e.target.value) || 0)}
                min={0}
                max={10}
                step={0.01}
                className="text-base border-blue-300 focus:border-blue-500 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="us-cpi" className="text-sm font-medium text-gray-700">
                US CPI (%)
              </Label>
              <Input
                id="us-cpi"
                type="number"
                value={us_cpi}
                onChange={(e) => onUsCpiChange(parseFloat(e.target.value) || 0)}
                min={-2}
                max={15}
                step={0.1}
                className="text-base border-blue-300 focus:border-blue-500 mt-1"
              />
            </div>
            <div className="p-2 bg-blue-50 rounded border">
              <div className="text-xs text-gray-600">US Real Rate:</div>
              <div className="text-lg font-bold text-blue-600">
                {usRealRate.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">🎯 Target Currency Data</h4>
            <div>
              <Label htmlFor="target-2y" className="text-sm font-medium text-gray-700">
                2Y Government Yield (%)
              </Label>
              <Input
                id="target-2y"
                type="number"
                value={target_2y_yield}
                onChange={(e) => onTargetYieldChange(parseFloat(e.target.value) || 0)}
                min={-1}
                max={10}
                step={0.01}
                className="text-base border-blue-300 focus:border-blue-500 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="target-cpi" className="text-sm font-medium text-gray-700">
                Target CPI (%)
              </Label>
              <Input
                id="target-cpi"
                type="number"
                value={target_cpi}
                onChange={(e) => onTargetCpiChange(parseFloat(e.target.value) || 0)}
                min={-2}
                max={15}
                step={0.1}
                className="text-base border-blue-300 focus:border-blue-500 mt-1"
              />
            </div>
            <div className="p-2 bg-green-50 rounded border">
              <div className="text-xs text-gray-600">Target Real Rate:</div>
              <div className="text-lg font-bold text-green-600">
                {targetRealRate.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800">Real Rate Differential:</span>
            <span className={`text-xl font-bold ${differential > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {differential > 0 ? '+' : ''}{differential.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Score (×1.5 multiplier):</span>
            <span className={`text-lg font-bold ${score > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {score > 0 ? '+' : ''}{score.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-400">
          <div className="text-xs font-medium text-gray-800 mb-1">💡 Pro Tip:</div>
          <div className="text-xs text-gray-600">
            CPI release days: Impact is multiplied by 1.5x as markets overreact to surprises
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealRateEdgeInput;
