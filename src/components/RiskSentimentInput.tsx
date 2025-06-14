
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RiskSentimentInputProps {
  credit_spread_1m_change: number;
  vix: number;
  onCreditChange: (value: number) => void;
  onVixChange: (value: number) => void;
}

const RiskSentimentInput: React.FC<RiskSentimentInputProps> = ({
  credit_spread_1m_change,
  vix,
  onCreditChange,
  onVixChange,
}) => {
  const getVixLevel = (vix: number) => {
    if (vix >= 35) return { level: 'Extreme Fear', color: 'text-red-600' };
    if (vix >= 25) return { level: 'High Fear', color: 'text-orange-600' };
    if (vix >= 15) return { level: 'Normal', color: 'text-gray-600' };
    if (vix >= 10) return { level: 'Low Fear', color: 'text-green-600' };
    return { level: 'Extreme Greed', color: 'text-green-700' };
  };

  const vixInfo = getVixLevel(vix);

  return (
    <Card className="h-full">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="flex items-center gap-2">
          ⚠️ Risk Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="credit-spread">Credit Spread 1M Change (%)</Label>
            <Input
              id="credit-spread"
              type="number"
              value={credit_spread_1m_change}
              onChange={(e) => onCreditChange(parseFloat(e.target.value) || 0)}
              step={0.01}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Positive = Widening spreads (risk off)
            </p>
          </div>
          
          <div>
            <Label htmlFor="vix">VIX Level</Label>
            <Input
              id="vix"
              type="number"
              value={vix}
              onChange={(e) => onVixChange(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="mt-1"
            />
            <p className={`text-sm mt-1 font-medium ${vixInfo.color}`}>
              {vixInfo.level}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSentimentInput;
