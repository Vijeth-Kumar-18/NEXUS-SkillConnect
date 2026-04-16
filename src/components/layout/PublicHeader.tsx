"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
            <span className="font-bold text-white text-xl tracking-tighter">N</span>
            <div className="absolute inset-0 rounded-xl border border-white/20"></div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 group-hover:via-white transition-all">
            NEXUS
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm tracking-wide transition-colors ${pathname === "/" ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}>Home</Link>
          <Link href="/about" className={`text-sm tracking-wide transition-colors ${pathname === "/about" ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}>About Us</Link>
          <Link href="/contact" className={`text-sm tracking-wide transition-colors ${pathname === "/contact" ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}>Contact Us</Link>
          <Link href="/privacy" className={`text-sm tracking-wide transition-colors ${pathname === "/privacy" ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}>Privacy Policy</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all">
            Register
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
