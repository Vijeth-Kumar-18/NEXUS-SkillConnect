"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AUTH_ROUTES = ["/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  // Auth pages: no sidebar/navbar
  if (isAuthPage) {
    return <>{children}</>;
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
