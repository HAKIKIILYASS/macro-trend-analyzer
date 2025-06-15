import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import MacroResults from "@/components/MacroResults";
import DashboardSummary from "@/components/DashboardSummary";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowRight, RotateCcw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScoreCompareProps {
  scoreA: { label: string, data: any, results: any } | null;
  scoreB: { label: string, data: any, results: any } | null;
  onClearComparison?: () => void;
}

const ComparisonMetric = ({ label, valueA, valueB, format = "number" }: {
  label: string;
  valueA: number | null | undefined;
  valueB: number | null | undefined;
  format?: "number" | "percentage";
}) => {
  // Enhanced null/undefined checks
  if (valueA == null || valueB == null || valueA === undefined || valueB === undefined) {
    return null;
  }
  
  const diff = valueB - valueA;
  const percentDiff = valueA !== 0 ? ((diff / Math.abs(valueA)) * 100) : 0;
  
  const formatValue = (val: number) => {
    if (val == null || val === undefined) return "N/A";
    if (format === "percentage") return `${val.toFixed(1)}%`;
    return val.toFixed(2);
  };
  
  const getDiffIcon = () => {
    if (Math.abs(diff) < 0.01) return <Minus className="w-4 h-4 text-muted-foreground" />;
    return diff > 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };
  
  const getDiffColor = () => {
    if (Math.abs(diff) < 0.01) return "text-muted-foreground";
    return diff > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/20 animate-slide-up">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-muted-foreground">{formatValue(valueA)}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm font-mono font-medium">{formatValue(valueB)}</span>
        <div className="flex items-center gap-1 ml-3 min-w-[60px] justify-end">
          {getDiffIcon()}
          <span className={cn("text-xs font-medium font-mono", getDiffColor())}>
            {format === "percentage" ? `${diff.toFixed(1)}pp` : `${diff > 0 ? '+' : ''}${diff.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ScoreCompare({ scoreA, scoreB, onClearComparison }: ScoreCompareProps) {
  const hasComparison = scoreA && scoreB && scoreA.results && scoreB.results;
  const { toast } = useToast();

  const copyComparison = () => {
    if (!hasComparison) return;
    
    const scoreAValue = scoreA.results.overall_score || scoreA.results.total_score || 0;
    const scoreBValue = scoreB.results.overall_score || scoreB.results.total_score || 0;
    const biasA = scoreA.results.trading_bias || scoreA.results.bias || 'Unknown';
    const biasB = scoreB.results.trading_bias || scoreB.results.bias || 'Unknown';
    
    const comparisonText = `
Scenario Comparison:
A: ${scoreA.label} (Score: ${scoreAValue.toFixed(2)}, Bias: ${biasA})
B: ${scoreB.label} (Score: ${scoreBValue.toFixed(2)}, Bias: ${biasB})
Difference: ${(scoreBValue - scoreAValue).toFixed(2)}
    `;
    
    navigator.clipboard.writeText(comparisonText);
    toast({
      title: "Comparison copied!",
      description: "The comparison summary has been copied to your clipboard.",
    });
  };

  // Helper function to safely get score values
  const getScoreValue = (results: any, primaryKey: string, fallbackKey?: string) => {
    if (!results) return null;
    return results[primaryKey] ?? (fallbackKey ? results[fallbackKey] : null);
  };

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Compare Scenarios
        </h2>
        {hasComparison && (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="animate-pulse bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
              Active Comparison
            </Badge>
            <Button variant="outline" size="sm" onClick={copyComparison} className="card-hover">
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            {onClearComparison && (
              <Button variant="ghost" size="sm" onClick={onClearComparison} className="card-hover">
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl">
        {/* Scenario A */}
        <div className={cn("flex flex-col gap-4 transition-all duration-300", !scoreA && "opacity-50 scale-95")}>
          <Card className="animate-slide-up card-hover border border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold flex items-center justify-center">A</div>
                <span className="text-primary">Scenario A</span>
                {scoreA && <span className="text-muted-foreground">: {scoreA.label}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreA?.results ? (
                <div className="space-y-4">
                  <DashboardSummary data={scoreA.data} results={scoreA.results} />
                  <Separator className="bg-border/50" />
                  <MacroResults results={scoreA.results} />
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-5xl mb-4 opacity-60">📊</div>
                  <div className="text-lg font-medium mb-1">No scenario selected</div>
                  <div className="text-sm">Choose from recent activity sidebar</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scenario B */}
        <div className={cn("flex flex-col gap-4 transition-all duration-300", !scoreB && "opacity-50 scale-95")}>
          <Card className="animate-slide-up card-hover border border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold flex items-center justify-center">B</div>
                <span className="text-primary">Scenario B</span>
                {scoreB && <span className="text-muted-foreground">: {scoreB.label}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreB?.results ? (
                <div className="space-y-4">
                  <DashboardSummary data={scoreB.data} results={scoreB.results} />
                  <Separator className="bg-border/50" />
                  <MacroResults results={scoreB.results} />
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-5xl mb-4 opacity-60">📈</div>
                  <div className="text-lg font-medium mb-1">No scenario selected</div>
                  <div className="text-sm">Choose from recent activity sidebar</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Comparison Summary */}
      {hasComparison && (
        <Card className="w-full max-w-5xl mt-8 animate-slide-up card-hover border-2 border-primary/30 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-medium">A vs B</span>
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              </div>
              Detailed Comparison Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Performance Metrics</h4>
                <ComparisonMetric 
                  label="Overall Score" 
                  valueA={getScoreValue(scoreA.results, 'overall_score', 'total_score')} 
                  valueB={getScoreValue(scoreB.results, 'overall_score', 'total_score')} 
                />
                <ComparisonMetric 
                  label="Central Bank Score" 
                  valueA={getScoreValue(scoreA.results, 'cb_score')} 
                  valueB={getScoreValue(scoreB.results, 'cb_score')} 
                />
                <ComparisonMetric 
                  label="Inflation Score" 
                  valueA={getScoreValue(scoreA.results, 'inflation_score')} 
                  valueB={getScoreValue(scoreB.results, 'inflation_score')} 
                />
                <ComparisonMetric 
                  label="Labor Score" 
                  valueA={getScoreValue(scoreA.results, 'labor_score')} 
                  valueB={getScoreValue(scoreB.results, 'labor_score')} 
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Risk Assessment</h4>
                <ComparisonMetric 
                  label="Risk Score" 
                  valueA={getScoreValue(scoreA.results, 'risk_score')} 
                  valueB={getScoreValue(scoreB.results, 'risk_score')} 
                />
                <ComparisonMetric 
                  label="PMI Score" 
                  valueA={getScoreValue(scoreA.results, 'pmi_score')} 
                  valueB={getScoreValue(scoreB.results, 'pmi_score')} 
                />
                <ComparisonMetric 
                  label="Current Account Score" 
                  valueA={getScoreValue(scoreA.results, 'ca_score')} 
                  valueB={getScoreValue(scoreB.results, 'ca_score')} 
                />
                <ComparisonMetric 
                  label="Geopolitical Score" 
                  valueA={getScoreValue(scoreA.results, 'geo_score')} 
                  valueB={getScoreValue(scoreB.results, 'geo_score')} 
                />
              </div>
            </div>
            
            <Separator className="my-6 bg-border/50" />
            
            <div className="text-center">
              <div className="inline-flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 animate-slide-up">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Scenario A Trading Bias</div>
                  <Badge variant={getScoreValue(scoreA.results, 'trading_bias', 'bias') === 'BUY' ? 'default' : getScoreValue(scoreA.results, 'trading_bias', 'bias') === 'SELL' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                    {getScoreValue(scoreA.results, 'trading_bias', 'bias') || 'Unknown'}
                  </Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Scenario B Trading Bias</div>
                  <Badge variant={getScoreValue(scoreB.results, 'trading_bias', 'bias') === 'BUY' ? 'default' : getScoreValue(scoreB.results, 'trading_bias', 'bias') === 'SELL' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                    {getScoreValue(scoreB.results, 'trading_bias', 'bias') || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
