"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PublicFooter() {
  return (
    <footer className="w-full relative z-10 border-t border-white/5 bg-black/80 backdrop-blur-3xl pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
              <span className="font-bold text-white text-lg tracking-tighter">N</span>
              <div className="absolute inset-0 rounded-lg border border-white/20"></div>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              NEXUS
            </span>
          </Link>
        </div>
        
        <div>
          <h3 className="font-medium text-white mb-6">Platform</h3>
          <ul className="flex flex-col gap-4">
            <li><Link href="/" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-white mb-6">Legal</h3>
          <ul className="flex flex-col gap-4">
            <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-white mb-6">Ready to start?</h3>
          <Link href="/register" className="inline-block px-6 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors text-center w-full">
            Create an Account
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} NEXUS Placement Intelligence. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
