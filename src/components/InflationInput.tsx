
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InflationInputProps {
  cpi: number;
  cpi_target: number;
  cpi_3m_change: number;
  onCpiChange: (value: number) => void;
  onTargetChange: (value: number) => void;
  onChange3M: (value: number) => void;
}

const InflationInput: React.FC<InflationInputProps> = ({
  cpi,
  cpi_target,
  cpi_3m_change,
  onCpiChange,
  onTargetChange,
  onChange3M,
}) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200">
      <CardHeader className="bg-slate-700 text-white">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">📈</span>
          Inflation Trend
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-slate-300 hover:text-white" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Consumer Price Index measures the rate of inflation. Compare current CPI with the target to assess inflationary pressures and potential policy responses.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cpi" className="text-base font-medium text-slate-700 mb-2 block">Current CPI (%)</Label>
            <Input
              id="cpi"
              type="number"
              value={cpi}
              onChange={(e) => onCpiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-slate-300 focus:border-slate-500"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-target" className="text-base font-medium text-slate-700 mb-2 block">CPI Target (%)</Label>
            <Input
              id="cpi-target"
              type="number"
              value={cpi_target}
              onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-slate-300 focus:border-slate-500"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-3m" className="text-base font-medium text-slate-700 mb-2 block">3-Month CPI Change (%)</Label>
            <Input
              id="cpi-3m"
              type="number"
              value={cpi_3m_change}
              onChange={(e) => onChange3M(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="text-base border-slate-300 focus:border-slate-500"
            />
            <div className="bg-slate-100 p-3 rounded-lg mt-3 border-l-4 border-slate-400">
              <p className="text-sm text-slate-600">
                <span className="text-green-600 font-medium">Positive = Rising</span> • 
                <span className="text-red-600 font-medium">Negative = Falling</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InflationInput;
