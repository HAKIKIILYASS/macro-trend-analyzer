
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
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="flex items-center gap-2">
          📈 Inflation Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cpi">Current CPI (%)</Label>
            <Input
              id="cpi"
              type="number"
              value={cpi}
              onChange={(e) => onCpiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-target">CPI Target (%)</Label>
            <Input
              id="cpi-target"
              type="number"
              value={cpi_target}
              onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="cpi-3m">3-Month CPI Change (%)</Label>
            <Input
              id="cpi-3m"
              type="number"
              value={cpi_3m_change}
              onChange={(e) => onChange3M(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Positive = Rising, Negative = Falling
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InflationInput;
