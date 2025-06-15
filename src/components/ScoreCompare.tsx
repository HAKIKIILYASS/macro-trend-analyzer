
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
  valueA: number | null;
  valueB: number | null;
  format?: "number" | "percentage";
}) => {
  if (valueA === null || valueB === null) return null;
  
  const diff = valueB - valueA;
  const percentDiff = valueA !== 0 ? ((diff / Math.abs(valueA)) * 100) : 0;
  
  const formatValue = (val: number) => {
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
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-muted-foreground/10">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono">{formatValue(valueA)}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm font-mono">{formatValue(valueB)}</span>
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
    
    const comparisonText = `
Scenario Comparison:
A: ${scoreA.label} (Score: ${scoreA.results.overall_score.toFixed(2)}, Bias: ${scoreA.results.trading_bias})
B: ${scoreB.label} (Score: ${scoreB.results.overall_score.toFixed(2)}, Bias: ${scoreB.results.trading_bias})
Difference: ${(scoreB.results.overall_score - scoreA.results.overall_score).toFixed(2)}
    `;
    
    navigator.clipboard.writeText(comparisonText);
    toast({
      title: "Comparison copied!",
      description: "The comparison summary has been copied to your clipboard.",
    });
  };

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Compare Scenarios
        </h2>
        {hasComparison && (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="animate-pulse bg-gradient-to-r from-blue-500 to-green-500 text-white">
              Active Comparison
            </Badge>
            <Button variant="outline" size="sm" onClick={copyComparison}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            {onClearComparison && (
              <Button variant="ghost" size="sm" onClick={onClearComparison}>
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
          <Card className="animate-fade-in border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center">A</div>
                <span className="text-blue-700 dark:text-blue-300">Scenario A</span>
                {scoreA && <span className="text-muted-foreground">: {scoreA.label}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreA?.results ? (
                <div className="space-y-4">
                  <DashboardSummary data={scoreA.data} results={scoreA.results} />
                  <Separator />
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
          <Card className="animate-fade-in border-l-4 border-l-green-500 dark:border-l-green-400 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold flex items-center justify-center">B</div>
                <span className="text-green-700 dark:text-green-300">Scenario B</span>
                {scoreB && <span className="text-muted-foreground">: {scoreB.label}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreB?.results ? (
                <div className="space-y-4">
                  <DashboardSummary data={scoreB.data} results={scoreB.results} />
                  <Separator />
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
        <Card className="w-full max-w-5xl mt-8 animate-scale-in border-2 border-gradient-to-r from-blue-200 to-green-200 dark:from-blue-900/30 dark:to-green-900/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">A vs B</span>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
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
                  valueA={scoreA.results.overall_score} 
                  valueB={scoreB.results.overall_score} 
                />
                <ComparisonMetric 
                  label="Central Bank Score" 
                  valueA={scoreA.results.cb_score} 
                  valueB={scoreB.results.cb_score} 
                />
                <ComparisonMetric 
                  label="Inflation Score" 
                  valueA={scoreA.results.inflation_score} 
                  valueB={scoreB.results.inflation_score} 
                />
                <ComparisonMetric 
                  label="Labor Score" 
                  valueA={scoreA.results.labor_score} 
                  valueB={scoreB.results.labor_score} 
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Risk Assessment</h4>
                <ComparisonMetric 
                  label="Risk Score" 
                  valueA={scoreA.results.risk_score} 
                  valueB={scoreB.results.risk_score} 
                />
                <ComparisonMetric 
                  label="PMI Score" 
                  valueA={scoreA.results.pmi_score} 
                  valueB={scoreB.results.pmi_score} 
                />
                <ComparisonMetric 
                  label="Current Account Score" 
                  valueA={scoreA.results.ca_score} 
                  valueB={scoreB.results.ca_score} 
                />
                <ComparisonMetric 
                  label="Geopolitical Score" 
                  valueA={scoreA.results.geo_score} 
                  valueB={scoreB.results.geo_score} 
                />
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <div className="inline-flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 border border-muted">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Scenario A Trading Bias</div>
                  <Badge variant={scoreA.results.trading_bias === 'BUY' ? 'default' : scoreA.results.trading_bias === 'SELL' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                    {scoreA.results.trading_bias}
                  </Badge>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Scenario B Trading Bias</div>
                  <Badge variant={scoreB.results.trading_bias === 'BUY' ? 'default' : scoreB.results.trading_bias === 'SELL' ? 'destructive' : 'secondary'} className="text-sm px-3 py-1">
                    {scoreB.results.trading_bias}
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
