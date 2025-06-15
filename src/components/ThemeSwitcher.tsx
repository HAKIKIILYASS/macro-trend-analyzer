import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<"light"|"dark">(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Listen for system preference change
  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <Card className="p-3 backdrop-blur-sm bg-background/80 border shadow-lg">
      <div className="flex items-center gap-3">
        <Sun size={20} className={cn(
          "transition-colors duration-200",
          theme === "light" 
            ? "text-yellow-500 dark:text-yellow-400" 
            : "text-muted-foreground"
        )} />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={checked => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle theme"
          className="data-[state=checked]:bg-slate-600 data-[state=unchecked]:bg-yellow-200"
        />
        <Moon size={20} className={cn(
          "transition-colors duration-200",
          theme === "dark" 
            ? "text-indigo-400 dark:text-indigo-300" 
            : "text-muted-foreground"
        )} />
      </div>
    </Card>
  );
}
