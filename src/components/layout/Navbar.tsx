"use client";

import { usePathname } from "next/navigation";

// Map pathname to readable title
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/skills": "Skills",
  "/companies": "Companies",
  "/recommendations": "Recommendations",
  "/skill-gap": "Skill Gap Analysis",
  "/alumni": "Alumni Network",
  "/analytics": "Analytics",
  "/admin": "Admin Panel",
};

export default function Navbar() {
  const pathname = usePathname();

  // Find the best matching title
  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', backdropFilter: 'blur(16px)' }}>
      {/* Page title */}
      <div className="px-6 py-3.5">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>{title}</h2>
      </div>

      {/* Right side: user placeholder */}
      <div className="flex items-center gap-3 px-6 py-3.5">
        {/* Notification dot */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-black/5 hover:dark:bg-white/5" style={{ color: 'var(--color-foreground)' }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
            U
          </div>
          <span className="text-sm font-medium text-slate-300 hidden sm:block">
            User
          </span>
        </div>
      </div>
    </header>
  );
}
