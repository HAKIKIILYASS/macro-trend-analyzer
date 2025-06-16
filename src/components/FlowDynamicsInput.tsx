
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink } from 'lucide-react';

interface FlowDynamicsInputProps {
  currency_etf_flows: number;
  onFlowsChange: (value: number) => void;
}

const FlowDynamicsInput: React.FC<FlowDynamicsInputProps> = ({
  currency_etf_flows,
  onFlowsChange
}) => {
  const getFlowScore = () => {
    const score = Math.max(-1.5, Math.min(1.5, (currency_etf_flows / 100) * 0.5));
    return score;
  };

  const score = getFlowScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-200 bg-gradient-to-br from-white to-teal-50">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">💸</span>
          Flow Dynamics (10%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-teal-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Follow the Smart Money. Tracks weekly ETF flows to identify institutional positioning changes.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="etf-flows" className="text-base font-medium text-gray-700">
                Weekly Currency ETF Flows
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
            <div className="flex items-center gap-4">
              <Input
                id="etf-flows"
                type="number"
                value={currency_etf_flows}
                onChange={(e) => onFlowsChange(parseFloat(e.target.value) || 0)}
                min={-1000}
                max={1000}
                step={10}
                className="text-base border-teal-300 focus:border-teal-500"
              />
              <span className="text-sm text-gray-600">million USD</span>
            </div>
            <div className="mt-2">
              <div className={`text-lg font-bold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                Score: {score > 0 ? '+' : ''}{score.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">
                {currency_etf_flows > 0 ? '🟢 Inflows (Bullish)' : currency_etf_flows < 0 ? '🔴 Outflows (Bearish)' : '⚪ No Flow'}
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
            <div className="text-sm font-medium text-gray-800 mb-2">Key ETFs to Monitor:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>• FXE (Euro ETF)</div>
              <div>• FXB (British Pound)</div>
              <div>• FXA (Australian Dollar)</div>
              <div>• FXC (Canadian Dollar)</div>
              <div>• UUP (US Dollar ETF)</div>
              <div>• FXY (Japanese Yen)</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400">
            <div className="text-xs font-medium text-gray-800 mb-1">Scoring System:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• +0.5 per $100M inflow (capped at +1.5)</div>
              <div>• -0.5 per $100M outflow (capped at -1.5)</div>
              <div>• Weekly data is most reliable</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowDynamicsInput;
