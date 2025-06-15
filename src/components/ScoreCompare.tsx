
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MacroResults from "@/components/MacroResults";
import DashboardSummary from "@/components/DashboardSummary";
import { cn } from "@/lib/utils";

interface ScoreCompareProps {
  scoreA: { label: string, data: any, results: any } | null;
  scoreB: { label: string, data: any, results: any } | null;
}

export default function ScoreCompare({ scoreA, scoreB }: ScoreCompareProps) {
  return (
    <div className="w-full flex flex-col items-center mb-8">
      <h2 className="text-xl font-bold mb-4">Compare Two Scenarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className={cn("flex flex-col gap-1", !scoreA && "opacity-60")}>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Scenario A {scoreA ? `: ${scoreA.label}` : ""}</CardTitle>
            </CardHeader>
            <CardContent>
              {scoreA?.results ? (
                <>
                  <DashboardSummary data={scoreA.data} results={scoreA.results} />
                  <MacroResults results={scoreA.results} />
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No scenario selected.<br />Select from recent activity.</div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className={cn("flex flex-col gap-1", !scoreB && "opacity-60")}>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Scenario B {scoreB ? `: ${scoreB.label}` : ""}</CardTitle>
            </CardHeader>
            <CardContent>
              {scoreB?.results ? (
                <>
                  <DashboardSummary data={scoreB.data} results={scoreB.results} />
                  <MacroResults results={scoreB.results} />
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No scenario selected.<br />Select from recent activity.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
