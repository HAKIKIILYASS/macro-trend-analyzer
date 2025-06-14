
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
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200">
      <CardHeader className="bg-slate-700 text-white">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏦</span>
          Central Bank Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cb-hawkish" className="text-base font-medium text-slate-700 mb-2 block">
              Hawkish Index (0-1)
            </Label>
            <div className="mt-3">
              <Slider
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                max={1}
                min={0}
                step={0.01}
                className="mb-4"
              />
              <Input
                id="cb-hawkish"
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                min={0}
                max={1}
                step={0.01}
                className="text-base border-slate-300 focus:border-slate-500"
              />
            </div>
            <div className="bg-slate-100 p-3 rounded-lg mt-3 border-l-4 border-slate-400">
              <p className="text-sm text-slate-600">
                <span className="text-red-600 font-medium">0 = Very Dovish</span> • 
                <span className="text-slate-600 font-medium mx-2">0.5 = Neutral</span> • 
                <span className="text-green-600 font-medium">1 = Very Hawkish</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CentralBankInput;
