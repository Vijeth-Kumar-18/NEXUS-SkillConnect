"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard",       href: "/dashboard",       icon: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" },
  { label: "Profile",         href: "/profile",         icon: "M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" },
  { label: "Skills",          href: "/skills",          icon: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" },
  { label: "Companies",       href: "/companies",       icon: "M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v8zm-2-6h-4v2h4v-2zm0 4h-4v2h4v-2z" },
  { label: "Recommendations",  href: "/recommendations", icon: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" },
  { label: "Skill Gap",       href: "/skill-gap",       icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.4-1.4L12 14.2l4.6-4.6L18 11l-6 6z" },
  { label: "Alumni",           href: "/alumni",          icon: "M5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8zM12 3L1 9l11 6 9-4.9V17h2V9L12 3z" },
  { label: "Analytics",        href: "/analytics",       icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" },
  { label: "Admin",            href: "/admin",           icon: "M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-white/[0.06] bg-[#0c0d1a]/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
          <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <circle cx="5" cy="6" r="2" />
            <circle cx="19" cy="6" r="2" />
            <circle cx="5" cy="18" r="2" />
            <circle cx="19" cy="18" r="2" />
            <line x1="12" y1="9" x2="5" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="9" x2="19" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="15" x2="5" y2="16" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="15" x2="19" y2="16" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200 leading-tight">Placement</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Graph Analysis</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }
              `}
            >
              <svg
                className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <p className="text-[10px] text-slate-600 text-center">
          © 2026 Placement System
        </p>
      </div>
    </aside>
  );
}
