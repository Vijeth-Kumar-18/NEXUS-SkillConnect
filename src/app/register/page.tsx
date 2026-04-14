"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/apiClient";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stepOneData, setStepOneData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    if (step === 1) {
      const captured: Record<string, string> = {
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        degree: String(formData.get("degree") || ""),
        expectedGraduation: String(formData.get("expectedGraduation") || ""),
        password: String(formData.get("password") || ""),
      };
      setStepOneData(captured);
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const skills = String(formData.get("skills") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await fetchJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...stepOneData,
          targetRole: String(formData.get("targetRole") || ""),
          github: String(formData.get("github") || ""),
          linkedin: String(formData.get("linkedin") || ""),
          topSkills: skills,
        }),
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-black pt-28 pb-20">
      <div className="absolute inset-0 bg-dot-white/[0.05] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row gap-12 items-center">
        {/* Marketing Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Detailed Profile, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Better Matches.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            NEXUS requires authentic details to perfectly align your current academic standing, projects, and target career roles with real market data.
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="text-white font-bold text-sm">Academic Sync</h4>
              <p className="text-xs text-gray-400 mt-1">Direct tie to university alumni.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">💻</div>
              <h4 className="text-white font-bold text-sm">Code Analytics</h4>
              <p className="text-xs text-gray-400 mt-1">Live GitHub repo scraping.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="text-white font-bold text-sm">Target Roles</h4>
              <p className="text-xs text-gray-400 mt-1">Specify where you want to go.</p>
            </div>
            <div className="glass p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="text-white font-bold text-sm">Skill Gap Graph</h4>
              <p className="text-xs text-gray-400 mt-1">Visual map of what you lack.</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2"
        >
          <div className="w-full glass p-8 md:p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Step {step}/2</span>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {step === 1 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">First Name</label>
                      <input name="firstName" type="text" required placeholder="Jane" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                      <input name="lastName" type="text" required placeholder="Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">University Email</label>
                    <input name="email" type="email" required placeholder="jane.doe@university.edu" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Degree</label>
                      <select name="degree" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none">
                        <option value="">Select...</option>
                        <option value="Bachelors (B.S. / B.A.)">Bachelors (B.S. / B.A.)</option>
                        <option value="Masters (M.S.)">Masters (M.S.)</option>
                        <option value="Ph.D.">Ph.D.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Expected Grad</label>
                      <select name="expectedGraduation" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none">
                        <option value="">Year...</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Create Password</label>
                    <input name="password" type="password" required placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                  </div>
                  
                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    Continue to Deep Profile →
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Target Career Role</label>
                    <select name="targetRole" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm appearance-none">
                      <option value="">Select your main goal...</option>
                      <option value="swe">Software Engineer (Backend/Frontend)</option>
                      <option value="data">Data Scientist / Analyst</option>
                      <option value="pm">Product Manager</option>
                      <option value="design">UI/UX Designer</option>
                      <option value="cyber">Cybersecurity Analyst</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">GitHub Username (For Auto-Sync)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 text-sm">github.com/</span>
                      <input name="github" type="text" placeholder="username" className="w-full bg-black/50 border border-white/10 rounded-xl pl-28 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">LinkedIn URL</label>
                    <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Top Skills (Comma Separated)</label>
                    <input name="skills" type="text" placeholder="e.g. React, Python, C++, Figma" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" />
                  </div>

                  {error ? <p className="text-xs text-rose-400 font-medium">{error}</p> : null}

                  <div className="flex items-start gap-3 mt-2">
                    <input type="checkbox" id="terms" required className="mt-1" />
                    <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                      I agree to the Terms of Service and Privacy Policy. I authorize NEXUS to analyze my academic and public repository data to provide career roadmap suggestions.
                    </label>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="w-2/3 py-3.5 rounded-xl font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] text-sm disabled:opacity-70">
                      {loading ? "Building..." : "Build Dashboard"}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}