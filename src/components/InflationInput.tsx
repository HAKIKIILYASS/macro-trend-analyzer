
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
    <Card className="shadow-lg hover:shadow-xl transition-all duration-500 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 transform hover:scale-105 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg transition-all duration-300 hover:from-emerald-700 hover:to-green-700">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl animate-bounce">📈</span>
          Inflation Trend
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-emerald-200 hover:text-white transition-colors duration-300 hover:rotate-12" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600 animate-scale-in">
                <p>Consumer Price Index measures the rate of inflation. Compare current CPI with the target to assess inflationary pressures and potential policy responses.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="animate-slide-in-right delay-100">
            <Label htmlFor="cpi" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-emerald-600">Current CPI (%)</Label>
            <Input
              id="cpi"
              type="number"
              value={cpi}
              onChange={(e) => onCpiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 hover:shadow-md"
            />
          </div>
          
          <div className="animate-slide-in-right delay-200">
            <Label htmlFor="cpi-target" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-emerald-600">CPI Target (%)</Label>
            <Input
              id="cpi-target"
              type="number"
              value={cpi_target}
              onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 hover:shadow-md"
            />
          </div>
          
          <div className="animate-slide-in-right delay-300">
            <Label htmlFor="cpi-3m" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-emerald-600">3-Month CPI Change (%)</Label>
            <Input
              id="cpi-3m"
              type="number"
              value={cpi_3m_change}
              onChange={(e) => onChange3M(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="text-base border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 hover:shadow-md"
            />
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg mt-3 border-l-4 border-emerald-400 transform hover:translate-x-1 transition-transform duration-300">
              <p className="text-sm text-gray-700">
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
