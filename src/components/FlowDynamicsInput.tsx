
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink } from 'lucide-react';

interface FlowDynamicsInputProps {
  etf_flows: 'major_inflows' | 'normal' | 'major_outflows';
  uup_flow: number;
  fxe_flow: number;
  fxb_flow: number;
  fxa_flow: number;
  fxc_flow: number;
  onFlowsChange: (value: 'major_inflows' | 'normal' | 'major_outflows') => void;
  onUupFlowChange: (value: number) => void;
  onFxeFlowChange: (value: number) => void;
  onFxbFlowChange: (value: number) => void;
  onFxaFlowChange: (value: number) => void;
  onFxcFlowChange: (value: number) => void;
}

const FlowDynamicsInput: React.FC<FlowDynamicsInputProps> = ({
  etf_flows,
  uup_flow,
  fxe_flow,
  fxb_flow,
  fxa_flow,
  fxc_flow,
  onFlowsChange,
  onUupFlowChange,
  onFxeFlowChange,
  onFxbFlowChange,
  onFxaFlowChange,
  onFxcFlowChange
}) => {
  const getFlowScore = (flow: number, threshold: number) => {
    if (flow > threshold) return { score: 0.5, label: 'Bullish flows', color: 'text-green-600' };
    if (flow < -threshold) return { score: -0.5, label: 'Bearish flows', color: 'text-red-600' };
    return { score: 0.0, label: 'Normal activity', color: 'text-gray-600' };
  };

  const uupInfo = getFlowScore(uup_flow, 500);
  const fxeInfo = getFlowScore(fxe_flow, 200);
  const fxbInfo = getFlowScore(fxb_flow, 100);
  const fxaInfo = getFlowScore(fxa_flow, 100);
  const fxcInfo = getFlowScore(fxc_flow, 50);

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
        <div className="space-y-6">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 mb-4">
            <div className="text-sm font-medium text-gray-800 mb-1">💡 Simple Question:</div>
            <div className="text-sm text-gray-700">Are big investors buying or selling currency ETFs this month?</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="uup-flow" className="text-sm font-medium text-gray-700">
                  UUP (USD ETF) Flow
                </Label>
                <div className={`text-xs font-medium ${uupInfo.color}`}>
                  {uupInfo.score > 0 ? '+' : ''}{uupInfo.score.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="uup-flow"
                  type="number"
                  value={uup_flow}
                  onChange={(e) => onUupFlowChange(parseFloat(e.target.value) || 0)}
                  min={-2000}
                  max={2000}
                  step={10}
                  className="text-sm border-teal-300 focus:border-teal-500"
                />
                <span className="text-xs text-gray-600">$M</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Threshold: ±$500M ({uupInfo.label})
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="fxe-flow" className="text-sm font-medium text-gray-700">
                  FXE (EUR ETF) Flow
                </Label>
                <div className={`text-xs font-medium ${fxeInfo.color}`}>
                  {fxeInfo.score > 0 ? '+' : ''}{fxeInfo.score.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="fxe-flow"
                  type="number"
                  value={fxe_flow}
                  onChange={(e) => onFxeFlowChange(parseFloat(e.target.value) || 0)}
                  min={-1000}
                  max={1000}
                  step={10}
                  className="text-sm border-teal-300 focus:border-teal-500"
                />
                <span className="text-xs text-gray-600">$M</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Threshold: ±$200M ({fxeInfo.label})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="fxb-flow" className="text-sm font-medium text-gray-700">
                  FXB (GBP ETF)
                </Label>
                <div className={`text-xs font-medium ${fxbInfo.color}`}>
                  {fxbInfo.score > 0 ? '+' : ''}{fxbInfo.score.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="fxb-flow"
                  type="number"
                  value={fxb_flow}
                  onChange={(e) => onFxbFlowChange(parseFloat(e.target.value) || 0)}
                  min={-500}
                  max={500}
                  step={5}
                  className="text-sm border-teal-300 focus:border-teal-500"
                />
                <span className="text-xs text-gray-600">$M</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">±$100M</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="fxa-flow" className="text-sm font-medium text-gray-700">
                  FXA (AUD ETF)
                </Label>
                <div className={`text-xs font-medium ${fxaInfo.color}`}>
                  {fxaInfo.score > 0 ? '+' : ''}{fxaInfo.score.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="fxa-flow"
                  type="number"
                  value={fxa_flow}
                  onChange={(e) => onFxaFlowChange(parseFloat(e.target.value) || 0)}
                  min={-500}
                  max={500}
                  step={5}
                  className="text-sm border-teal-300 focus:border-teal-500"
                />
                <span className="text-xs text-gray-600">$M</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">±$100M</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="fxc-flow" className="text-sm font-medium text-gray-700">
                  FXC (CAD ETF)
                </Label>
                <div className={`text-xs font-medium ${fxcInfo.color}`}>
                  {fxcInfo.score > 0 ? '+' : ''}{fxcInfo.score.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="fxc-flow"
                  type="number"
                  value={fxc_flow}
                  onChange={(e) => onFxcFlowChange(parseFloat(e.target.value) || 0)}
                  min={-200}
                  max={200}
                  step={5}
                  className="text-sm border-teal-300 focus:border-teal-500"
                />
                <span className="text-xs text-gray-600">$M</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">±$50M</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="etf-flows" className="text-base font-medium text-gray-700">
                Overall Flow Assessment
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
                    Major Inflows (Bullish +0.5)
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">⚪</span>
                    Normal Activity (0.0)
                  </div>
                </SelectItem>
                <SelectItem value="major_outflows">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">🔴</span>
                    Major Outflows (Bearish -0.5)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border-l-4 border-teal-400">
            <div className="text-xs font-medium text-gray-800 mb-2">📊 Scoring System:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• <strong>UUP (USD):</strong> {'>'}$500M = +0.5, {'<'}-$500M = -0.5</div>
              <div>• <strong>FXE (EUR):</strong> {'>'}$200M = +0.5, {'<'}-$200M = -0.5</div>
              <div>• <strong>FXB/FXA:</strong> {'>'}$100M = +0.5, {'<'}-$100M = -0.5</div>
              <div>• <strong>FXC (CAD):</strong> {'>'}$50M = +0.5, {'<'}-$50M = -0.5</div>
              <div>• <strong>Normal range:</strong> 0.0 (Neutral positioning)</div>
            </div>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
            <div className="text-sm font-medium text-gray-800 mb-2">📱 Monthly Data Sources:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>• ETF.com (Flow data)</div>
              <div>• ETFdb.com (Alternative)</div>
              <div>• Yahoo Finance (ETF pages)</div>
              <div>• Morningstar (Fund flows)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowDynamicsInput;
