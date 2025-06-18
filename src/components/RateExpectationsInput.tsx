
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink } from 'lucide-react';

interface RateExpectationsInputProps {
  rate_hike_probability: number;
  rate_cut_probability: number;
  guidance_shift: 'hawkish' | 'neutral' | 'dovish';
  onHikeProbabilityChange: (value: number) => void;
  onCutProbabilityChange: (value: number) => void;
  onGuidanceChange: (value: 'hawkish' | 'neutral' | 'dovish') => void;
}

const RateExpectationsInput: React.FC<RateExpectationsInputProps> = ({
  rate_hike_probability,
  rate_cut_probability,
  guidance_shift,
  onHikeProbabilityChange,
  onCutProbabilityChange,
  onGuidanceChange
}) => {
  const getProbabilityScore = () => {
    if (rate_hike_probability > 75) return { score: '+2.0', color: 'text-green-600', label: 'Rate Hike Expected' };
    if (rate_hike_probability >= 50) return { score: '+1.5', color: 'text-green-500', label: 'Likely Hike 50-75%' };
    if (rate_hike_probability >= 25) return { score: '+1.0', color: 'text-green-400', label: 'Possible Hike 25-50%' };
    if (rate_cut_probability >= 25 && rate_cut_probability < 50) return { score: '-1.0', color: 'text-orange-500', label: 'Possible Cut 25-50%' };
    if (rate_cut_probability >= 50 && rate_cut_probability < 75) return { score: '-1.5', color: 'text-red-500', label: 'Likely Cut 50-75%' };
    if (rate_cut_probability > 75) return { score: '-2.0', color: 'text-red-600', label: 'Cut Expected' };
    return { score: '0.0', color: 'text-gray-600', label: 'No Change Expected' };
  };

  const probScore = getProbabilityScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏦</span>
          Rate Policy (30%)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-green-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>The Currency King-Maker. Next Meeting Probability (70%) + Forward Guidance Shift (30%)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rate-hike-probability" className="text-base font-medium text-gray-700">
                Rate Hike Probability (70% weight)
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
                value={[rate_hike_probability]}
                onValueChange={(values) => onHikeProbabilityChange(values[0])}
                max={100}
                min={0}
                step={1}
                className="mb-4"
              />
              <div className="flex items-center gap-4">
                <Input
                  id="rate-hike-probability"
                  type="number"
                  value={rate_hike_probability}
                  onChange={(e) => onHikeProbabilityChange(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={1}
                  className="text-base border-green-300 focus:border-green-500 w-24"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="rate-cut-probability" className="text-base font-medium text-gray-700 mb-2 block">
              Rate Cut Probability
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="rate-cut-probability"
                type="number"
                value={rate_cut_probability}
                onChange={(e) => onCutProbabilityChange(parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                step={1}
                className="text-base border-green-300 focus:border-green-500 w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-1">Current Score:</div>
            <div className={`text-lg font-bold ${probScore.color}`}>
              {probScore.score} - {probScore.label}
            </div>
          </div>

          <div>
            <Label htmlFor="guidance-shift" className="text-base font-medium text-gray-700 mb-2 block">
              Forward Guidance Shift (30% weight)
            </Label>
            <Select value={guidance_shift} onValueChange={onGuidanceChange}>
              <SelectTrigger className="border-green-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hawkish">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📈</span>
                    More Hawkish Signals (+0.5)
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">➖</span>
                    Same Tone (0.0)
                  </div>
                </SelectItem>
                <SelectItem value="dovish">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">📉</span>
                    More Dovish Signals (-0.5)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Probability Scoring:</strong></div>
            <div>• Rate Hike {'>'}75%: +2.0</div>
            <div>• Rate Hike 50-75%: +1.5</div>
            <div>• Rate Hike 25-50%: +1.0</div>
            <div>• No Change ~50%: 0.0</div>
            <div>• Rate Cut 25-50%: -1.0</div>
            <div>• Rate Cut 50-75%: -1.5</div>
            <div>• Rate Cut {'>'}75%: -2.0</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-green-400">
            <div className="text-xs font-medium text-gray-800 mb-2">📱 5-Minute Weekly Update:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• CME FedWatch (USD) - 1 minute</div>
              <div>• ECB Watch tool (EUR) - 1 minute</div>
              <div>• Scan for guidance changes - 2 minutes</div>
              <div>• Update probability scores - 1 minute</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateExpectationsInput;
