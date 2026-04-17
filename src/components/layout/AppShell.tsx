"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { fetchJson } from "@/lib/apiClient";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/about", "/contact", "/privacy", "/terms"];
const HEADER_FOOTER_ROUTES = ["/", "/about", "/contact", "/privacy", "/terms"];

interface MePayload {
  user: {
    id: string;
    role: "STUDENT" | "ADMIN";
    email: string;
    name: string;
    studentId: string | null;
  };
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ROUTES.includes(pathname);
  const showHeaderFooter = HEADER_FOOTER_ROUTES.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  const [authChecked, setAuthChecked] = useState(isPublicPage && !isAdminRoute);
  const [isAllowed, setIsAllowed] = useState(isPublicPage && !isAdminRoute);

  useEffect(() => {
    if (isPublicPage && !isAdminRoute) {
      return;
    }

    let active = true;

    fetchJson<MePayload>("/api/auth/me")
      .then((me) => {
        if (!active) {
          return;
        }

        const role = me.user.role;
        if (isAdminRoute && role !== "ADMIN") {
          router.replace("/dashboard");
          setIsAllowed(false);
          setAuthChecked(true);
          return;
        }

        if (!isAdminRoute && role === "ADMIN") {
          router.replace("/admin");
          setIsAllowed(false);
          setAuthChecked(true);
          return;
        }

        setIsAllowed(true);
        setAuthChecked(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        router.replace("/login");
        setIsAllowed(false);
        setAuthChecked(true);
      });

    return () => {
      active = false;
    };
  }, [isAdminRoute, isPublicPage, router]);

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

  if (!authChecked || !isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-sm font-semibold text-slate-300">Loading workspace...</p>
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
