
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
  guidance_shift: 'hawkish'  | 'neutral' | 'dovish';
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
    // Your exact probability thresholds
    if (rate_hike_probability > 75) return { score: '+2.0', color: 'text-green-600', label: 'Rate Hike Expected (>75%)' };
    if (rate_hike_probability >= 50) return { score: '+1.5', color: 'text-green-500', label: 'Likely Hike (50-75%)' };
    if (rate_hike_probability >= 25) return { score: '+1.0', color: 'text-green-400', label: 'Possible Hike (25-50%)' };
    if (rate_cut_probability >= 25 && rate_cut_probability < 50) return { score: '-1.0', color: 'text-orange-500', label: 'Possible Cut (25-50%)' };
    if (rate_cut_probability >= 50 && rate_cut_probability < 75) return { score: '-1.5', color: 'text-red-500', label: 'Likely Cut (50-75%)' };
    if (rate_cut_probability > 75) return { score: '-2.0', color: 'text-red-600', label: 'Cut Expected (>75%)' };
    return { score: '0.0', color: 'text-gray-600', label: 'No Change Expected' };
  };

  const probScore = getProbabilityScore();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-xl">🏦</span>
          Rate Policy (The Currency King-Maker)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-green-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Most important factor! Next Meeting Probability (70%) + Forward Guidance Shift (30%)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 mb-4">
            <div className="text-sm font-medium text-gray-800 mb-1">🎯 Simple Question:</div>
            <div className="text-sm text-gray-700">Which country's central bank will raise rates next?</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rate-hike-probability" className="text-base font-medium text-gray-700">
                Next Meeting: Rate Hike Probability (70% weight)
              </Label>
              <div className="flex gap-2">
                <a 
                  href="https://www.cmegroup.com/trading/interest-rates/countdown-to-fomc.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  USA: CME FedWatch <ExternalLink className="w-3 h-3" />
                </a>
              </div>
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
              Rate Cut Probability (if applicable)
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

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">📊 Your Current Score:</div>
            <div className={`text-xl font-bold ${probScore.color} mb-1`}>
              {probScore.score}
            </div>
            <div className="text-sm text-gray-600">{probScore.label}</div>
          </div>

          <div>
            <Label htmlFor="guidance-shift" className="text-base font-medium text-gray-700 mb-2 block">
              Forward Guidance: Are They Talking Tougher or Softer? (30% weight)
            </Label>
            <Select value={guidance_shift} onValueChange={onGuidanceChange}>
              <SelectTrigger className="border-green-300 focus:border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hawkish">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📈</span>
                    More Hawkish (+0.5) - "We may need to do more"
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">➖</span>
                    Same Tone (0.0) - Nothing new
                  </div>
                </SelectItem>
                <SelectItem value="dovish">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">📉</span>
                    More Dovish (-0.5) - "We're close to done"
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-400">
            <div className="text-sm font-medium text-gray-800 mb-2">📱 Your 5-Minute Weekly Update:</div>
            <div className="text-xs text-gray-700 space-y-2">
              <div><strong>USA:</strong> Google "CME FedWatch" (1 min)</div>
              <div><strong>Europe:</strong> Google "ECB rate expectations" (1 min)</div>
              <div><strong>UK:</strong> Google "Bank of England rate odds" (1 min)</div>
              <div><strong>Guidance:</strong> Scan for hawkish/dovish signals (2 min)</div>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1 p-3 bg-white rounded border">
            <div><strong>📈 Hawkish Phrases to Watch:</strong></div>
            <div>• "may accelerate" • "higher for longer" • "remains committed" • "vigilant"</div>
            <div><strong>📉 Dovish Phrases to Watch:</strong></div>
            <div>• "pause to assess" • "data dependent" • "gradual approach" • "nearing peak"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateExpectationsInput;
