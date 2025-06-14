
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
    <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-green-50 group">
      <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white relative overflow-hidden">
        <CardTitle className="flex items-center gap-3 text-xl font-bold relative z-10">
          <span className="text-2xl animate-pulse">🏦</span>
          Central Bank Policy
        </CardTitle>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="cb-hawkish" className="text-lg font-semibold text-gray-700 mb-3 block">
              Hawkish Index (0-1)
            </Label>
            <div className="mt-4">
              <Slider
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                max={1}
                min={0}
                step={0.01}
                className="mb-4 hover:scale-105 transition-transform duration-200"
              />
              <Input
                id="cb-hawkish"
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                min={0}
                max={1}
                step={0.01}
                className="mt-3 text-lg border-2 border-green-200 focus:border-green-400 transition-colors duration-200 hover:border-green-300"
              />
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg mt-4 border-l-4 border-green-400">
              <p className="text-sm text-gray-600 font-medium">
                <span className="text-red-500 font-bold">0 = Very Dovish</span> • 
                <span className="text-gray-500 font-bold mx-2">0.5 = Neutral</span> • 
                <span className="text-green-500 font-bold">1 = Very Hawkish</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CentralBankInput;
