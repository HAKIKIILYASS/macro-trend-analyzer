
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { calculateMeanStd } from '@/utils/statistics';

interface PMIInputProps {
  pmi: number;
  pmi_3y_values: number[];
  onPmiChange: (value: number) => void;
  onValuesChange: (values: number[]) => void;
}

const PMIInput: React.FC<PMIInputProps> = ({
  pmi,
  pmi_3y_values,
  onPmiChange,
  onValuesChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const addValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onValuesChange([...pmi_3y_values, value]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    onValuesChange(pmi_3y_values.filter((_, i) => i !== index));
  };

  const stats = calculateMeanStd(pmi_3y_values);

  const getPmiStatus = (pmi: number) => {
    if (pmi > 50) return { status: 'Expansion', color: 'text-green-600' };
    if (pmi < 50) return { status: 'Contraction', color: 'text-red-600' };
    return { status: 'Neutral', color: 'text-gray-600' };
  };

  const pmiStatus = getPmiStatus(pmi);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-200 bg-gradient-to-br from-white to-teal-50">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏭</span>
          PMI Composite
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-teal-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Purchasing Managers' Index measures manufacturing activity. Values above 50 indicate expansion, below 50 indicate contraction.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-pmi" className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-teal-600">Current PMI</Label>
            <Input
              id="current-pmi"
              type="number"
              value={pmi}
              onChange={(e) => onPmiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="text-base border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
            />
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg mt-3 border-l-4 border-teal-400 shadow-sm">
              <p className={`text-sm mt-1 font-medium ${pmiStatus.color}`}>
                {pmiStatus.status} ({pmi > 50 ? 'Above' : pmi < 50 ? 'Below' : 'At'} 50)
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block transition-colors duration-200 hover:text-teal-600">3-Year PMI Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter PMI value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                className="border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
              />
              <Button onClick={addValue} size="sm" className="bg-teal-600 hover:bg-teal-700 transition-colors duration-200">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {pmi_3y_values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer bg-teal-100 text-teal-800 hover:bg-red-200 transition-colors duration-200"
                  onClick={() => removeValue(index)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
            
            {stats && (
              <div className="mt-2 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border-l-4 border-teal-400 shadow-sm">
                <div className="text-sm text-gray-700">
                  <div>Mean: <strong className="text-teal-700">{stats.mean.toFixed(1)}</strong></div>
                  <div>Std Dev: <strong className="text-teal-700">{stats.std.toFixed(1)}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PMIInput;
