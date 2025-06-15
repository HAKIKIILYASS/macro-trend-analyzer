
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MacroResults from "@/components/MacroResults";
import DashboardSummary from "@/components/DashboardSummary";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

interface ScoreCompareProps {
  scoreA: { label: string, data: any, results: any } | null;
  scoreB: { label: string, data: any, results: any } | null;
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
    return diff > 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };
  
  const getDiffColor = () => {
    if (Math.abs(diff) < 0.01) return "text-muted-foreground";
    return diff > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm">{formatValue(valueA)}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm">{formatValue(valueB)}</span>
        <div className="flex items-center gap-1 ml-2">
          {getDiffIcon()}
          <span className={cn("text-xs font-medium", getDiffColor())}>
            {format === "percentage" ? `${diff.toFixed(1)}pp` : `${diff > 0 ? '+' : ''}${diff.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ScoreCompare({ scoreA, scoreB }: ScoreCompareProps) {
  const hasComparison = scoreA && scoreB && scoreA.results && scoreB.results;

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-center">Compare Scenarios</h2>
        {hasComparison && (
          <Badge variant="secondary" className="animate-pulse">
            Active Comparison
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl">
        {/* Scenario A */}
        <div className={cn("flex flex-col gap-4", !scoreA && "opacity-60")}>
          <Card className="animate-fade-in border-l-4 border-l-blue-500 dark:border-l-blue-400">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">A</div>
                Scenario A {scoreA ? `: ${scoreA.label}` : ""}
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
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm">No scenario selected</div>
                  <div className="text-xs mt-1">Choose from recent activity</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scenario B */}
        <div className={cn("flex flex-col gap-4", !scoreB && "opacity-60")}>
          <Card className="animate-fade-in border-l-4 border-l-green-500 dark:border-l-green-400">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">B</div>
                Scenario B {scoreB ? `: ${scoreB.label}` : ""}
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
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-2">📈</div>
                  <div className="text-sm">No scenario selected</div>
                  <div className="text-xs mt-1">Choose from recent activity</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comparison Summary */}
      {hasComparison && (
        <Card className="w-full max-w-4xl mt-8 animate-scale-in border-2 border-primary/20 dark:border-primary/30">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">A vs</span>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">B</span>
              </div>
              Comparison Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Key Metrics</h4>
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
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Risk Metrics</h4>
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
              <div className="inline-flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Scenario A Bias</div>
                  <Badge variant={scoreA.results.trading_bias === 'BUY' ? 'default' : scoreA.results.trading_bias === 'SELL' ? 'destructive' : 'secondary'}>
                    {scoreA.results.trading_bias}
                  </Badge>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Scenario B Bias</div>
                  <Badge variant={scoreB.results.trading_bias === 'BUY' ? 'default' : scoreB.results.trading_bias === 'SELL' ? 'destructive' : 'secondary'}>
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
