"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/apiClient";

type UserRole = "STUDENT" | "ADMIN";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-grid relative">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 glass rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-purple-400 mb-1">NEXUS</h1>
          <p className="text-[10px] text-cyan-200/80 mt-1 uppercase tracking-[0.3em] font-bold">Placement Intelligence</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { label: "Student", value: "STUDENT" },
                { label: "Admin", value: "ADMIN" },
              ] as const).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    role === item.value
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                      : "border-white/10 bg-black/30 text-slate-400 hover:border-indigo-500/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

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

          {error ? <p className="text-xs text-rose-400 font-medium">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-600 transition shadow-[0_0_20px_rgba(99,102,241,0.15)] mt-2 disabled:opacity-70"
          >
            {loading ? "Signing In..." : `Sign In as ${role === "ADMIN" ? "Admin" : "Student"}`}
          </button>
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
