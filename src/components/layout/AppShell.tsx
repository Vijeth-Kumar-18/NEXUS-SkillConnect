"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/about", "/contact", "/privacy", "/terms"];
const HEADER_FOOTER_ROUTES = ["/", "/about", "/contact", "/privacy", "/terms"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ROUTES.includes(pathname);
  const showHeaderFooter = HEADER_FOOTER_ROUTES.includes(pathname);

  // Public pages: no sidebar/navbar (they manage their own layout or are standalone)
  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white selection:bg-indigo-500/30">
        {showHeaderFooter && <PublicHeader />}
        <main className="flex-1 flex flex-col relative w-full overflow-hidden">
          {children}
        </main>
        {showHeaderFooter && <PublicFooter />}
      </div>
    );
  }

  // App pages: sidebar + navbar + content area
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col ml-60 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-dot-grid">
          {children}
        </main>
      </div>
    </div>
  );
}
