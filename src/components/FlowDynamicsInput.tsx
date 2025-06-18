
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Info, ExternalLink } from 'lucide-react';

interface FlowDynamicsInputProps {
  etf_flows: 'major_inflows' | 'normal' | 'major_outflows';
  onFlowsChange: (value: 'major_inflows' | 'normal' | 'major_outflows') => void;
}

const FlowDynamicsInput: React.FC<FlowDynamicsInputProps> = ({
  etf_flows,
  onFlowsChange
}) => {
  const getFlowScore = () => {
    switch (etf_flows) {
      case 'major_inflows': return { score: 0.5, label: 'Bullish flows', color: 'text-green-600' };
      case 'major_outflows': return { score: -0.5, label: 'Bearish flows', color: 'text-red-600' };
      default: return { score: 0.0, label: 'Normal activity', color: 'text-gray-600' };
    }
  };

  const flowInfo = getFlowScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-200 bg-gradient-to-br from-white to-teal-50">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">💸</span>
          Money Flow (5%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-teal-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Follow the Smart Money. Tracks monthly ETF flows to identify institutional positioning changes.</p>
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
                Currency ETF Flows
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
                    Major Inflows ({'>'}$500M monthly)
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">⚪</span>
                    Normal Activity
                  </div>
                </SelectItem>
                <SelectItem value="major_outflows">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">🔴</span>
                    Major Outflows ({'>'}$500M monthly)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2">
              <div className={`text-lg font-bold ${flowInfo.color}`}>
                Score: {flowInfo.score > 0 ? '+' : ''}{flowInfo.score.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">
                {flowInfo.label}
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
            <div className="text-sm font-medium text-gray-800 mb-2">Key ETFs to Monitor:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>• UUP (US Dollar ETF)</div>
              <div>• FXE (Euro ETF)</div>
              <div>• FXB (British Pound)</div>
              <div>• FXA (Australian Dollar)</div>
              <div>• FXC (Canadian Dollar)</div>
              <div>• FXY (Japanese Yen)</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400">
            <div className="text-xs font-medium text-gray-800 mb-1">Scoring System:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Major inflows: +0.5 (Bullish for currency)</div>
              <div>• Normal activity: 0.0 (Neutral)</div>
              <div>• Major outflows: -0.5 (Bearish for currency)</div>
              <div>• Monthly data is most reliable</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowDynamicsInput;
