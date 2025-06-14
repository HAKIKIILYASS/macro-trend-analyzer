
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface CentralBankInputProps {
  value: number;
  onChange: (value: number) => void;
}

const CentralBankInput: React.FC<CentralBankInputProps> = ({ value, onChange }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-200 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏦</span>
          Central Bank Policy
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-blue-200 hover:text-white transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Measures the central bank's monetary policy stance. Higher values indicate more hawkish (restrictive) policy, while lower values suggest dovish (accommodative) policy.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cb-hawkish" className="text-base font-medium text-gray-700 mb-2 block">
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
                className="text-base border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mt-3 border-l-4 border-blue-400">
              <p className="text-sm text-gray-700">
                <span className="text-red-600 font-medium">0 = Very Dovish</span> • 
                <span className="text-gray-600 font-medium mx-2">0.5 = Neutral</span> • 
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
