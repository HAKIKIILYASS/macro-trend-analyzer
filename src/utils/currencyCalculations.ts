
import { CurrencyData } from '@/pages/Index';

export const calculateCurrencyScore = (data: CurrencyData) => {
  // Determine market regime and adjust weights accordingly
  const regime = determineMarketRegime(data);
  const weights = getRegimeWeights(regime);
  
  // Factor 1: Rate Policy (30% base weight)
  const ratePolicyScore = calculateRatePolicyScore(data);
  
  // Factor 2: Growth Momentum (25% base weight)
  const growthMomentumScore = calculateGrowthMomentumScore(data);
  
  // Factor 3: Real Interest Edge (25% base weight)
  const realInterestScore = calculateRealInterestScore(data);
  
  // Factor 4: Risk Appetite (15% base weight)
  const riskAppetiteScore = calculateRiskAppetiteScore(data);
  
  // Factor 5: Money Flow (5% base weight)
  const moneyFlowScore = calculateMoneyFlowScore(data);
  
  // Apply regime-based weights
  const totalScore = (
    ratePolicyScore * weights.ratePolicy +
    growthMomentumScore * weights.growthMomentum +
    realInterestScore * weights.realInterest +
    riskAppetiteScore * weights.riskAppetite +
    moneyFlowScore * weights.moneyFlow
  );
  
  // Determine trading bias and position sizing
  const { bias, biasColor, positionSize, riskPerTrade } = getTradingBias(totalScore);
  
  return {
    regime,
    scores: {
      rate_policy: Number(ratePolicyScore.toFixed(2)),
      growth_momentum: Number(growthMomentumScore.toFixed(2)),
      real_interest_edge: Number(realInterestScore.toFixed(2)),
      risk_appetite: Number(riskAppetiteScore.toFixed(2)),
      money_flow: Number(moneyFlowScore.toFixed(2)),
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
  if (data.is_cb_week) return 'Central Bank Week';
  
  // Risk-Off Mode: VIX > 25 OR Gold outperforms S&P500 this month
  if (data.vix > 25 || data.gold_vs_stocks_monthly > 0) {
    return 'Risk-Off';
  } 
  // Risk-On Mode: VIX < 18 AND S&P500 making new highs
  else if (data.vix < 18 && data.sp500_new_highs) {
    return 'Risk-On';
  } 
  // Neutral Mode: Everything else
  else {
    return 'Neutral';
  }
};

const getRegimeWeights = (regime: string) => {
  switch (regime) {
    case 'Risk-Off':
      return {
        ratePolicy: 0.40,      // 40%
        growthMomentum: 0.15,  // 15%
        realInterest: 0.30,    // 30%
        riskAppetite: 0.25,    // 25%
        moneyFlow: 0.05        // 5%
      };
    case 'Risk-On':
      return {
        ratePolicy: 0.25,      // 25%
        growthMomentum: 0.35,  // 35%
        realInterest: 0.25,    // 25%
        riskAppetite: 0.10,    // 10%
        moneyFlow: 0.05        // 5%
      };
    case 'Central Bank Week':
      return {
        ratePolicy: 0.50,      // 50%
        growthMomentum: 0.20,  // 20%
        realInterest: 0.20,    // 20%
        riskAppetite: 0.05,    // 5%
        moneyFlow: 0.05        // 5%
      };
    default: // Normal/Neutral
      return {
        ratePolicy: 0.30,      // 30%
        growthMomentum: 0.25,  // 25%
        realInterest: 0.25,    // 25%
        riskAppetite: 0.15,    // 15%
        moneyFlow: 0.05        // 5%
      };
  }
};

const calculateRatePolicyScore = (data: CurrencyData): number => {
  // A. Next Meeting Probability (70% of factor)
  let meetingScore = 0;
  if (data.rate_hike_probability > 75) meetingScore = 2.0;        // Rate Hike >75%
  else if (data.rate_hike_probability >= 50) meetingScore = 1.5;  // Rate Hike 50-75%
  else if (data.rate_hike_probability >= 25) meetingScore = 1.0;  // Rate Hike 25-50%
  else if (data.rate_hike_probability === 50) meetingScore = 0.0; // No Change 50%
  else if (data.rate_cut_probability >= 25) meetingScore = -1.0;  // Rate Cut 25-50%
  else if (data.rate_cut_probability >= 50) meetingScore = -1.5;  // Rate Cut 50-75%
  else if (data.rate_cut_probability > 75) meetingScore = -2.0;   // Rate Cut >75%
  
  const meetingComponent = meetingScore * 0.7;
  
  // B. Forward Guidance Shift (30% of factor)
  let guidanceScore = 0;
  if (data.guidance_shift === 'hawkish') guidanceScore = 0.5;     // More Hawkish Signals
  else if (data.guidance_shift === 'dovish') guidanceScore = -0.5; // More Dovish Signals
  // 'neutral' = 0.0 (Same Tone)
  
  const guidanceComponent = guidanceScore * 0.3;
  
  const totalScore = meetingComponent + guidanceComponent;
  return Math.max(-2.5, Math.min(2.5, totalScore));
};

const calculateGrowthMomentumScore = (data: CurrencyData): number => {
  // A. Employment Health (50% of factor)
  const employmentComponent = data.employment_health * 0.5; // Already scored as Strong(+1.0), Normal(0.0), Weak(-1.0)
  
  // B. Manufacturing Pulse (50% of factor) - exact PMI scoring from model
  let pmiScore = 0;
  if (data.pmi > 53) pmiScore = 1.0;        // Strong expansion
  else if (data.pmi >= 50) pmiScore = 0.5;  // Mild growth
  else if (data.pmi >= 47) pmiScore = 0.0;  // Stagnant
  else if (data.pmi >= 45) pmiScore = -0.5; // Mild contraction
  else pmiScore = -1.0;                     // Deep contraction
  
  const pmiComponent = pmiScore * 0.5;
  
  const totalScore = employmentComponent + pmiComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateRealInterestScore = (data: CurrencyData): number => {
  // Real Rate = 2-Year Government Bond Yield - Forward Inflation Expectation
  const usRealRate = data.us_2y_yield - data.us_inflation_expectation;
  const targetRealRate = data.target_2y_yield - data.target_inflation_expectation;
  
  // Score = (Target Country Real Rate - Base Country Real Rate) × 2
  const differential = targetRealRate - usRealRate;
  const score = differential * 2;
  
  // Maximum Score: ±3.0
  return Math.max(-3.0, Math.min(3.0, score));
};

const calculateRiskAppetiteScore = (data: CurrencyData): number => {
  // A. Fear Index (70% of factor) - exact VIX scoring from model
  let vixScore = 0;
  if (data.vix < 15) vixScore = 1.5;        // Extreme greed = Risk currencies strong
  else if (data.vix <= 20) vixScore = 0.5;  // Calm markets
  else if (data.vix <= 25) vixScore = 0.0;  // Normal volatility
  else if (data.vix <= 30) vixScore = -1.0; // Rising concern
  else vixScore = -1.5;                     // Fear mode = Safe havens strong
  
  const vixComponent = vixScore * 0.7;
  
  // B. Safe Haven Flow (30% of factor)
  let safeHavenScore = 0;
  if (data.gold_sp500_ratio_trend === 'rising') safeHavenScore = -0.5;  // Risk-off
  else if (data.gold_sp500_ratio_trend === 'falling') safeHavenScore = 0.5; // Risk-on
  // 'stable' = 0.0 (Neutral)
  
  const safeHavenComponent = safeHavenScore * 0.3;
  
  const totalScore = vixComponent + safeHavenComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateMoneyFlowScore = (data: CurrencyData): number => {
  // ETF Flow scoring based on monthly data
  let flowScore = 0;
  if (data.etf_flows === 'major_inflows') flowScore = 0.5;    // Major inflows
  else if (data.etf_flows === 'major_outflows') flowScore = -0.5; // Major outflows
  // 'normal' = 0.0
  
  return Math.max(-0.5, Math.min(0.5, flowScore));
};

const getTradingBias = (totalScore: number) => {
  // Exact Trading Bias Matrix from model
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
    'Very Strong Bullish': `Very strong ${regime} environment supports aggressive long positioning. Enter on any pullback with tight stops.`,
    'Strong Bullish': `Strong ${regime} conditions favor long positions. Wait for pullback to 20-period MA before entering.`,
    'Moderate Bullish': `Moderate ${regime} signals suggest cautious bullish approach. Wait for clear breakout confirmation.`,
    'Neutral': `Mixed ${regime} signals suggest technical-only approach. Use tight stops and quick profits.`,
    'Moderate Bearish': `Moderate ${regime} headwinds support bearish bias. Wait for breakdown confirmation before entering.`,
    'Strong Bearish': `Strong ${regime} deterioration warrants bearish positioning. Enter on retest of resistance levels.`,
    'Very Strong Bearish': `Very strong ${regime} deterioration supports aggressive short positioning. Enter on any bounce.`
  };
  
  return recommendations[bias] || 'Monitor market conditions for trading opportunities.';
};
