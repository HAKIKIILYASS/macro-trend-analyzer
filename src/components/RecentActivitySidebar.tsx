
import React, { useState, useEffect } from "react";
import { getSavedScores } from "@/utils/localServerStorage";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Menu, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecentActivitySidebarProps {
  onLoadScore: (data: any) => void;
  onCompare: (data: any, slot: "A" | "B") => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RecentActivitySidebar({ onLoadScore, onCompare, open, setOpen }: RecentActivitySidebarProps) {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const fetchScores = async () => {
    setLoading(true);
    try {
      const recent = await getSavedScores();
      setScores(recent.slice(0, 10)); // Show more scores for comparison
    } catch (error) {
      console.error('Error fetching scores:', error);
      setScores([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchScores();
  }, [open]);

  const handleCompareClick = (score: any, slot: "A" | "B", event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Compare clicked:', slot, score.name);
    onCompare(score, slot);
  };

  const handleLoadClick = (score: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Load clicked:', score.name);
    onLoadScore(score.data);
  };

  // For desktop, always show. For mobile, show as overlay drawer.
  const Content = (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          Recent Scores
          <Button variant="ghost" size="icon" onClick={fetchScores} className="ml-1" title="Refresh" disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {loading && (
              <p className="text-xs px-3 py-2 text-muted-foreground">Loading scores...</p>
            )}
            {!loading && scores.length === 0 && (
              <p className="text-xs px-3 py-2 text-muted-foreground">No scores yet. Save some scores first!</p>
            )}
            {!loading && scores.map((score, idx) => (
              <SidebarMenuItem key={score.id || idx} className="mb-2">
                <div className="p-2 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div 
                    onClick={(e) => handleLoadClick(score, e)}
                    className="cursor-pointer mb-2 pb-2 border-b border-border/50"
                  >
                    <div className="text-sm font-semibold truncate mb-1">{score.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Score: {score.totalScore?.toFixed(2) || 'N/A'} | {score.bias || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {score.timestamp ? new Date(score.timestamp).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => handleCompareClick(score, "A", e)}
                      className="text-xs px-3 py-1 h-7 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      Set as A
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => handleCompareClick(score, "B", e)}
                      className="text-xs px-3 py-1 h-7 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      Set as B
                    </Button>
                  </div>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground text-center p-2">
          <div className="font-medium mb-1">How to compare:</div>
          <div>1. Click name to load scenario</div>
          <div>2. Use "Set as A" and "Set as B" buttons</div>
          <div>3. View comparison above</div>
        </div>
      </SidebarFooter>
    </SidebarContent>
  );

  if (!isMobile) {
    return (
      <Sidebar className={`transition-all duration-200 ${open ? "translate-x-0" : "-translate-x-full"} shadow-md z-40 min-h-screen`}>
        {Content}
      </Sidebar>
    );
  }

  // Drawer overlay for mobile
  return (
    <div>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="fixed top-3 left-3 z-50 rounded-full bg-white/70 backdrop-blur-sm shadow-md">
        <Menu size={22} />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/25" onClick={() => setOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-4/5 sm:w-80 bg-background shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b px-3 py-2">
              <span className="font-bold text-lg">Recent Activity</span>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X size={20} /></Button>
            </div>
            {Content}
          </div>
        </div>
      )}
    </div>
  );
}
