
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

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
    <div className="flex items-center gap-2">
      <Sun size={18} className={theme === "light" ? "text-yellow-500" : "text-muted-foreground"} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={checked => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon size={18} className={theme === "dark" ? "text-indigo-500" : "text-muted-foreground"} />
    </div>
  );
}
