
import React from 'react';
import DualCurrencyRateInput from './DualCurrencyRateInput';
import { CurrencyPair } from './CurrencyPairSelector';

interface CurrencyRateData {
  rate_hike_probability: number;
  rate_cut_probability: number;
  guidance_shift: 'hawkish' | 'neutral' | 'dovish';
}

interface RateExpectationsInputProps {
  selectedPair: CurrencyPair;
  baseCurrencyData: CurrencyRateData;
  quoteCurrencyData: CurrencyRateData;
  onBaseCurrencyChange: (field: keyof CurrencyRateData, value: any) => void;
  onQuoteCurrencyChange: (field: keyof CurrencyRateData, value: any) => void;
}

const RateExpectationsInput: React.FC<RateExpectationsInputProps> = (props) => {
  return <DualCurrencyRateInput {...props} />;
};

export default RateExpectationsInput;
