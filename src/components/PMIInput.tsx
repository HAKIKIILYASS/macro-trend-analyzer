
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardTitle className="flex items-center gap-2">
          🏭 PMI Composite
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-pmi">Current PMI</Label>
            <Input
              id="current-pmi"
              type="number"
              value={pmi}
              onChange={(e) => onPmiChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
            <p className={`text-sm mt-1 font-medium ${pmiStatus.color}`}>
              {pmiStatus.status} ({pmi > 50 ? 'Above' : pmi < 50 ? 'Below' : 'At'} 50)
            </p>
          </div>
          
          <div>
            <Label>3-Year PMI Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter PMI value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
              />
              <Button onClick={addValue} size="sm">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {pmi_3y_values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeValue(index)}
                >
                  {value} ×
                </Badge>
              ))}
            </div>
            
            {stats && (
              <div className="mt-2 p-2 bg-indigo-50 rounded text-sm">
                <div>Mean: <strong>{stats.mean.toFixed(1)}</strong></div>
                <div>Std Dev: <strong>{stats.std.toFixed(1)}</strong></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PMIInput;
