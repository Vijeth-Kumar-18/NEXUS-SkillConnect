"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-grid relative">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 glass rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold gradient-text">Placement System</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              placeholder="you@college.edu"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              placeholder="••••••••"
            />
          </div>

          <Link href="/dashboard">
            <button
              type="button"
              className="w-full bg-indigo-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-600 transition shadow-[0_0_20px_rgba(99,102,241,0.15)] mt-2"
            >
              Sign In
            </button>
          </Link>
        </form>

        <p className="text-xs text-slate-500 text-center mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
