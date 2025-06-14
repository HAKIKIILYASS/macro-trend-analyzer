
export const calculateMeanStd = (values: number[]) => {
  if (values.length === 0) return null;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  
  return { mean, std };
};

export const tanh = (x: number): number => {
  return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
};

export const sign = (x: number): number => {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return 0;
};
