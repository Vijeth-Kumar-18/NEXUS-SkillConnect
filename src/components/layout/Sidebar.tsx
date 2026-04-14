"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const studentNavItems = [
  { label: "Dashboard",       href: "/dashboard",       icon: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" },
  { label: "Profile",         href: "/profile",         icon: "M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" },
  { label: "Skills",          href: "/skills",          icon: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" },
  { label: "Companies",       href: "/companies",       icon: "M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v8zm-2-6h-4v2h4v-2zm0 4h-4v2h4v-2z" },
  { label: "Recommendations",  href: "/recommendations", icon: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" },
  { label: "Preparation",      href: "/preparation",     icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-2h3v2zm7-4H7v-2h10v2zm0-4H7V7h10v2z" },
  { label: "Skill Gap",       href: "/skill-gap",       icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.4-1.4L12 14.2l4.6-4.6L18 11l-6 6z" },
  { label: "Alumni",           href: "/alumni",          icon: "M5 13.2v4L12 21l7-3.8v-4L12 17l-7-3.8zM12 3L1 9l11 6 9-4.9V17h2V9L12 3z" },
  { label: "Graph",            href: "/graph",           icon: "M12 2a2 2 0 100 4 2 2 0 000-4zM5 9a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM8 11h8M6.5 12.5l4 6M17.5 12.5l-4 6M12 18a2 2 0 100 4 2 2 0 000-4z" },
  { label: "Analytics",        href: "/analytics",       icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" },
];

const adminNavItems = [
  { label: "Admin Dashboard", href: "/admin",           icon: "M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" },
  { label: "Cohorts",         href: "/admin/cohorts",   icon: "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
  { label: "Analytics",       href: "/admin/analytics", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname === '/admin';
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(16px)'
      }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 overflow-hidden relative" style={{ perspective: "200px" }}>
          <div className="absolute w-full h-full border border-indigo-400 rounded-full animate-spin [animation-duration:3s]" style={{ transformStyle: "preserve-3d", transform: "rotateX(45deg)" }} />
          <div className="absolute w-full h-full border border-cyan-400 rounded-full animate-spin [animation-duration:4s]" style={{ transformStyle: "preserve-3d", transform: "rotateY(45deg)" }} />
          <div className="w-3 h-3 bg-white rounded shadow-[0_0_10px_white] rotate-45 z-10" />
        </div>
        <div>
          <p className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-purple-400 leading-tight">NEXUS</p>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-500/80">Placement Intelligence</p>
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
              style={{
                color: isActive ? 'var(--color-accent-light)' : 'var(--color-foreground)',
                borderColor: isActive ? 'var(--color-accent-glow)' : 'transparent',
                backgroundColor: isActive ? 'var(--color-glass)' : 'transparent'
              }}
              className={`
                flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200 border
                ${!isActive && 'hover:bg-black/5 hover:dark:bg-white/5 opacity-80 hover:opacity-100'}
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
      <div className="border-t px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
        {isAdmin && (
           <Link href="/dashboard" className="block text-xs text-center border border-white/10 rounded-lg py-1.5 opacity-60 hover:opacity-100 mb-2 transition-all">Back to Student</Link>
        )}
        <p className="text-[10px] text-center uppercase tracking-widest font-bold" style={{ color: 'var(--color-foreground)', opacity: 0.3 }}>
          © 2026 NEXUS System
        </p>
      </div>
    </aside>
  );
}
