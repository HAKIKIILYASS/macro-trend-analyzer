
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <CardTitle className="flex items-center gap-2">
          🌍 Geopolitical Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="gpr">Current GPR Index</Label>
            <Input
              id="gpr"
              type="number"
              value={gpr}
              onChange={(e) => onGprChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Higher values indicate greater geopolitical risk
            </p>
          </div>
          
          <div>
            <Label>3-Year GPR Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter GPR value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
              />
              <Button onClick={addValue} size="sm">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {gpr_3y_values.map((value, index) => (
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
              <div className="mt-2 p-2 bg-red-50 rounded text-sm">
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

export default GeopoliticalInput;
