
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { calculateMeanStd } from '@/utils/statistics';

interface GeopoliticalInputProps {
  gpr: number;
  gpr_3y_values: number[];
  onGprChange: (value: number) => void;
  onValuesChange: (values: number[]) => void;
}

const GeopoliticalInput: React.FC<GeopoliticalInputProps> = ({
  gpr,
  gpr_3y_values,
  onGprChange,
  onValuesChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const addValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onValuesChange([...gpr_3y_values, value]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    onValuesChange(gpr_3y_values.filter((_, i) => i !== index));
  };

  const stats = calculateMeanStd(gpr_3y_values);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-rose-200 bg-gradient-to-br from-white to-rose-50">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🌍</span>
          Geopolitical Risk
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-rose-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Geopolitical Risk Index measures global political tensions and conflicts. Higher values indicate greater geopolitical instability.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="gpr" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-rose-600">Current GPR Index</Label>
            <Input
              id="gpr"
              type="number"
              value={gpr}
              onChange={(e) => onGprChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all duration-200"
            />
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg mt-3 border-l-4 border-rose-400 shadow-sm">
              <p className="text-sm text-gray-700">
                <span className="text-rose-600 font-medium">Higher values indicate greater geopolitical risk</span>
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-rose-600">3-Year GPR Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter GPR value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                className="border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all duration-200"
              />
              <Button onClick={addValue} size="sm" className="bg-rose-600 hover:bg-rose-700 transition-colors duration-200">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {gpr_3y_values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer bg-rose-100 text-rose-800 hover:bg-red-200 transition-colors duration-200"
                  onClick={() => removeValue(index)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
            
            {stats && (
              <div className="mt-2 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border-l-4 border-rose-400 shadow-sm">
                <div className="text-sm text-gray-700">
                  <div>Mean: <strong className="text-rose-700">{stats.mean.toFixed(1)}</strong></div>
                  <div>Std Dev: <strong className="text-rose-700">{stats.std.toFixed(1)}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeopoliticalInput;
