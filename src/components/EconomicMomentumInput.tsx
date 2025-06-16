
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface EconomicMomentumInputProps {
  employment_score: number;
  pmi: number;
  consumer_strength: number;
  onEmploymentChange: (value: number) => void;
  onPmiChange: (value: number) => void;
  onConsumerChange: (value: number) => void;
}

const EconomicMomentumInput: React.FC<EconomicMomentumInputProps> = ({
  employment_score,
  pmi,
  consumer_strength,
  onEmploymentChange,
  onPmiChange,
  onConsumerChange
}) => {
  const getPmiScore = () => {
    if (pmi > 55) return { score: 1.5, label: 'Strong expansion', color: 'text-green-600' };
    if (pmi >= 52) return { score: 1.0, label: 'Solid growth', color: 'text-green-500' };
    if (pmi >= 48) return { score: 0.0, label: 'Neutral', color: 'text-gray-600' };
    if (pmi >= 45) return { score: -1.0, label: 'Contraction', color: 'text-orange-500' };
    return { score: -1.5, label: 'Deep trouble', color: 'text-red-600' };
  };

  const pmiScore = getPmiScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-200 bg-gradient-to-br from-white to-orange-50">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">📈</span>
          Economic Momentum (22%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-orange-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>The Growth Story. Triple-component system: Employment (50%), Manufacturing PMI (30%), Consumer Strength (20%)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="employment" className="text-base font-medium text-gray-700">
                Employment Strength (50% weight)
              </Label>
              <span className="text-sm text-gray-500">Score: -2 to +2</span>
            </div>
            <div className="mt-3">
              <Slider
                value={[employment_score]}
                onValueChange={(values) => onEmploymentChange(values[0])}
                max={2}
                min={-2}
                step={0.1}
                className="mb-4"
              />
              <div className="flex items-center gap-4">
                <Input
                  id="employment"
                  type="number"
                  value={employment_score}
                  onChange={(e) => onEmploymentChange(parseFloat(e.target.value) || 0)}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="text-base border-orange-300 focus:border-orange-500 w-24"
                />
                <div className="text-xs text-gray-600">
                  <div>+2: Exceptional (NFP >200K)</div>
                  <div>0: Average • -2: Poor</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="pmi" className="text-base font-medium text-gray-700 mb-2 block">
              Manufacturing PMI (30% weight)
            </Label>
            <div className="flex items-center gap-4 mb-2">
              <Input
                id="pmi"
                type="number"
                value={pmi}
                onChange={(e) => onPmiChange(parseFloat(e.target.value) || 0)}
                min={30}
                max={70}
                step={0.1}
                className="text-base border-orange-300 focus:border-orange-500 w-24"
              />
              <div className={`font-medium ${pmiScore.color}`}>
                Score: {pmiScore.score.toFixed(1)} ({pmiScore.label})
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• >55: Strong expansion (+1.5)</div>
              <div>• 52-55: Solid growth (+1.0)</div>
              <div>• 48-52: Neutral (0.0)</div>
              <div>• 45-48: Contraction (-1.0)</div>
              <div>• <45: Deep trouble (-1.5)</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="consumer" className="text-base font-medium text-gray-700">
                Consumer Strength (20% weight)
              </Label>
              <span className="text-sm text-gray-500">Score: -2 to +2</span>
            </div>
            <div className="mt-3">
              <Slider
                value={[consumer_strength]}
                onValueChange={(values) => onConsumerChange(values[0])}
                max={2}
                min={-2}
                step={0.1}
                className="mb-4"
              />
              <div className="flex items-center gap-4">
                <Input
                  id="consumer"
                  type="number"
                  value={consumer_strength}
                  onChange={(e) => onConsumerChange(parseFloat(e.target.value) || 0)}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="text-base border-orange-300 focus:border-orange-500 w-24"
                />
                <div className="text-xs text-gray-600">
                  <div>Retail Sales + Consumer Confidence</div>
                  <div>+ Credit Growth trends</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border-l-4 border-orange-400">
            <div className="text-xs font-medium text-gray-800 mb-1">📱 Data Efficiency Hack:</div>
            <div className="text-xs text-gray-600">
              Use Trading Economics app push notifications for major releases - 2-minute scan focusing on surprises vs expectations
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicMomentumInput;
