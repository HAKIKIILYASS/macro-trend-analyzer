
import { CurrencyData } from '@/pages/Index';

export const calculateCurrencyScore = (data: CurrencyData) => {
  // Determine market regime and adjust weights accordingly
  const regime = determineMarketRegime(data);
  const weights = getRegimeWeights(regime);
  
  // Calculate individual currency scores
  const baseCurrencyScore = calculateIndividualCurrencyScore(data, 'base');
  const quoteCurrencyScore = calculateIndividualCurrencyScore(data, 'quote');
  
  // Calculate differential score (base - quote)
  const differentialScore = baseCurrencyScore - quoteCurrencyScore;
  
  // Determine trading bias using the differential
  const { bias, biasColor, positionSize, riskPerTrade } = getTradingBias(differentialScore);
  
  return {
    regime,
    baseCurrencyScore: Number(baseCurrencyScore.toFixed(2)),
    quoteCurrencyScore: Number(quoteCurrencyScore.toFixed(2)),
    scores: {
      rate_policy: Number((calculateRatePolicyScore(data, 'base') - calculateRatePolicyScore(data, 'quote')).toFixed(2)),
      growth_momentum: Number((calculateGrowthMomentumScore(data, 'base') - calculateGrowthMomentumScore(data, 'quote')).toFixed(2)),
      real_interest_edge: Number(calculateRealInterestScore(data).toFixed(2)),
      risk_appetite: Number(calculateRiskAppetiteScore(data).toFixed(2)),
      money_flow: Number(calculateMoneyFlowScore(data).toFixed(2)),
    },
    weights: {
      rate: weights.rate,
      realRate: weights.realRate,
      momentum: weights.momentum,
      risk: weights.risk,
      flow: weights.flow
    },
    total_score: Number(differentialScore.toFixed(2)),
    bias,
    biasColor,
    positionSize,
    riskPerTrade,
    tradingRecommendation: generateTradingRecommendation(differentialScore, bias, regime)
  };
};

const calculateIndividualCurrencyScore = (data: CurrencyData, currency: 'base' | 'quote'): number => {
  const regime = determineMarketRegime(data);
  const weights = getRegimeWeights(regime);
  
  // Factor 1: Rate Policy (30% base weight)
  const ratePolicyScore = calculateRatePolicyScore(data, currency);
  
  // Factor 2: Growth Momentum (25% base weight)
  const growthMomentumScore = calculateGrowthMomentumScore(data, currency);
  
  // Factor 3: Real Interest Edge (25% base weight) - calculated as differential
  const realInterestScore = currency === 'base' ? calculateRealInterestScore(data) / 2 : -calculateRealInterestScore(data) / 2;
  
  // Factor 4: Risk Appetite (15% base weight) - shared, adjusted by currency type
  const riskAppetiteScore = calculateRiskAppetiteScore(data) * getCurrencyRiskMultiplier(data.selectedPair, currency);
  
  // Factor 5: Money Flow (5% base weight) - pair-specific
  const moneyFlowScore = calculateMoneyFlowScore(data) * (currency === 'base' ? 1 : -1);
  
  // Apply regime-based weights
  const totalScore = (
    ratePolicyScore * weights.rate +
    growthMomentumScore * weights.momentum +
    realInterestScore * weights.realRate +
    riskAppetiteScore * weights.risk +
    moneyFlowScore * weights.flow
  );
  
  return totalScore;
};

const getCurrencyRiskMultiplier = (pair: string, currency: 'base' | 'quote'): number => {
  const riskOnCurrencies = ['AUD', 'NZD', 'CAD'];
  const safeHavenCurrencies = ['USD', 'JPY', 'CHF'];
  
  const [base, quote] = pair.split('/');
  const targetCurrency = currency === 'base' ? base : quote;
  
  if (riskOnCurrencies.includes(targetCurrency)) return 1.0; // Full risk appetite impact
  if (safeHavenCurrencies.includes(targetCurrency)) return -1.0; // Inverse risk appetite impact
  return 0.5; // Partial impact for neutral currencies like EUR, GBP
};

const determineMarketRegime = (data: CurrencyData): string => {
  // Central Bank Week takes priority
  if (data.is_cb_week) return 'CB Week';
  
  // Risk-Off: VIX > 25 OR Gold outperforms S&P500 this month
  if (data.vix > 25 || data.gold_vs_stocks_monthly > 0) {
    return 'Risk-Off';
  } 
  // Risk-On: VIX < 18 AND S&P500 making new highs
  else if (data.vix < 18 && data.sp500_new_highs) {
    return 'Risk-On';
  } 
  // Neutral: Everything else
  else {
    return 'Neutral';
  }
};

const getRegimeWeights = (regime: string) => {
  switch (regime) {
    case 'Risk-Off':
      return {
        rate: 0.40,      // 40% - More important in scared times
        momentum: 0.15,  // 15% - Less important when people are scared
        realRate: 0.30,  // 30% - Safety premium matters more
        risk: 0.25,      // 25% - Much more important
        flow: 0.05       // 5% - Constant
      };
    case 'Risk-On':
      return {
        rate: 0.25,      // 25% - Less important when growth matters
        momentum: 0.35,  // 35% - More important in happy times
        realRate: 0.25,  // 25% - Standard
        risk: 0.10,      // 10% - Less important when people are greedy
        flow: 0.05       // 5% - Constant
      };
    case 'CB Week':
      return {
        rate: 0.50,      // 50% - Dominates during central bank week
        momentum: 0.20,  // 20% - Still matters but less
        realRate: 0.20,  // 20% - Still matters but less
        risk: 0.05,      // 5% - Much less important
        flow: 0.05       // 5% - Constant
      };
    default: // Normal/Neutral
      return {
        rate: 0.30,      // 30% - Standard weight
        momentum: 0.25,  // 25% - Standard weight
        realRate: 0.25,  // 25% - Standard weight
        risk: 0.15,      // 15% - Standard weight
        flow: 0.05       // 5% - Constant
      };
  }
};

const calculateRatePolicyScore = (data: CurrencyData, currency: 'base' | 'quote'): number => {
  const rateData = currency === 'base' ? {
    rate_hike_probability: data.base_currency_rate_hike_probability,
    rate_cut_probability: data.base_currency_rate_cut_probability,
    guidance_shift: data.base_currency_guidance_shift
  } : {
    rate_hike_probability: data.quote_currency_rate_hike_probability,
    rate_cut_probability: data.quote_currency_rate_cut_probability,
    guidance_shift: data.quote_currency_guidance_shift
  };

  // A. Next Meeting Probability (70% of factor)
  let meetingScore = 0;
  if (rateData.rate_hike_probability > 75) meetingScore = 2.0;
  else if (rateData.rate_hike_probability >= 50) meetingScore = 1.5;
  else if (rateData.rate_hike_probability >= 25) meetingScore = 1.0;
  else if (rateData.rate_cut_probability >= 25 && rateData.rate_cut_probability < 50) meetingScore = -1.0;
  else if (rateData.rate_cut_probability >= 50 && rateData.rate_cut_probability < 75) meetingScore = -1.5;
  else if (rateData.rate_cut_probability > 75) meetingScore = -2.0;
  else meetingScore = 0.0;
  
  const meetingComponent = meetingScore * 0.7;
  
  // B. Forward Guidance Shift (30% of factor)
  let guidanceScore = 0;
  if (rateData.guidance_shift === 'hawkish') guidanceScore = 0.5;
  else if (rateData.guidance_shift === 'dovish') guidanceScore = -0.5;
  
  const guidanceComponent = guidanceScore * 0.3;
  
  const totalScore = meetingComponent + guidanceComponent;
  return Math.max(-2.5, Math.min(2.5, totalScore));
};

const calculateGrowthMomentumScore = (data: CurrencyData, currency: 'base' | 'quote'): number => {
  const growthData = currency === 'base' ? {
    employment_health: data.base_currency_employment_health,
    pmi: data.base_currency_pmi
  } : {
    employment_health: data.quote_currency_employment_health,
    pmi: data.quote_currency_pmi
  };

  // A. Employment Health (50% of factor)
  const employmentComponent = growthData.employment_health * 0.5;
  
  // B. Manufacturing Pulse (50% of factor)
  let pmiScore = 0;
  if (growthData.pmi > 53) pmiScore = 1.0;
  else if (growthData.pmi >= 50) pmiScore = 0.5;
  else if (growthData.pmi >= 47) pmiScore = 0.0;
  else if (growthData.pmi >= 45) pmiScore = -0.5;
  else pmiScore = -1.0;
  
  const pmiComponent = pmiScore * 0.5;
  
  const totalScore = employmentComponent + pmiComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateRealInterestScore = (data: CurrencyData): number => {
  // Calculate real rates for both currencies
  const baseRealRate = data.base_currency_2y_yield - data.base_currency_inflation_expectation;
  const quoteRealRate = data.quote_currency_2y_yield - data.quote_currency_inflation_expectation;
  
  // Score = Difference × 2
  const differential = baseRealRate - quoteRealRate;
  const score = differential * 2;
  
  // Maximum Score: ±3.0
  return Math.max(-3.0, Math.min(3.0, score));
};

const calculateRiskAppetiteScore = (data: CurrencyData): number => {
  // A. Fear Index (70% of factor)
  let vixScore = 0;
  if (data.vix < 15) vixScore = 1.5;
  else if (data.vix <= 20) vixScore = 0.5;
  else if (data.vix <= 25) vixScore = 0.0;
  else if (data.vix <= 30) vixScore = -1.0;
  else vixScore = -1.5;
  
  const vixComponent = vixScore * 0.7;
  
  // B. Gold vs Stocks (30% of factor)
  let goldStocksScore = 0;
  
  if (data.gold_sp500_weekly_performance !== undefined && data.gold_sp500_weekly_performance !== 0) {
    if (data.gold_sp500_weekly_performance > 2) goldStocksScore = -0.5;
    else if (data.gold_sp500_weekly_performance < -2) goldStocksScore = 0.5;
  } else {
    if (data.gold_sp500_ratio_trend === 'rising') goldStocksScore = -0.5;
    else if (data.gold_sp500_ratio_trend === 'falling') goldStocksScore = 0.5;
  }
  
  const goldStocksComponent = goldStocksScore * 0.3;
  
  const totalScore = vixComponent + goldStocksComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateMoneyFlowScore = (data: CurrencyData): number => {
  // Use relevant ETF flows for the selected pair
  let totalFlowScore = 0;
  let flowCount = 0;
  
  Object.entries(data.relevant_etf_flows).forEach(([etf, flow]) => {
    const threshold = getETFThreshold(etf);
    if (Math.abs(flow) >= threshold) {
      totalFlowScore += flow > 0 ? 0.5 : -0.5;
      flowCount++;
    }
  });
  
  let averageFlowScore = 0;
  if (flowCount > 0) {
    averageFlowScore = totalFlowScore / flowCount;
  } else {
    // Fall back to general assessment
    if (data.etf_flows === 'major_inflows') averageFlowScore = 0.5;
    else if (data.etf_flows === 'major_outflows') averageFlowScore = -0.5;
  }
  
  return Math.max(-0.5, Math.min(0.5, averageFlowScore));
};

const getETFThreshold = (etf: string): number => {
  const thresholds: { [key: string]: number } = {
    'UUP': 500,  // USD
    'FXE': 200,  // EUR
    'FXB': 100,  // GBP
    'FXA': 100,  // AUD
    'FXC': 50,   // CAD
    'FXF': 50,   // CHF
    'FXY': 50    // JPY
  };
  return thresholds[etf] || 100;
};

const getTradingBias = (totalScore: number) => {
  if (totalScore > 1.8) {
    return {
      bias: 'Very Strong Bullish',
      biasColor: '#059669',
      positionSize: 'Enter on any pullback',
      riskPerTrade: '2.5% risk per trade'
    };
  } else if (totalScore >= 1.0) {
    return {
      bias: 'Strong Bullish',
      biasColor: '#10b981',
      positionSize: 'Enter on retest of support',
      riskPerTrade: '2.0% risk per trade'
    };
  } else if (totalScore >= 0.5) {
    return {
      bias: 'Moderate Bullish',
      biasColor: '#34d399',
      positionSize: 'Wait for breakout confirmation',
      riskPerTrade: '1.5% risk per trade'
    };
  } else if (totalScore >= -0.5) {
    return {
      bias: 'Neutral',
      biasColor: '#6b7280',
      positionSize: 'Technical trades only',
      riskPerTrade: '1.0% risk per trade'
    };
  } else if (totalScore >= -1.0) {
    return {
      bias: 'Moderate Bearish',
      biasColor: '#f59e0b',
      positionSize: 'Wait for breakdown confirmation',
      riskPerTrade: '1.5% risk per trade'
    };
  } else if (totalScore >= -1.8) {
    return {
      bias: 'Strong Bearish',
      biasColor: '#ef4444',
      positionSize: 'Enter on retest of resistance',
      riskPerTrade: '2.0% risk per trade'
    };
  } else {
    return {
      bias: 'Very Strong Bearish',
      biasColor: '#dc2626',
      positionSize: 'Enter on any bounce',
      riskPerTrade: '2.5% risk per trade'
    };
  }
};

const generateTradingRecommendation = (score: number, bias: string, regime: string): string => {
  const recommendations = {
    'Very Strong Bullish': `Very strong ${regime} environment supports aggressive long positioning. Enter on any pullback with 2.5% risk.`,
    'Strong Bullish': `Strong ${regime} conditions favor long positions. Wait for pullback to support before entering with 2.0% risk.`,
    'Moderate Bullish': `Moderate ${regime} signals suggest cautious bullish approach. Wait for clear breakout confirmation with 1.5% risk.`,
    'Neutral': `Mixed ${regime} signals suggest technical-only approach. Use 1.0% risk and quick profits only.`,
    'Moderate Bearish': `Moderate ${regime} headwinds support bearish bias. Wait for breakdown confirmation before entering with 1.5% risk.`,
    'Strong Bearish': `Strong ${regime} deterioration warrants bearish positioning. Enter on retest of resistance levels with 2.0% risk.`,
    'Very Strong Bearish': `Very strong ${regime} deterioration supports aggressive short positioning. Enter on any bounce with 2.5% risk.`
  };
  
  return recommendations[bias] || 'Monitor market conditions for trading opportunities.';
};
