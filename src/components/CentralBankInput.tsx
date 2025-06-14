
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface CentralBankInputProps {
  value: number;
  onChange: (value: number) => void;
}

const CentralBankInput: React.FC<CentralBankInputProps> = ({ value, onChange }) => {
  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardTitle className="flex items-center gap-2">
          🏦 Central Bank Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cb-hawkish">Hawkish Index (0-1)</Label>
            <div className="mt-2">
              <Slider
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                max={1}
                min={0}
                step={0.01}
                className="mb-2"
              />
              <Input
                id="cb-hawkish"
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                min={0}
                max={1}
                step={0.01}
                className="mt-2"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              0 = Very Dovish, 0.5 = Neutral, 1 = Very Hawkish
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CentralBankInput;
