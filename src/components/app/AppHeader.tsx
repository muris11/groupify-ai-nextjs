"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

interface AppHeaderProps {
  onShowGuide: () => void;
}

export function AppHeader({ onShowGuide }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="text-center space-y-2 animate-fadeIn px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 hover-lift shrink-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain transition-smooth hover:rotate-12 animate-float"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-scaleIn">
          Groupify AI
        </h1>
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-glow shrink-0" />
      </div>
      <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-2">
        Create random groups instantly with smart AI features
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 dark:bg-purple-900/20 rounded-full text-xs sm:text-sm">
          <span className="font-medium">✨ Powered by AI</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowGuide}
            className="rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          >
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="xs:inline">Panduan</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          >
            {theme === "dark" ? (
              <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
