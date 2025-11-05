"use client";

export function AppFooter() {
  return (
    <footer className="mt-8 sm:mt-16 py-6 sm:py-8 border-t border-border/50 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Dibuat dengan oleh{" "}
            <span className="font-medium text-primary">
              Muhammad Rifqy Saputra
            </span>
          </p>
          <p className="text-xs text-muted-foreground/70">
            © 2025 Groupora AI. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-center gap-1 text-xs text-muted-foreground">
              <span>Powered by</span>
              <span className="font-medium text-blue-500">
                Google Gemini AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
