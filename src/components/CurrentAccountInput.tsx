
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { calculateMeanStd } from '@/utils/statistics';

interface CurrentAccountInputProps {
  ca_gdp: number;
  ca_5y_values: number[];
  onCurrentChange: (value: number) => void;
  onValuesChange: (values: number[]) => void;
}

const CurrentAccountInput: React.FC<CurrentAccountInputProps> = ({
  ca_gdp,
  ca_5y_values,
  onCurrentChange,
  onValuesChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const addValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onValuesChange([...ca_5y_values, value]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    onValuesChange(ca_5y_values.filter((_, i) => i !== index));
  };

  const stats = calculateMeanStd(ca_5y_values);

  const getCAStatus = (ca: number) => {
    if (ca > 0) return { status: 'Surplus', color: 'text-green-600' };
    if (ca < 0) return { status: 'Deficit', color: 'text-red-600' };
    return { status: 'Balanced', color: 'text-gray-600' };
  };

  const caStatus = getCAStatus(ca_gdp);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-cyan-200 bg-gradient-to-br from-white to-cyan-50">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">💰</span>
          Current Account
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-cyan-200 hover:text-white transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Current Account measures a country's trade balance and financial flows. Positive values indicate surplus, negative indicate deficit.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ca-gdp" className="text-base font-medium text-gray-700 mb-2 block">Current Account (% of GDP)</Label>
            <Input
              id="ca-gdp"
              type="number"
              value={ca_gdp}
              onChange={(e) => onCurrentChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
            <p className={`text-sm mt-1 font-medium ${caStatus.color}`}>
              {caStatus.status}
            </p>
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block">5-Year CA Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter CA value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                className="border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              />
              <Button onClick={addValue} size="sm" className="bg-cyan-600 hover:bg-cyan-700">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {ca_5y_values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100 bg-cyan-100 text-cyan-800 hover:bg-red-200"
                  onClick={() => removeValue(index)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
            
            {stats && (
              <div className="mt-2 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-l-4 border-cyan-400">
                <div className="text-sm text-gray-700">
                  <div>Mean: <strong className="text-cyan-700">{stats.mean.toFixed(1)}</strong></div>
                  <div>Std Dev: <strong className="text-cyan-700">{stats.std.toFixed(1)}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentAccountInput;
