
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <CardTitle className="flex items-center gap-2">
          👥 Labor Market
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-nfp">Current NFP (000s)</Label>
            <Input
              id="current-nfp"
              type="number"
              value={current_nfp}
              onChange={(e) => onCurrentChange(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Last 12 Months NFP Values</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter NFP value"
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
              />
              <Button onClick={addValue} size="sm">Add</Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {nfp_12m_values.map((value, index) => (
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
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
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

export default LaborMarketInput;
