
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { calculateMeanStd } from '@/utils/statistics';

interface LaborMarketInputProps {
  current_nfp: number;
  nfp_12m_values: number[];
  onCurrentChange: (value: number) => void;
  onValuesChange: (values: number[]) => void;
}

const LaborMarketInput: React.FC<LaborMarketInputProps> = ({
  current_nfp,
  nfp_12m_values,
  onCurrentChange,
  onValuesChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const addValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onValuesChange([...nfp_12m_values, value]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    onValuesChange(nfp_12m_values.filter((_, i) => i !== index));
  };

  const stats = calculateMeanStd(nfp_12m_values);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-200 bg-gradient-to-br from-white to-purple-50 transform hover:scale-105 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-lg transition-all duration-300 hover:from-purple-700 hover:to-violet-700">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl animate-bounce-subtle">👥</span>
          Labor Market
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-purple-200 hover:text-white transition-colors duration-300 hover:rotate-12" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600 animate-scale-in">
                <p>Non-Farm Payrolls measure employment changes. Higher values indicate job growth and economic strength.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="animate-slide-in-right delay-100">
            <Label htmlFor="current-nfp" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-purple-600">Current NFP (000s)</Label>
            <Input
              id="current-nfp"
              type="number"
              value={current_nfp}
              onChange={(e) => onCurrentChange(parseFloat(e.target.value) || 0)}
              className="text-base border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 hover:shadow-md"
            />
          </div>
          
          <div className="animate-slide-in-right delay-200">
            <Label className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-purple-600">Last 12 Months NFP Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter NFP value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                className="border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 hover:shadow-md"
              />
              <Button onClick={addValue} size="sm" className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {nfp_12m_values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100 bg-purple-100 text-purple-800 hover:bg-red-200 transition-all duration-300 transform hover:scale-110"
                  onClick={() => removeValue(index)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
            
            {stats && (
              <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border-l-4 border-purple-400 transform hover:translate-x-1 transition-transform duration-300">
                <div className="text-sm text-gray-700">
                  <div>Mean: <strong className="text-purple-700">{stats.mean.toFixed(1)}</strong></div>
                  <div>Std Dev: <strong className="text-purple-700">{stats.std.toFixed(1)}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaborMarketInput;
