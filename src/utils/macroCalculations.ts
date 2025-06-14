
import { MacroData } from '@/pages/Index';
import { calculateMeanStd, tanh, sign } from './statistics';

export const calculateMacroScore = (data: MacroData) => {
  // Central Bank Policy Score
  const cb_score = 2 * (data.cb_hawkish_index - 0.5);

  // Inflation Trend Score
  let inflation_score = 0;
  if (data.cpi > data.cpi_target && data.cpi_3m_change > 0) {
    inflation_score = -Math.min(2, data.cpi_3m_change * 10);
  } else if (data.cpi > data.cpi_target && data.cpi_3m_change < 0) {
    inflation_score = Math.min(2, Math.abs(data.cpi_3m_change) * 10);
  } else if (data.cpi < data.cpi_target && data.cpi_3m_change > 0) {
    inflation_score = Math.min(2, data.cpi_3m_change * 10);
  } else if (data.cpi < data.cpi_target && data.cpi_3m_change < 0) {
    inflation_score = -Math.min(2, Math.abs(data.cpi_3m_change) * 10);
  }

  // Labor Market Score
  let labor_score = 0;
  const nfpStats = calculateMeanStd(data.nfp_12m_values);
  if (nfpStats) {
    const Z = (data.current_nfp - nfpStats.mean) / Math.max(nfpStats.std, 0.1);
    labor_score = 2 * tanh(Z);
  }

  // Global Risk Score
  const credit_score = sign(-data.credit_spread_1m_change) * Math.min(1, Math.abs(data.credit_spread_1m_change) / 0.2);
  
  let vix_score = 0;
  if (data.vix >= 35) vix_score = -2;
  else if (data.vix >= 25) vix_score = -1;
  else if (data.vix >= 15) vix_score = 0;
  else if (data.vix >= 10) vix_score = 1;
  else vix_score = 1.5;
  
  const risk_score = 0.7 * credit_score + 0.3 * vix_score;

  // PMI Composite Score
  let pmi_score = 0;
  const pmiStats = calculateMeanStd(data.pmi_3y_values);
  if (pmiStats) {
    const threshold_low = pmiStats.mean - 1.5 * pmiStats.std;
    const threshold_mid_low = pmiStats.mean - 0.5 * pmiStats.std;
    const threshold_mid_high = pmiStats.mean + 0.5 * pmiStats.std;
    const threshold_high = pmiStats.mean + 1.5 * pmiStats.std;
    
    if (data.pmi < threshold_low) pmi_score = -2;
    else if (data.pmi > threshold_high) pmi_score = 1.5;
    else if (data.pmi >= threshold_mid_low && data.pmi <= threshold_mid_high) pmi_score = 0;
    else if (data.pmi < threshold_mid_low) pmi_score = -1;
    else pmi_score = 0.75;
  }

  // Current Account Score
  let ca_score = 0;
  const caStats = calculateMeanStd(data.ca_5y_values);
  if (caStats) {
    const Z = (data.ca_gdp - caStats.mean) / Math.max(caStats.std, 0.1);
    ca_score = 2 * tanh(Z / 2);
  }

  // Geopolitical Risk Score
  let geo_score = 0;
  const gprStats = calculateMeanStd(data.gpr_3y_values);
  if (gprStats) {
    const Z = (data.gpr - gprStats.mean) / Math.max(gprStats.std, 1e-5);
    geo_score = -2 * tanh(Z / 2);
  }

  // Weighted Total Score
  const weights = {
    cb: 0.24,
    inflation: 0.19,
    labor: 0.17,
    risk: 0.14,
    pmi: 0.11,
    ca: 0.09,
    geo: 0.06,
  };

  const total_score = 
    cb_score * weights.cb +
    inflation_score * weights.inflation +
    labor_score * weights.labor +
    risk_score * weights.risk +
    pmi_score * weights.pmi +
    ca_score * weights.ca +
    geo_score * weights.geo;

  // Trading Bias
  let bias = '';
  let biasColor = '';
  if (total_score >= 1.0) {
    bias = 'Strong Bullish';
    biasColor = '#16a34a';
  } else if (total_score >= 0.3) {
    bias = 'Mild Bullish';
    biasColor = '#22c55e';
  } else if (total_score >= -0.3) {
    bias = 'Neutral';
    biasColor = '#6b7280';
  } else if (total_score >= -1.0) {
    bias = 'Mild Bearish';
    biasColor = '#f97316';
  } else {
    bias = 'Strong Bearish';
    biasColor = '#dc2626';
  }

  return {
    scores: {
      cb_score: Number(cb_score.toFixed(2)),
      inflation_score: Number(inflation_score.toFixed(2)),
      labor_score: Number(labor_score.toFixed(2)),
      risk_score: Number(risk_score.toFixed(2)),
      pmi_score: Number(pmi_score.toFixed(2)),
      ca_score: Number(ca_score.toFixed(2)),
      geo_score: Number(geo_score.toFixed(2)),
    },
    total_score: Number(total_score.toFixed(2)),
    bias,
    biasColor,
  };
};
