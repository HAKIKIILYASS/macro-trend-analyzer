import { CurrencyData } from '@/pages/Index';

export const calculateCurrencyScore = (data: CurrencyData) => {
  // Determine market regime and adjust weights accordingly
  const regime = determineMarketRegime(data);
  const weights = getRegimeWeights(regime);
  
  // Factor 1: Rate Policy (30% base weight) - Updated to match your exact methodology
  const ratePolicyScore = calculateRatePolicyScore(data);
  
  // Factor 2: Growth Momentum (25% base weight) - Using your employment + PMI approach
  const growthMomentumScore = calculateGrowthMomentumScore(data);
  
  // Factor 3: Real Interest Edge (25% base weight) - Your simplified real rate formula
  const realInterestScore = calculateRealInterestScore(data);
  
  // Factor 4: Risk Appetite (15% base weight) - Your VIX + Gold vs Stocks method with new weekly performance
  const riskAppetiteScore = calculateRiskAppetiteScore(data);
  
  // Factor 5: Money Flow (5% base weight) - Updated with individual ETF flows
  const moneyFlowScore = calculateMoneyFlowScore(data);
  
  // Apply regime-based weights using your exact weight system
  const totalScore = (
    ratePolicyScore * weights.rate +
    growthMomentumScore * weights.momentum +
    realInterestScore * weights.realRate +
    riskAppetiteScore * weights.risk +
    moneyFlowScore * weights.flow
  );
  
  // Determine trading bias using your exact signal matrix
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
    weights: {
      rate: weights.rate,
      realRate: weights.realRate,
      momentum: weights.momentum,
      risk: weights.risk,
      flow: weights.flow
    },
    total_score: Number(totalScore.toFixed(2)),
    bias,
    biasColor,
    positionSize,
    riskPerTrade,
    tradingRecommendation: generateTradingRecommendation(totalScore, bias, regime)
  };
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

const calculateRatePolicyScore = (data: CurrencyData): number => {
  // A. Next Meeting Probability (70% of factor) - Your exact thresholds
  let meetingScore = 0;
  if (data.rate_hike_probability > 75) meetingScore = 2.0;        // Rate Hike >75%
  else if (data.rate_hike_probability >= 50) meetingScore = 1.5;  // Rate Hike 50-75%
  else if (data.rate_hike_probability >= 25) meetingScore = 1.0;  // Rate Hike 25-50%
  else if (data.rate_cut_probability >= 25 && data.rate_cut_probability < 50) meetingScore = -1.0;  // Rate Cut 25-50%
  else if (data.rate_cut_probability >= 50 && data.rate_cut_probability < 75) meetingScore = -1.5;  // Rate Cut 50-75%
  else if (data.rate_cut_probability > 75) meetingScore = -2.0;   // Rate Cut >75%
  else meetingScore = 0.0; // No change expected around 50%
  
  const meetingComponent = meetingScore * 0.7;
  
  // B. Forward Guidance Shift (30% of factor) - Your exact methodology
  let guidanceScore = 0;
  if (data.guidance_shift === 'hawkish') guidanceScore = 0.5;     // More Hawkish Signals
  else if (data.guidance_shift === 'dovish') guidanceScore = -0.5; // More Dovish Signals
  // 'neutral' = 0.0 (Same Tone)
  
  const guidanceComponent = guidanceScore * 0.3;
  
  const totalScore = meetingComponent + guidanceComponent;
  return Math.max(-2.5, Math.min(2.5, totalScore));
};

const calculateGrowthMomentumScore = (data: CurrencyData): number => {
  // A. Employment Health (50% of factor) - Your exact approach
  const employmentComponent = data.employment_health * 0.5; // Strong(+1.0), Normal(0.0), Weak(-1.0)
  
  // B. Manufacturing Pulse (50% of factor) - Your exact PMI thresholds
  let pmiScore = 0;
  if (data.pmi > 53) pmiScore = 1.0;        // Strong expansion (booming)
  else if (data.pmi >= 50) pmiScore = 0.5;  // Mild growth (growing slowly)
  else if (data.pmi >= 47) pmiScore = 0.0;  // Stagnant
  else if (data.pmi >= 45) pmiScore = -0.5; // Mild contraction
  else pmiScore = -1.0;                     // Deep contraction (shrinking)
  
  const pmiComponent = pmiScore * 0.5;
  
  const totalScore = employmentComponent + pmiComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateRealInterestScore = (data: CurrencyData): number => {
  // Your simplified real rate formula: Bond Rate - Inflation Rate
  const usRealRate = data.us_2y_yield - data.us_inflation_expectation;
  const targetRealRate = data.target_2y_yield - data.target_inflation_expectation;
  
  // Score = Difference × 2 (your multiplier)
  const differential = targetRealRate - usRealRate;
  const score = differential * 2;
  
  // Maximum Score: ±3.0
  return Math.max(-3.0, Math.min(3.0, score));
};

const calculateRiskAppetiteScore = (data: CurrencyData): number => {
  // A. Fear Index (70% of factor) - Your exact VIX thresholds
  let vixScore = 0;
  if (data.vix < 15) vixScore = 1.5;        // Everyone's greedy = Risk currencies win
  else if (data.vix <= 20) vixScore = 0.5;  // Pretty calm
  else if (data.vix <= 25) vixScore = 0.0;  // Normal volatility
  else if (data.vix <= 30) vixScore = -1.0; // Getting worried
  else vixScore = -1.5;                     // Panic mode = Safe havens win
  
  const vixComponent = vixScore * 0.7;
  
  // B. Gold vs Stocks (30% of factor) - Updated to use weekly performance data
  let goldStocksScore = 0;
  
  // Use weekly performance if available, otherwise fall back to trend
  if (data.gold_sp500_weekly_performance !== undefined && data.gold_sp500_weekly_performance !== 0) {
    if (data.gold_sp500_weekly_performance > 2) goldStocksScore = -0.5;  // Gold outperforming significantly
    else if (data.gold_sp500_weekly_performance < -2) goldStocksScore = 0.5; // S&P outperforming significantly
    // Between -2% and +2% = neutral (0.0)
  } else {
    // Fall back to trend-based scoring
    if (data.gold_sp500_ratio_trend === 'rising') goldStocksScore = -0.5;  // People scared
    else if (data.gold_sp500_ratio_trend === 'falling') goldStocksScore = 0.5; // People greedy
    // 'stable' = 0.0 (Normal)
  }
  
  const goldStocksComponent = goldStocksScore * 0.3;
  
  const totalScore = vixComponent + goldStocksComponent;
  return Math.max(-2.0, Math.min(2.0, totalScore));
};

const calculateMoneyFlowScore = (data: CurrencyData): number => {
  // Updated Money Flow methodology using individual ETF flows
  let totalFlowScore = 0;
  let flowCount = 0;
  
  // UUP (USD) - Threshold: $500M
  if (Math.abs(data.uup_flow) >= 500) {
    totalFlowScore += data.uup_flow > 0 ? 0.5 : -0.5;
    flowCount++;
  }
  
  // FXE (EUR) - Threshold: $200M  
  if (Math.abs(data.fxe_flow) >= 200) {
    totalFlowScore += data.fxe_flow > 0 ? 0.5 : -0.5;
    flowCount++;
  }
  
  // FXB (GBP) - Threshold: $100M
  if (Math.abs(data.fxb_flow) >= 100) {
    totalFlowScore += data.fxb_flow > 0 ? 0.5 : -0.5;
    flowCount++;
  }
  
  // FXA (AUD) - Threshold: $100M
  if (Math.abs(data.fxa_flow) >= 100) {
    totalFlowScore += data.fxa_flow > 0 ? 0.5 : -0.5;
    flowCount++;
  }
  
  // FXC (CAD) - Threshold: $50M
  if (Math.abs(data.fxc_flow) >= 50) {
    totalFlowScore += data.fxc_flow > 0 ? 0.5 : -0.5;
    flowCount++;
  }
  
  // Average the flow scores if we have multiple significant flows
  let averageFlowScore = 0;
  if (flowCount > 0) {
    averageFlowScore = totalFlowScore / flowCount;
  }
  
  // Fall back to general ETF flow assessment if no specific flows are significant
  if (flowCount === 0) {
    if (data.etf_flows === 'major_inflows') averageFlowScore = 0.5;
    else if (data.etf_flows === 'major_outflows') averageFlowScore = -0.5;
    // 'normal' = 0.0
  }
  
  return Math.max(-0.5, Math.min(0.5, averageFlowScore));
};

const getTradingBias = (totalScore: number) => {
  // Your exact Trading Signal Matrix
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
