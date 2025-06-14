
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 group">
      <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-xl font-bold relative z-10">
          <span className="text-2xl animate-bounce">📈</span>
          Inflation Trend
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="cpi" className="text-lg font-semibold text-gray-700 mb-2 block">Current CPI (%)</Label>
            <Input
              id="cpi"
              type="number"
              value={cpi}
              onChange={(e) => onCpiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-lg border-2 border-orange-200 focus:border-orange-400 transition-colors duration-200 hover:border-orange-300"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-target" className="text-lg font-semibold text-gray-700 mb-2 block">CPI Target (%)</Label>
            <Input
              id="cpi-target"
              type="number"
              value={cpi_target}
              onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-lg border-2 border-orange-200 focus:border-orange-400 transition-colors duration-200 hover:border-orange-300"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-3m" className="text-lg font-semibold text-gray-700 mb-2 block">3-Month CPI Change (%)</Label>
            <Input
              id="cpi-3m"
              type="number"
              value={cpi_3m_change}
              onChange={(e) => onChange3M(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="text-lg border-2 border-orange-200 focus:border-orange-400 transition-colors duration-200 hover:border-orange-300"
            />
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg mt-3 border-l-4 border-orange-400">
              <p className="text-sm text-gray-600 font-medium">
                <span className="text-green-500 font-bold">Positive = Rising</span> • 
                <span className="text-red-500 font-bold">Negative = Falling</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InflationInput;
