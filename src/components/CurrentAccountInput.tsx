
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <CardTitle className="flex items-center gap-2">
          💰 Current Account
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ca-gdp">Current Account (% of GDP)</Label>
            <Input
              id="ca-gdp"
              type="number"
              value={ca_gdp}
              onChange={(e) => onCurrentChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
            <p className={`text-sm mt-1 font-medium ${caStatus.color}`}>
              {caStatus.status}
            </p>
          </div>
          
          <div>
            <Label>5-Year CA Historical Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter CA value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
              />
              <Button onClick={addValue} size="sm">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {ca_5y_values.map((value, index) => (
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
              <div className="mt-2 p-2 bg-teal-50 rounded text-sm">
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

export default CurrentAccountInput;
