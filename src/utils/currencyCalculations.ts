
import { CurrencyData } from '@/pages/Index';

export const calculateCurrencyScore = (data: CurrencyData) => {
  // Determine market regime and adjust weights accordingly
  const regime = determineMarketRegime(data);
  const weights = getRegimeWeights(regime);
  
  // Factor 1: Rate Expectations (28% base weight)
  const rateScore = calculateRateExpectationsScore(data);
  
  // Factor 2: Real Rate Edge (25% base weight)
  const realRateScore = calculateRealRateScore(data);
  
  // Factor 3: Economic Momentum (22% base weight)
  const momentumScore = calculateEconomicMomentumScore(data);
  
  // Factor 4: Risk Sentiment (15% base weight)
  const riskScore = calculateRiskSentimentScore(data);
  
  // Factor 5: Flow Dynamics (10% base weight)
  const flowScore = calculateFlowDynamicsScore(data);
  
  // Apply regime-based weights
  const totalScore = (
    rateScore * weights.rate +
    realRateScore * weights.realRate +
    momentumScore * weights.momentum +
    riskScore * weights.risk +
    flowScore * weights.flow
  );
  
  // Determine trading bias and position sizing
  const { bias, biasColor, positionSize, riskPerTrade } = getTradingBias(totalScore);
  
  return {
    regime,
    scores: {
      rate_expectations: Number(rateScore.toFixed(2)),
      real_rate_edge: Number(realRateScore.toFixed(2)),
      economic_momentum: Number(momentumScore.toFixed(2)),
      risk_sentiment: Number(riskScore.toFixed(2)),
      flow_dynamics: Number(flowScore.toFixed(2)),
    },
    weights,
    total_score: Number(totalScore.toFixed(2)),
    bias,
    biasColor,
    positionSize,
    riskPerTrade,
    tradingRecommendation: generateTradingRecommendation(totalScore, bias, regime)
  };
};

const determineMarketRegime = (data: CurrencyData): string => {
  if (data.is_cb_week) return 'CB Week';
  
  if (data.vix > 25 && data.usd_jpy_trend === 'declining') {
    return 'Risk-Off';
  } else if (data.vix < 20 && data.usd_jpy_trend === 'rising') {
    return 'Risk-On';
  } else {
    return 'Transition';
  }
};

const getRegimeWeights = (regime: string) => {
  const baseWeights = {
    rate: 0.28,
    realRate: 0.25,
    momentum: 0.22,
    risk: 0.15,
    flow: 0.10
  };
  
  switch (regime) {
    case 'Risk-Off':
      return {
        rate: 0.35,
        realRate: 0.20,
        momentum: 0.12,
        risk: 0.25,
        flow: 0.08
      };
    case 'Risk-On':
      return {
        rate: 0.22,
        realRate: 0.30,
        momentum: 0.28,
        risk: 0.10,
        flow: 0.10
      };
    case 'CB Week':
      return {
        rate: 0.45,
        realRate: 0.25,
        momentum: 0.15,
        risk: 0.08,
        flow: 0.07
      };
    default:
      return baseWeights;
  }
};

const calculateRateExpectationsScore = (data: CurrencyData): number => {
  let score = 0;
  
  // Next meeting probability scoring
  if (data.rate_hike_probability >= 70) score += 2.0;
  else if (data.rate_hike_probability >= 50) score += 1.0;
  else if (data.rate_hike_probability >= 30) score += 0.0;
  else if (data.rate_hike_probability >= 10) score -= 1.0;
  else score -= 2.0;
  
  // Path adjustment scoring
  if (data.path_adjustment === 'hawkish') score += 0.5;
  else if (data.path_adjustment === 'dovish') score -= 0.5;
  
  return Math.max(-2.5, Math.min(2.5, score));
};

const calculateRealRateScore = (data: CurrencyData): number => {
  const usRealRate = data.us_2y_yield - data.us_cpi;
  const targetRealRate = data.target_2y_yield - data.target_cpi;
  
  const differential = usRealRate - targetRealRate;
  const score = differential * 1.5;
  
  return Math.max(-3.0, Math.min(3.0, score));
};

const calculateEconomicMomentumScore = (data: CurrencyData): number => {
  // Employment component (50% weight)
  const employmentComponent = data.employment_score * 0.5;
  
  // PMI component (30% weight)
  let pmiScore = 0;
  if (data.pmi > 55) pmiScore = 1.5;
  else if (data.pmi >= 52) pmiScore = 1.0;
  else if (data.pmi >= 48) pmiScore = 0.0;
  else if (data.pmi >= 45) pmiScore = -1.0;
  else pmiScore = -1.5;
  
  const pmiComponent = pmiScore * 0.3;
  
  // Consumer strength component (20% weight)
  const consumerComponent = data.consumer_strength * 0.2;
  
  const totalScore = employmentComponent + pmiComponent + consumerComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateRiskSentimentScore = (data: CurrencyData): number => {
  // VIX scoring (60% weight)
  let vixScore = 0;
  if (data.vix_level < 15) vixScore = 1.5;
  else if (data.vix_level <= 20) vixScore = 1.0;
  else if (data.vix_level <= 25) vixScore = 0.0;
  else if (data.vix_level <= 30) vixScore = -1.0;
  else vixScore = -1.5;
  
  const vixComponent = vixScore * 0.6;
  
  // Gold vs Stocks component (40% weight)
  let goldStocksScore = 0;
  if (data.gold_vs_stocks_weekly > 0) goldStocksScore = -1.0; // Gold outperforming = risk off
  else if (data.gold_vs_stocks_weekly < 0) goldStocksScore = 1.0; // Stocks outperforming = risk on
  
  const goldStocksComponent = goldStocksScore * 0.4;
  
  const totalScore = vixComponent + goldStocksComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateFlowDynamicsScore = (data: CurrencyData): number => {
  // Simple flow scoring: +0.5 per $100M inflow, -0.5 per $100M outflow
  const score = (data.currency_etf_flows / 100) * 0.5;
  return Math.max(-1.5, Math.min(1.5, score));
};

const getTradingBias = (totalScore: number) => {
  if (totalScore >= 1.5) {
    return {
      bias: 'Strong Bullish',
      biasColor: '#16a34a',
      positionSize: 'Full long position',
      riskPerTrade: '2-3% risk per trade'
    };
  } else if (totalScore >= 0.5) {
    return {
      bias: 'Mild Bullish',
      biasColor: '#22c55e',
      positionSize: '70% long bias',
      riskPerTrade: '1.5-2% risk per trade'
    };
  } else if (totalScore >= -0.5) {
    return {
      bias: 'Neutral',
      biasColor: '#6b7280',
      positionSize: 'Technical only',
      riskPerTrade: '1% risk per trade'
    };
  } else if (totalScore >= -1.5) {
    return {
      bias: 'Mild Bearish',
      biasColor: '#f97316',
      positionSize: '70% short bias',
      riskPerTrade: '1.5-2% risk per trade'
    };
  } else {
    return {
      bias: 'Strong Bearish',
      biasColor: '#dc2626',
      positionSize: 'Full short position',
      riskPerTrade: '2-3% risk per trade'
    };
  }
};

const generateTradingRecommendation = (score: number, bias: string, regime: string): string => {
  const recommendations = {
    'Strong Bullish': `Strong ${regime} environment supports aggressive long positioning. Consider full allocation with tight stops.`,
    'Mild Bullish': `Moderate ${regime} conditions favor long bias. Scale into positions with careful risk management.`,
    'Neutral': `Mixed ${regime} signals suggest technical-only approach. Wait for clear directional catalyst.`,
    'Mild Bearish': `Emerging ${regime} headwinds support short bias. Consider defensive positioning.`,
    'Strong Bearish': `Clear ${regime} deterioration warrants aggressive short positioning with full allocation.`
  };
  
  return recommendations[bias] || 'Monitor market conditions for trading opportunities.';
};
