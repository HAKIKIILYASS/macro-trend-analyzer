
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ExternalLink, TrendingUp } from 'lucide-react';
import { CurrencyPair } from './CurrencyPairSelector';

interface CurrencyRateData {
  rate_hike_probability: number;
  rate_cut_probability: number;
  guidance_shift: 'hawkish' | 'neutral' | 'dovish';
}

interface DualCurrencyRateInputProps {
  selectedPair: CurrencyPair;
  baseCurrencyData: CurrencyRateData;
  quoteCurrencyData: CurrencyRateData;
  onBaseCurrencyChange: (field: keyof CurrencyRateData, value: any) => void;
  onQuoteCurrencyChange: (field: keyof CurrencyRateData, value: any) => void;
}

const DualCurrencyRateInput: React.FC<DualCurrencyRateInputProps> = ({
  selectedPair,
  baseCurrencyData,
  quoteCurrencyData,
  onBaseCurrencyChange,
  onQuoteCurrencyChange
}) => {
  const [base, quote] = selectedPair.split('/');

  const getCentralBankInfo = (currency: string) => {
    const bankInfo = {
      USD: { 
        bank: 'Federal Reserve', 
        dataSource: 'CME FedWatch',
        url: 'https://www.cmegroup.com/trading/interest-rates/countdown-to-fomc.html',
        currentRange: '5.00-5.50%'
      },
      EUR: { 
        bank: 'European Central Bank', 
        dataSource: 'ECB Watch (Reuters)',
        url: 'https://www.reuters.com/markets/europe/ecb-rate-expectations/',
        currentRange: '3.75-4.50%'
      },
      GBP: { 
        bank: 'Bank of England', 
        dataSource: 'BoE Rate Monitor',
        url: 'https://www.bankofengland.co.uk/monetary-policy',
        currentRange: '5.00-5.50%'
      },
      JPY: { 
        bank: 'Bank of Japan', 
        dataSource: 'BoJ Watch',
        url: 'https://www.boj.or.jp/en/mopo/',
        currentRange: '-0.10-0.50%'
      },
      AUD: { 
        bank: 'Reserve Bank of Australia', 
        dataSource: 'RBA Watch',
        url: 'https://www.rba.gov.au/monetary-policy/',
        currentRange: '4.00-4.75%'
      },
      CAD: { 
        bank: 'Bank of Canada', 
        dataSource: 'BoC Watch',
        url: 'https://www.bankofcanada.ca/core-functions/monetary-policy/',
        currentRange: '4.50-5.25%'
      },
      CHF: { 
        bank: 'Swiss National Bank', 
        dataSource: 'SNB Watch',
        url: 'https://www.snb.ch/en/ifor/public/mtopo/id/monetary_policy',
        currentRange: '1.50-2.25%'
      }
    };
    return bankInfo[currency as keyof typeof bankInfo] || bankInfo.USD;
  };

  const getProbabilityScore = (data: CurrencyRateData) => {
    if (data.rate_hike_probability > 75) return { score: '+2.0', color: 'text-green-600', label: 'Rate Hike Expected (>75%)' };
    if (data.rate_hike_probability >= 50) return { score: '+1.5', color: 'text-green-500', label: 'Likely Hike (50-75%)' };
    if (data.rate_hike_probability >= 25) return { score: '+1.0', color: 'text-green-400', label: 'Possible Hike (25-50%)' };
    if (data.rate_cut_probability >= 25 && data.rate_cut_probability < 50) return { score: '-1.0', color: 'text-orange-500', label: 'Possible Cut (25-50%)' };
    if (data.rate_cut_probability >= 50 && data.rate_cut_probability < 75) return { score: '-1.5', color: 'text-red-500', label: 'Likely Cut (50-75%)' };
    if (data.rate_cut_probability > 75) return { score: '-2.0', color: 'text-red-600', label: 'Cut Expected (>75%)' };
    return { score: '0.0', color: 'text-gray-600', label: 'No Change Expected' };
  };

  const baseBankInfo = getCentralBankInfo(base);
  const quoteBankInfo = getCentralBankInfo(quote);
  const baseScore = getProbabilityScore(baseCurrencyData);
  const quoteScore = getProbabilityScore(quoteCurrencyData);

  const CurrencyRateCard = ({ 
    currency, 
    bankInfo, 
    data, 
    score, 
    onChange 
  }: { 
    currency: string; 
    bankInfo: any; 
    data: CurrencyRateData; 
    score: any; 
    onChange: (field: keyof CurrencyRateData, value: any) => void;
  }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-2xl font-bold">{currency}</span>
          <span className="text-sm">{bankInfo.bank}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} className="text-green-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-600">
                <p>Rate policy expectations for {currency}. Current range: {bankInfo.currentRange}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 mb-4">
            <div className="text-sm font-medium text-gray-800 mb-1">📊 Current Range: {bankInfo.currentRange}</div>
            <a 
              href={bankInfo.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {bankInfo.dataSource} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block">
              Next Meeting: Rate Hike Probability (70% weight)
            </Label>
            <div className="mt-3">
              <Slider
                value={[data.rate_hike_probability]}
                onValueChange={(values) => onChange('rate_hike_probability', values[0])}
                max={100}
                min={0}
                step={1}
                className="mb-4"
              />
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={data.rate_hike_probability}
                  onChange={(e) => onChange('rate_hike_probability', parseFloat(e.target.value) || 0)}
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
            <Label className="text-base font-medium text-gray-700 mb-2 block">
              Rate Cut Probability (if applicable)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={data.rate_cut_probability}
                onChange={(e) => onChange('rate_cut_probability', parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                step={1}
                className="text-base border-green-300 focus:border-green-500 w-24"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">📊 {currency} Score:</div>
            <div className={`text-xl font-bold ${score.color} mb-1`}>
              {score.score}
            </div>
            <div className="text-sm text-gray-600">{score.label}</div>
          </div>

          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block">
              Forward Guidance: Tone Shift (30% weight)
            </Label>
            <Select value={data.guidance_shift} onValueChange={(value) => onChange('guidance_shift', value)}>
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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-lg border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-100 mb-8">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <TrendingUp className="text-2xl" />
          Rate Policy Analysis: {selectedPair}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info size={18} className="text-green-200 hover:text-white transition-colors duration-200" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-gray-800 text-white border-gray-600">
                <p>Compare central bank rate expectations between both currencies. This is the most important factor (30% weight) in currency valuation.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyRateCard 
            currency={base}
            bankInfo={baseBankInfo}
            data={baseCurrencyData}
            score={baseScore}
            onChange={onBaseCurrencyChange}
          />
          <CurrencyRateCard 
            currency={quote}
            bankInfo={quoteBankInfo}
            data={quoteCurrencyData}
            score={quoteScore}
            onChange={onQuoteCurrencyChange}
          />
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-semibold text-gray-800 mb-2">🎯 Rate Policy Differential Analysis:</div>
          <div className="text-sm text-gray-700 space-y-1">
            <div>• {base} Expected Score: <span className={baseScore.color + ' font-semibold'}>{baseScore.score}</span></div>
            <div>• {quote} Expected Score: <span className={quoteScore.color + ' font-semibold'}>{quoteScore.score}</span></div>
            <div>• <strong>Rate Advantage:</strong> {parseFloat(baseScore.score) > parseFloat(quoteScore.score) ? `${base} favored` : parseFloat(baseScore.score) < parseFloat(quoteScore.score) ? `${quote} favored` : 'Neutral'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DualCurrencyRateInput;
