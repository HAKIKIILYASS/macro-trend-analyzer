
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink } from 'lucide-react';

interface RateExpectationsInputProps {
  probability: number;
  path_adjustment: 'hawkish' | 'expected' | 'dovish';
  onProbabilityChange: (value: number) => void;
  onPathChange: (value: 'hawkish' | 'expected' | 'dovish') => void;
}

const RateExpectationsInput: React.FC<RateExpectationsInputProps> = ({
  probability,
  path_adjustment,
  onProbabilityChange,
  onPathChange
}) => {
  const getProbabilityScore = () => {
    if (probability > 70) return { score: '+2.0', color: 'text-green-600', label: 'Rate Hike Expected' };
    if (probability >= 50) return { score: '+1.0', color: 'text-green-500', label: 'Likely Hike' };
    if (probability >= 30) return { score: '0.0', color: 'text-gray-600', label: 'Neutral' };
    if (probability >= 10) return { score: '-1.0', color: 'text-orange-500', label: 'Likely Cut' };
    return { score: '-2.0', color: 'text-red-600', label: 'Cut Expected' };
  };

  const probScore = getProbabilityScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">💰</span>
          Rate Expectations (28%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-green-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>The Currency King-Maker. Uses CME FedWatch and ECB Watch data for probability-based scoring.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rate-probability" className="text-base font-medium text-gray-700">
                Next Meeting Hike Probability
              </Label>
              <a 
                href="https://www.cmegroup.com/trading/interest-rates/countdown-to-fomc.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                CME FedWatch <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="mt-3">
              <Slider
                value={[probability]}
                onValueChange={(values) => onProbabilityChange(values[0])}
                max={100}
                min={0}
                step={1}
                className="mb-4"
              />
              <div className="flex items-center gap-4">
                <Input
                  id="rate-probability"
                  type="number"
                  value={probability}
                  onChange={(e) => onProbabilityChange(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={1}
                  className="text-base border-green-300 focus:border-green-500 w-24"
                />
                <span className="text-sm text-gray-600">%</span>
                <div className={`font-medium ${probScore.color}`}>
                  Score: {probScore.score} ({probScore.label})
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <div>• {'>'}70%: Rate Hike Expected (+2.0)</div>
              <div>• 50-70%: Likely Hike (+1.0)</div>
              <div>• 30-50%: Neutral (0.0)</div>
              <div>• 10-30%: Likely Cut (-1.0)</div>
              <div>• {'<'}10%: Cut Expected (-2.0)</div>
            </div>
          </div>

          <div>
            <Label htmlFor="path-adjustment" className="text-base font-medium text-gray-700 mb-2 block">
              3-6M Policy Path vs Expected
            </Label>
            <Select value={path_adjustment} onValueChange={onPathChange}>
              <SelectTrigger className="border-green-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hawkish">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">🔺</span>
                    More Hawkish (+0.5)
                  </div>
                </SelectItem>
                <SelectItem value="expected">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">➖</span>
                    As Expected (0.0)
                  </div>
                </SelectItem>
                <SelectItem value="dovish">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🔻</span>
                    More Dovish (-0.5)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-green-400">
            <div className="text-xs font-medium text-gray-800 mb-2">📱 5-Minute Weekly Update:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• CME FedWatch (USD) - 1 minute</div>
              <div>• ECB policy tracker (EUR) - 1 minute</div>
              <div>• RBA/BoE headlines - 2 minutes</div>
              <div>• Update probability scores - 1 minute</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateExpectationsInput;
