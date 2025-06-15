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
    const recent = await getSavedScores();
    setScores(recent.slice(0, 5));
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchScores();
  }, [open]);

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
            {scores.length === 0 && (
              <p className="text-xs px-3 py-2 text-muted-foreground">No scores yet.</p>
            )}
            {scores.map((score, idx) => (
              <SidebarMenuItem key={score.id || idx}>
                <SidebarMenuButton asChild>
                  <div className="flex items-center justify-between w-full px-2 py-1 cursor-pointer hover:bg-muted rounded">
                    <div onClick={() => onLoadScore(score.data)} className="flex flex-col items-start w-2/3">
                      <span className="text-sm font-semibold truncate">{score.name}</span>
                      <span className="text-xs text-muted-foreground">{score.timestamp ? new Date(score.timestamp).toLocaleString() : ""}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-1/3 items-end">
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); onCompare(score, "A"); }}>A</Button>
                      <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); onCompare(score, "B"); }}>B</Button>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarFooter>
        <div className="text-xs text-muted-foreground text-center">Click a name to load. <span className="font-medium">A/B</span> to compare.</div>
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
